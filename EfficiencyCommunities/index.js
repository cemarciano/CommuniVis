var network;							// Network objects
var data, edges;						// Networks data
var container;							// Networks DOM object
var currState = 0;						// Current state of the animation
var options = {							// Networks initialization options
	layout: {randomSeed: 44},
	physics: {enabled: true},
	interaction: {
		dragNodes: true,
		dragView: false,
		zoomView: false
	},
	autoResize: true,
	nodes: {
		shape: "dot",
		scaling: {
			label: {
				min: 2,
				max: 2,
			},
		},
	},
};
var nodeColor = {
	border: '#2B7CE9',
	background: '#D2E5FF',
	highlight: {
		border: '#2B7CE9',
		background: '#D2E5FF'
	}
}
var seedNodeColor = {
	border: '#2B7CE9',
	background: 'red',
	highlight: {
		border: '#2B7CE9',
		background: 'red'
	}
}
var edgeColor = {
	color: '#add0ff',
	highlight: '#2B7CE9',
	opacity: 1.0
}

// Nodes in the network:
var nodes = new vis.DataSet([
	{id: 1, label: 'W.H.O.', center: 0, informed: true},
	{id: 4, label: 'Justin Trudeau', center: 1.8},
	{id: 8, label: "Alberto Fernández", center: 2.4},
	{id: 9, label: "Putin", center: 5.1},
	{id: 5, label: 'Maduro', center: 7.5},
	{id: 13, label: "Kim Jong-un", center: 6.6},
	{id: 3, label: 'Trump', center: -6.7},
	{id: 2, label: 'Bolsonaro', center: -7.3},
	{id: 11, label: "Boris Johnson", center: -4.1},
	{id: 7, label: "Macron", center: -2.1},
	{id: 6, label: "Angela Merkel", center: -2.5},
	{id: 12, label: "Tsai Ing-wen", center: 3.1},
	{id: 10, label: "Jacinda Ardern", center: 1.6},
]);


// Edges in the network:
var edges = new vis.DataSet([]);


// Startup function:
function createNetwork(){
	// Processes nodes:
	nodes.forEach(function(item1){
		// Custom color for node:
		item1.color = nodeColor;
		// Edge creation:
		nodes.forEach(function(item2){
			// Only creates edge if pair hasn't been examined yet:
			if (item2.id > item1.id){
				// Calculates function of edge value:
				let distance = Math.abs(item1.center - item2.center);
				let probability = Math.abs(distance-15)/16;
				let threshold = 0.7;
				// Only creates edge if distance is over a threshold:
				if ((probability >= threshold) || (item1.informed === true)){
					// Creates edge:
					let newEdge = {from: item1.id, to: item2.id, color: edgeColor, value: 0.3*Math.pow(100/distance, 1/20)};
					// Commits new edge:
					edges.add(newEdge);
				}
			}
		});
		// Commits changes to node:
		nodes.update(item1);
	});

	// Creates network:
	container = document.getElementById('main-network');
	data = {
		nodes: nodes,
		edges: edges
	};
	network = new vis.Network(container, data, options);
	// Draws nodes in a circle:
	network.on('initRedraw', () => drawCircular())

	nextState(currState);
	$("#next").on("click", () => {
		currState += 1
		nextState(currState)
	});
}

// Puts network nodes in a circle:
function drawCircular(){
	// Circle radius for inner and outer circles:
	var radiusInf =0;//200
	var radiusNot = window.innerHeight*0.48;//435
	// Gets the ids of Informed nodes:
	var idsInf = data.nodes.get({
		filter: function (item) {
			return (item.informed === true);
		}
	}).map(item => item.id);
	// Gets the ids of non-Informed nodes:
	var idsNot = data.nodes.get({
		filter: function (item) {
			return (item.informed !== true);
		}
	}).map(item => item.id);
	// Calculates angular pitch:
	var dInf = 2 * Math.PI / idsInf.length // Angular pitch
	var dNot = 2 * Math.PI / idsNot.length // Angular pitch
	// Positions Informed nodes accordingly:
	idsInf.forEach(function(id, i) {
		var x = radiusInf * Math.cos(dInf * i);
		var y = radiusInf * Math.sin(dInf * i);
		network.moveNode(id, x, y);
	})
	// Positions non-Informed nodes accordingly:
	idsNot.forEach(function(id, i) {
		var x = radiusNot * Math.cos(dNot * i);
		var y = radiusNot * Math.sin(dNot * i);
		network.moveNode(id, x, y);
	})
	// Moves the network slightly to the right:
	network.moveTo({position: {x: 0, y:20}});
}


// Number of nodes in the seed group:
var seedSize = 2;

// Function to transition to the next state of the simulation:
function nextState(state){
	if (state == 0){
		$("#explanation").html('This fictional example portrays how the ideologies of each president are aligned in the <b>core-periphery</b> international community. The <b>center of interest</b> of each node can be seen in the &#8477; line below.');
		$("#explanation2").html('Thickness of edges are proportional to the <b>distance</b> between the centers of interest of end-nodes y and z (see line below for values):');
		$("#explanation3").html('<div style="color:#b30202"><b>distance(y,z)</b> = | center(y) \u2013 center(z) |</div>');
		$("#explanation4").html('Content produced by agent y will be <b>interesting</b> to agent z with probability:');
		$("#explanation5").html('<div style="color:#b30202"><b>B(y|z)</b> = | (distance(y,z) \u2013 15) / 16 |</div>');
		$("#explanation6").html('All periphery agents are connected to the core. However, edges between periphery agents y and z only exist if <b>B(y|z) &#8805; 0.7</b> (threshold).');
	}
}

// Generates the first people in the network to adopt the trend, the "early adopters":
function generateEarlyAdopters(){
	// Selects informed nodes:
	var informed = data.nodes.get({filter: item => item.informed === true});
	// Seed group:
	var seedGroup = [];
	// Gets *seedSize* samples (or until no informed nodes remain):
	for (var i = 0; ((i<seedSize) || (informed.length == 0)); i++){
		// Generates random seed:
		let chosenId = Math.floor(Math.random()*informed.length);
		// Appends this id to the seed group:
		seedGroup.push(informed[chosenId]);
		// Removes this id from the pool:
		informed.splice(chosenId, 1);
	}
	// Now that we have our seed nodes, let's color them:
	var adopters = [];
	seedGroup.forEach(item => {
		item.color = seedNodeColor;
		item.adopted = true;
		nodes.update(item);
		adopters.push(item.label);
	});
	// Returns the name of the adopters:
	return adopters;
}

// Given the "early adopters", this function will randomly spread the trend among other "informed" adopters:
function spreadInformedAdopters(){
	let adopters = [];
	// Look for the nodes that are not adopters:
	nodes.forEach(item => {
		if ((!item.adopted) && (item.informed)){
			let dice = Math.random();
			if (dice <= 0.4){
				item.color = seedNodeColor;
				item.adopted = true;
				nodes.update(item);
				adopters.push(item.label);
			}
		}
	});
	// Returns the name of the adopters:
	return adopters;
}

// Spreads the trend among the outer ring:
function spreadImitators(){
	let fractions = [];
	let countInformed = 0;
	let countImitators = 0;
	// Look for the nodes that are not adopters:
	nodes.forEach(item => {
		if ((item.adopted) && (item.informed)){
			countInformed += 1;
		} else if (!item.informed){
			// Retrieves neighbors of this node:
			let neighEdgeIds = network.getConnectedEdges(item.id);
			let neighEdges = data.edges.get(neighEdgeIds);
			let neighbors = data.nodes.get(neighEdges.map(j => j.from));
			// Count how many neighbors adopted the trend:
			let adoptedCount = 0;
			neighbors.forEach(neigh => {
				if (neigh.adopted === true){
					adoptedCount += 1;
				}
			});
			// If more than 2 neighbors adopted, adopt yourself:
			if (adoptedCount >= 2){
				item.color = seedNodeColor;
				item.adopted = true;
				nodes.update(item);
				countImitators += 1;
			}
		}
	});
	// Returns the fractions of informed adopters and imitators that adopter the trend:
	fractions.push(countInformed*100/data.nodes.get({filter: item => item.informed === true}).length);
	fractions.push(countImitators*100/data.nodes.get({filter: item => item.informed !== true}).length);
	return fractions;
}

// Starts the program upon loading page:
window.onload = function(){
	createNetwork();
}

$( window ).resize(function() {
  network.redraw();
});
