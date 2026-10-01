let nodes = [];

let edges = [];


// LOAD SAVED NETWORK

const savedNodes =
    localStorage.getItem("networkNodes");

const savedEdges =
    localStorage.getItem("networkEdges");


if (savedNodes) {
    nodes = JSON.parse(savedNodes);
}


if (savedEdges) {
    edges = JSON.parse(savedEdges);
}


// PAGE LOAD

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateNodeDisplay();

        updateDropdowns();

        displayEdges();

    }
);


// ADD NODE

function addNode() {

    const input =
        document.getElementById(
            "nodeInput"
        );


    const nodeName =
        input.value.trim();


    if (nodeName === "") {

        alert(
            "Please enter a node name."
        );

        return;

    }


    if (
        nodes.includes(nodeName)
    ) {

        alert(
            "This node already exists."
        );

        return;

    }


    nodes.push(nodeName);


    input.value = "";


    updateNodeDisplay();

    updateDropdowns();

    saveNetwork();

}


// DISPLAY NODES



  // DISPLAY NODES

function updateNodeDisplay() {

    const nodeList =
        document.getElementById("nodeList");

    if (!nodeList) {
        return;
    }

    nodeList.innerHTML = "";

    nodes.forEach(function (node) {

        const nodeContainer =
            document.createElement("div");

        nodeContainer.className = "node-container";


        // Node name

        const nodeElement =
            document.createElement("span");

        nodeElement.className = "node-item";

        nodeElement.textContent = node;


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-node-btn";

        deleteButton.textContent =
            "Delete";

        deleteButton.onclick = function () {
            deleteNode(node);
        };


        nodeContainer.appendChild(
            nodeElement
        );

        nodeContainer.appendChild(
            deleteButton
        );


        nodeList.appendChild(
            nodeContainer
        );

    });

}
// DELETE NODE

function deleteNode(nodeName) {

    const confirmation =
        confirm(
            `Are you sure you want to delete node "${nodeName}"?`
        );

    if (!confirmation) {
        return;
    }


    // Remove node

    nodes =
        nodes.filter(function (node) {
            return node !== nodeName;
        });


    // Remove all connections
    // connected to this node

    edges =
        edges.filter(function (edge) {

            return (
                edge.source !== nodeName &&
                edge.destination !== nodeName
            );

        });


    // Update the page

    updateNodeDisplay();

    updateDropdowns();

    displayEdges();

    saveNetwork();

}
// UPDATE DROPDOWNS

function updateDropdowns() {

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


// ADD EDGE

function addEdge() {

    const source =
        document.getElementById(
            "sourceNode"
        ).value;


    const destination =
        document.getElementById(
            "destinationNode"
        ).value;


    const capacity =
        document.getElementById(
            "capacityInput"
        ).value;


    const cost =
        document.getElementById(
            "costInput"
        ).value || 0;


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
            "Source and destination cannot be the same."
        );

        return;

    }


    if (
        capacity === "" ||
        Number(capacity) <= 0
    ) {

        alert(
            "Please enter a valid capacity."
        );

        return;

    }


    edges.push({

        source: source,

        destination: destination,

        capacity: Number(capacity),

        cost: Number(cost)

    });


    document.getElementById(
        "capacityInput"
    ).value = "";


    document.getElementById(
        "costInput"
    ).value = "";


    displayEdges();

    saveNetwork();

}


// DISPLAY EDGES

function displayEdges() {

    const table =
        document.getElementById(
            "edgeTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (edges.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6">
                    No connections added yet.
                </td>

            </tr>

        `;

        return;

    }


    edges.forEach(
        function (edge, index) {

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

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteEdge(${index})"
                    >
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


// DELETE EDGE

function deleteEdge(index) {

    edges.splice(
        index,
        1
    );


    displayEdges();

    saveNetwork();

}


// SAVE NETWORK

function saveNetwork() {

    localStorage.setItem(
        "networkNodes",
        JSON.stringify(nodes)
    );


    localStorage.setItem(
        "networkEdges",
        JSON.stringify(edges)
    );

}


// GO TO OPTIMIZATION

function goToOptimization() {

    if (nodes.length < 2) {

        alert(
            "Please add at least 2 nodes."
        );

        return;

    }


    if (edges.length === 0) {

        alert(
            "Please add at least one connection."
        );

        return;

    }


    saveNetwork();


    window.location.href =
        "optimization.html";

}