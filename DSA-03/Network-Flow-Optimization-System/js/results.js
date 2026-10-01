const nodes =
    JSON.parse(
        localStorage.getItem(
            "networkNodes"
        ) || "[]"
    );


const edges =
    JSON.parse(
        localStorage.getItem(
            "networkEdges"
        ) || "[]"
    );


const source =
    localStorage.getItem(
        "sourceNode"
    ) || "-";


const destination =
    localStorage.getItem(
        "destinationNode"
    ) || "-";


const maximumFlow =
    localStorage.getItem(
        "maximumFlow"
    ) || "-";


const dinicFlow =
    localStorage.getItem(
        "dinicFlow"
    ) || "-";


const dinicTime =
    localStorage.getItem(
        "dinicTime"
    ) || "-";


const ekFlow =
    localStorage.getItem(
        "edmondsKarpFlow"
    ) || "-";


const ekTime =
    localStorage.getItem(
        "edmondsKarpTime"
    ) || "-";


const stages =
    JSON.parse(
        localStorage.getItem(
            "dinicStages"
        ) || "[]"
    );


/* BASIC RESULTS */

document.getElementById(
    "sourceResult"
).textContent =
    source;


document.getElementById(
    "destinationResult"
).textContent =
    destination;


document.getElementById(
    "flowResult"
).textContent =
    maximumFlow;


document.getElementById(
    "connectionResult"
).textContent =
    edges.length;


document.getElementById(
    "largeFlow"
).textContent =
    maximumFlow;


/* SUMMARY */

if (
    maximumFlow !== "-"
) {

    document.getElementById(
        "summaryText"
    ).textContent =
        `The maximum flow from ${source} to ${destination} is ${maximumFlow} units using Dinic's Algorithm.`;

}


/* PERFORMANCE */

document.getElementById(
    "resultDinicFlow"
).textContent =
    dinicFlow;


document.getElementById(
    "resultDinicTime"
).textContent =
    dinicTime === "-"
        ? "-"
        : dinicTime + " ms";


document.getElementById(
    "resultEKFlow"
).textContent =
    ekFlow;


document.getElementById(
    "resultEKTime"
).textContent =
    ekTime === "-"
        ? "-"
        : ekTime + " ms";


/* NETWORK TABLE */

const table =
    document.getElementById(
        "resultTable"
    );


if (
    edges.length === 0
) {

    table.innerHTML = `

        <tr>

            <td colspan="5">
                No network connections available.
            </td>

        </tr>

    `;

} else {

    edges.forEach(
        function (
            edge,
            index
        ) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${edge.source}
                </td>

                <td>
                    ${edge.destination}
                </td>

                <td>
                    ${edge.capacity}
                </td>

                <td>
                    ${edge.cost}
                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


/* DINIC STAGES */

const stageContainer =
    document.getElementById(
        "resultsStages"
    );


if (
    stages.length === 0
) {

    stageContainer.innerHTML = `

        <p>
            No Dinic execution stages available.
        </p>

    `;

} else {

    stages.forEach(
        function (
            stage,
            index
        ) {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "result-stage";


            let levelHTML =
                '<div class="result-levels">';


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
                                class="result-level"
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


            box.innerHTML = `

                <h3>
                    Phase ${index + 1}
                </h3>


                <p>
                    <strong>
                        Level Graph:
                    </strong>
                </p>

                ${levelHTML}


                <p>
                    <strong>
                        Blocking Flow:
                    </strong>

                    ${stage.blockingFlow}
                    units
                </p>


                <p>
                    <strong>
                        Total Flow:
                    </strong>

                    ${stage.totalFlow}
                    units
                </p>

            `;


            stageContainer.appendChild(
                box
            );

        }
    );

}


/* MODIFY NETWORK */

function modifyNetwork() {

    window.location.href =
        "network.html";

}


/* CLEAR NETWORK */

function clearNetwork() {

    const confirmation =
        confirm(
            "Are you sure you want to clear the entire network?"
        );


    if (
        !confirmation
    ) {

        return;

    }


    localStorage.removeItem(
        "networkNodes"
    );


    localStorage.removeItem(
        "networkEdges"
    );


    localStorage.removeItem(
        "sourceNode"
    );


    localStorage.removeItem(
        "destinationNode"
    );


    localStorage.removeItem(
        "maximumFlow"
    );


    localStorage.removeItem(
        "dinicFlow"
    );


    localStorage.removeItem(
        "dinicTime"
    );


    localStorage.removeItem(
        "edmondsKarpFlow"
    );


    localStorage.removeItem(
        "edmondsKarpTime"
    );


    localStorage.removeItem(
        "dinicStages"
    );


    window.location.href =
        "network.html";

}