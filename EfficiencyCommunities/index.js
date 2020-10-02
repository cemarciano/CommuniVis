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
	{id: 1, label: 'W.H.O.', informed: true},
	{id: 4, label: 'Justin Trudeau'},
	{id: 8, label: "Alberto Fernández"},
	{id: 9, label: "Putin"},
	{id: 5, label: 'Maduro'},
	{id: 13, label: "Kim Jong-un"},
	{id: 3, label: 'Trump'},
	{id: 2, label: 'Bolsonaro'},
	{id: 11, label: "Boris Johnson"},
	{id: 7, label: "Macron"},
	{id: 6, label: "Angela Merkel"},
	{id: 10, label: "Jacinda Ardern"},
	{id: 12, label: "Tsai Ing-wen"},
]);


// Edges in the network:
var edges = new vis.DataSet([
	{from: 1, to: 2, value: 1},
	{from: 1, to: 3, value: 2},
	{from: 1, to: 4, value: 12},
	{from: 1, to: 5, value: 1},
	{from: 1, to: 6, value: 8},
	{from: 1, to: 7, value: 7},
	{from: 1, to: 8, value: 8},
	{from: 1, to: 9, value: 4},
	{from: 1, to: 10, value: 12},
	{from: 1, to: 11, value: 4},
	{from: 1, to: 12, value: 11},
	{from: 2, to: 3, value: 8},
	{from: 2, to: 11, value: 6},
	{from: 3, to: 4, value: 1},
	{from: 3, to: 7, value: 3},
	{from: 3, to: 13, value: 1},
	{from: 4, to: 8, value: 3},
	{from: 4, to: 10, value: 5},
	{from: 5, to: 13, value: 4},
	{from: 6, to: 7, value: 7},
	{from: 6, to: 10, value: 4},
	{from: 6, to: 11, value: 3},
	{from: 7, to: 11, value: 3},
	{from: 10, to: 12, value: 6},
]);


// Startup function:
function createNetwork(){
	// Adds arrow information to edges:
	edges.forEach(function(item){
		// Custom color for edge:
		item.color = edgeColor;
		edges.update(item);
	});
	// Processes nodes:
	nodes.forEach(function(item){
		// Custom color for node:
		item.color = nodeColor;
		nodes.update(item);
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
	network.moveTo({position: {x: -250, y:20}});
}


// Number of nodes in the seed group:
var seedSize = 2;

// Function to transition to the next state of the simulation:
function nextState(state){
	if (state == 0){
		$("#explanation").html('This fictional example portrays how the safety measures adopted by each president in regard to Covid-19 spreads in the <b>core-periphery</b> international community.')
		$("#explanation2").html('<b>The larger an edge is, the more each node interacts.</b> All edges are undirected for simplification purposes, but can be thought as the sum of two directed (opposite) edges.')
		$("#explanation3").html('The &#8477; line below exemplifies the <b>rank</b> of each member of the community. Measure I<sub>0</sub> represents the center of the community.')
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
