let nodes = JSON.parse(
    localStorage.getItem("networkNodes") || "[]"
);

let edges = JSON.parse(
    localStorage.getItem("networkEdges") || "[]"
);

let dinicStages = [];


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateNetworkSummary();

        loadNodeDropdowns();

        loadPreviousResults();

    }
);


/* =========================
   NETWORK SUMMARY
========================= */

function updateNetworkSummary() {

    const nodeCount =
        document.getElementById(
            "nodeCount"
        );

    const edgeCount =
        document.getElementById(
            "edgeCount"
        );


    if (nodeCount) {

        nodeCount.value =
            nodes.length;

    }


    if (edgeCount) {

        edgeCount.value =
            edges.length;

    }

}


/* =========================
   DROPDOWNS
========================= */

function loadNodeDropdowns() {

    const sourceSelect =
        document.getElementById(
            "sourceNode"
        );


    const destinationSelect =
        document.getElementById(
            "destinationNode"
        );


    if (
        !sourceSelect ||
        !destinationSelect
    ) {

        return;

    }


    sourceSelect.innerHTML =
        '<option value="">Select Source</option>';


    destinationSelect.innerHTML =
        '<option value="">Select Destination</option>';


    nodes.forEach(
        function (node) {

            const sourceOption =
                document.createElement(
                    "option"
                );


            sourceOption.value =
                node;

            sourceOption.textContent =
                node;


            sourceSelect.appendChild(
                sourceOption
            );


            const destinationOption =
                document.createElement(
                    "option"
                );


            destinationOption.value =
                node;

            destinationOption.textContent =
                node;


            destinationSelect.appendChild(
                destinationOption
            );

        }
    );

}


/* =========================
   DINIC GRAPH
========================= */

function createDinicGraph() {

    const graph = {};


    nodes.forEach(
        function (node) {

            graph[node] = [];

        }
    );


    edges.forEach(
        function (edge) {

            const capacity =
                Number(edge.capacity);


            const forward = {

                to:
                    edge.destination,

                rev:
                    graph[
                        edge.destination
                    ].length,

                cap:
                    capacity

            };


            const reverse = {

                to:
                    edge.source,

                rev:
                    graph[
                        edge.source
                    ].length,

                cap:
                    0

            };


            graph[
                edge.source
            ].push(forward);


            graph[
                edge.destination
            ].push(reverse);

        }
    );


    return graph;
}


/* =========================
   BUILD LEVEL GRAPH
   BFS
========================= */

function buildLevelGraph(
    graph,
    source,
    sink
) {

    const level = {};


    nodes.forEach(
        function (node) {

            level[node] = -1;

        }
    );


    const queue = [];


    level[source] = 0;

    queue.push(source);


    let front = 0;


    while (
        front < queue.length
    ) {

        const current =
            queue[front++];


        for (
            const edge of
            graph[current]
        ) {

            if (
                edge.cap > 0 &&
                level[edge.to] === -1
            ) {

                level[edge.to] =
                    level[current] + 1;


                queue.push(
                    edge.to
                );

            }

        }

    }


    return level;
}


/* =========================
   SEND FLOW
   DFS
========================= */

function sendFlow(
    graph,
    current,
    sink,
    flow,
    level,
    nextEdge
) {

    if (
        current === sink
    ) {

        return flow;

    }


    while (
        nextEdge[current] <
        graph[current].length
    ) {

        const edge =
            graph[current][
                nextEdge[current]
            ];


        if (
            edge.cap > 0 &&
            level[edge.to] ===
            level[current] + 1
        ) {

            const pushed =
                sendFlow(
                    graph,
                    edge.to,
                    sink,
                    Math.min(
                        flow,
                        edge.cap
                    ),
                    level,
                    nextEdge
                );


            if (
                pushed > 0
            ) {

                edge.cap -=
                    pushed;


                graph[
                    edge.to
                ][
                    edge.rev
                ].cap +=
                    pushed;


                return pushed;

            }

        }


        nextEdge[current]++;

    }


    return 0;
}


/* =========================
   DINIC'S ALGORITHM
========================= */

function runDinic(
    source,
    sink
) {

    const graph =
        createDinicGraph();


    let maximumFlow = 0;

    dinicStages = [];


    while (true) {

        const level =
            buildLevelGraph(
                graph,
                source,
                sink
            );


        if (
            level[sink] === -1
        ) {

            break;

        }


        const levelGraph = {};


        nodes.forEach(
            function (node) {

                levelGraph[node] =
                    level[node];

            }
        );


        const nextEdge = {};


        nodes.forEach(
            function (node) {

                nextEdge[node] =
                    0;

            }
        );


        let blockingFlow = 0;


        while (true) {

            const flow =
                sendFlow(
                    graph,
                    source,
                    sink,
                    Infinity,
                    level,
                    nextEdge
                );


            if (
                flow === 0
            ) {

                break;

            }


            blockingFlow +=
                flow;


            maximumFlow +=
                flow;

        }


        dinicStages.push({

            levelGraph:
                levelGraph,

            blockingFlow:
                blockingFlow,

            totalFlow:
                maximumFlow

        });

    }


    return maximumFlow;
}


/* =========================
   EDMONDS-KARP
========================= */

function runEdmondsKarp(
    source,
    sink
) {

    const graph = {};


    nodes.forEach(
        function (node) {

            graph[node] = {};

        }
    );


    edges.forEach(
        function (edge) {

            if (
                graph[
                    edge.source
                ][
                    edge.destination
                ] === undefined
            ) {

                graph[
                    edge.source
                ][
                    edge.destination
                ] = 0;

            }


            graph[
                edge.source
            ][
                edge.destination
            ] +=
                Number(
                    edge.capacity
                );


            if (
                graph[
                    edge.destination
                ][
                    edge.source
                ] === undefined
            ) {

                graph[
                    edge.destination
                ][
                    edge.source
                ] = 0;

            }

        }
    );


    let maximumFlow = 0;


    while (true) {

        const parent = {};

        const visited =
            new Set();


        const queue = [
            source
        ];


        visited.add(
            source
        );


        let front = 0;


        while (
            front < queue.length
        ) {

            const current =
                queue[front++];


            if (
                !graph[current]
            ) {

                continue;

            }


            for (
                const neighbor
                in graph[current]
            ) {

                if (
                    !visited.has(
                        neighbor
                    ) &&
                    graph[current]
                        [neighbor] > 0
                ) {

                    parent[
                        neighbor
                    ] = current;


                    visited.add(
                        neighbor
                    );


                    queue.push(
                        neighbor
                    );

                }

            }

        }


        if (
            !visited.has(sink)
        ) {

            break;

        }


        let pathFlow =
            Infinity;


        let current =
            sink;


        while (
            current !== source
        ) {

            const previous =
                parent[current];


            pathFlow =
                Math.min(
                    pathFlow,
                    graph[
                        previous
                    ][
                        current
                    ]
                );


            current =
                previous;

        }


        current =
            sink;


        while (
            current !== source
        ) {

            const previous =
                parent[current];


            graph[
                previous
            ][
                current
            ] -=
                pathFlow;


            if (
                graph[
                    current
                ][
                    previous
                ] === undefined
            ) {

                graph[
                    current
                ][
                    previous
                ] = 0;

            }


            graph[
                current
            ][
                previous
            ] +=
                pathFlow;


            current =
                previous;

        }


        maximumFlow +=
            pathFlow;

    }


    return maximumFlow;
}


/* =========================
   RUN OPTIMIZATION
========================= */

function runOptimization() {

    const source =
        document.getElementById(
            "sourceNode"
        ).value;


    const destination =
        document.getElementById(
            "destinationNode"
        ).value;


    if (
        source === "" ||
        destination === ""
    ) {

        alert(
            "Please select source and destination."
        );

        return;

    }


    if (
        source === destination
    ) {

        alert(
            "Source and destination must be different."
        );

        return;

    }


    /* DINIC */

    const dinicStart =
        performance.now();


    const dinicFlow =
        runDinic(
            source,
            destination
        );


    const dinicEnd =
        performance.now();


    const dinicTime =
        dinicEnd -
        dinicStart;


    /* EDMONDS-KARP */

    const ekStart =
        performance.now();


    const ekFlow =
        runEdmondsKarp(
            source,
            destination
        );


    const ekEnd =
        performance.now();


    const ekTime =
        ekEnd -
        ekStart;


    /* DISPLAY FLOW */

    const maxFlow =
        document.getElementById(
            "maxFlow"
        );


    maxFlow.textContent =
        dinicFlow;


    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    resultMessage.textContent =
        `Dinic's Algorithm calculated a maximum flow of ${dinicFlow} from ${source} to ${destination}.`;


    /* DISPLAY PERFORMANCE */

    document.getElementById(
        "dinicFlowResult"
    ).textContent =
        dinicFlow;


    document.getElementById(
        "dinicTimeResult"
    ).textContent =
        dinicTime.toFixed(4)
        + " ms";


    document.getElementById(
        "ekFlowResult"
    ).textContent =
        ekFlow;


    document.getElementById(
        "ekTimeResult"
    ).textContent =
        ekTime.toFixed(4)
        + " ms";


    /* DISPLAY STAGES */

    displayDinicStages();


    /* SAVE RESULTS */

    localStorage.setItem(
        "sourceNode",
        source
    );


    localStorage.setItem(
        "destinationNode",
        destination
    );


    localStorage.setItem(
        "maximumFlow",
        dinicFlow
    );


    localStorage.setItem(
        "dinicFlow",
        dinicFlow
    );


    localStorage.setItem(
        "dinicTime",
        dinicTime.toFixed(4)
    );


    localStorage.setItem(
        "edmondsKarpFlow",
        ekFlow
    );


    localStorage.setItem(
        "edmondsKarpTime",
        ekTime.toFixed(4)
    );


    localStorage.setItem(
        "dinicStages",
        JSON.stringify(
            dinicStages
        )
    );

}


/* =========================
   DISPLAY DINIC STAGES
========================= */

function displayDinicStages() {

    const container =
        document.getElementById(
            "stageContainer"
        );


    container.innerHTML = "";


    if (
        dinicStages.length === 0
    ) {

        container.innerHTML = `

            <p>
                No level graph could reach
                the destination.
            </p>

        `;

        return;

    }


    dinicStages.forEach(
        function (
            stage,
            index
        ) {

            const stageBox =
                document.createElement(
                    "div"
                );


            stageBox.className =
                "stage-box";


            let levelHTML =
                '<div class="level-list">';


            Object.entries(
                stage.levelGraph
            ).forEach(
                function (
                    [node, level]
                ) {

                    if (
                        level >= 0
                    ) {

                        levelHTML += `

                            <div
                                class="level-item"
                            >
                                ${node}
                                →
                                Level
                                ${level}
                            </div>

                        `;

                    }

                }
            );


            levelHTML +=
                "</div>";


            stageBox.innerHTML = `

                <h3>
                    Phase ${index + 1}
                </h3>


                <h4>
                    Level Graph
                </h4>

                ${levelHTML}


                <h4>
                    Blocking Flow
                </h4>

                <p
                    class="blocking-flow"
                >
                    ${stage.blockingFlow}
                    units
                </p>


                <h4>
                    Total Flow After Phase
                </h4>

                <p>
                    ${stage.totalFlow}
                    units
                </p>

            `;


            container.appendChild(
                stageBox
            );

        }
    );

}


/* =========================
   LOAD PREVIOUS RESULTS
========================= */

function loadPreviousResults() {

    const savedSource =
        localStorage.getItem(
            "sourceNode"
        );


    const savedDestination =
        localStorage.getItem(
            "destinationNode"
        );


    if (
        savedSource &&
        savedDestination
    ) {

        const sourceSelect =
            document.getElementById(
                "sourceNode"
            );


        const destinationSelect =
            document.getElementById(
                "destinationNode"
            );


        if (
            sourceSelect
                .querySelector(
                    `option[value="${savedSource}"]`
                )
        ) {

            sourceSelect.value =
                savedSource;

        }


        if (
            destinationSelect
                .querySelector(
                    `option[value="${savedDestination}"]`
                )
        ) {

            destinationSelect.value =
                savedDestination;

        }

    }

}


/* =========================
   RESULTS PAGE
========================= */

function goToResults() {

    const maximumFlow =
        localStorage.getItem(
            "maximumFlow"
        );


    if (
        maximumFlow === null
    ) {

        alert(
            "Please run the optimization first."
        );

        return;

    }


    window.location.href =
        "results.html";

}