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
	{id: 1, label: 'Bolsonaro', informed: true},
	{id: 2, label: 'W.H.O.', informed: true},
	{id: 3, label: 'Trump', informed: true},
	{id: 4, label: 'Cardi B', informed: true},
	{id: 5, label: 'Justin Trudeau', informed: true},
	{id: 6, label: "Bolsonaro's Son #1"},
	{id: 7, label: "Bolsonaro's Son #2"},
	{id: 8, label: "Religious Person #1"},
	{id: 9, label: "Religious Person #2"},
	{id: 10, label: "Religious Person #3"},
	{id: 11, label: "Religious Person #4"},
	{id: 12, label: "Feminist Person #1"},
	{id: 13, label: "Very Poor Person #1"},
	{id: 14, label: "Very Poor Person #2"},
	{id: 15, label: "Very Poor Person #3"},
	{id: 16, label: "Rebel Teenager #1"},
	{id: 17, label: "Vegan Person #1"},
	{id: 18, label: "Businessman #1"},
	{id: 19, label: "Businessman #2"},
	{id: 21, label: "Businessman #3"},
	{id: 22, label: "Elon Musk", informed: true},
	{id: 25, label: "Patriotic Person #1"},
]);


// Edges in the network:
var edges = new vis.DataSet([
	{from: 1, to: 3, informed: true},
	{from: 1, to: 2, informed: true},
	{from: 1, to: 6},
	{from: 1, to: 7},
	{from: 1, to: 8},
	{from: 1, to: 9},
	{from: 1, to: 10},
	{from: 1, to: 11},
	{from: 1, to: 14},
	{from: 1, to: 15},
	{from: 1, to: 16},
	{from: 1, to: 19},
	{from: 1, to: 21},
	{from: 1, to: 25},
	{from: 2, to: 3, informed: true},
	{from: 2, to: 4, informed: true},
	{from: 2, to: 5, informed: true},
	{from: 2, to: 6},
	{from: 2, to: 7},
	{from: 2, to: 9},
	{from: 2, to: 10},
	{from: 2, to: 11},
	{from: 2, to: 12},
	{from: 2, to: 16},
	{from: 2, to: 17},
	{from: 2, to: 18},
	{from: 2, to: 19},
	{from: 2, to: 21},
	{from: 2, to: 22, informed: true},
	{from: 2, to: 25},
	{from: 3, to: 4, informed: true},
	{from: 3, to: 5, informed: true},
	{from: 3, to: 9},
	{from: 3, to: 10},
	{from: 3, to: 11},
	{from: 3, to: 14},
	{from: 3, to: 19},
	{from: 3, to: 21},
	{from: 3, to: 22, informed: true},
	{from: 3, to: 25},
	{from: 4, to: 12},
	{from: 4, to: 15},
	{from: 4, to: 16},
	{from: 4, to: 17},
	{from: 4, to: 22, informed: true},
	{from: 5, to: 9},
	{from: 5, to: 13},
	{from: 5, to: 18},
	{from: 5, to: 19},
	{from: 22, to: 21},
	{from: 22, to: 17},
	{from: 22, to: 8},

]);


// Startup function:
function createNetwork(){
	// Adds arrow information to edges:
	edges.forEach(function(item){
		// Custom color for edge:
		item.color = edgeColor;
		// Makes edge thicker if it's an informed link:
		if (item.informed){
			item.value = 5;
		} else {
			arrowWidth = 12;
			item.arrows = {
				to: {
					enabled: true,
					type: "image",
					imageWidth: arrowWidth,
					imageHeight: 22,
					src: "arrow.svg"
				},
			};
			edges.update(item);
		}
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
	var radiusInf = window.innerHeight*0.24;//200
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
		$("#sub-header").text("Step 1 (Feb 2020): Pre-pandemic");
		$("#explanation").text('In this step, the world had just been hit by the pandemic, and no trend existed at this point. Who would be the first to adopt the mass usage of masks?')
	} else if (state == 1){
		let adopters = generateEarlyAdopters();
		$("#sub-header").text("Step 2 (Mar 2020): Pandemic");
		$("#explanation").text('The pandemic had hit. In our imaginary world, ');
		$("#explanation").append( $('<span></span>').text(adopters[0]).css("color", "red").css("font-weight", "bold") );
		$("#explanation").append( $('<span></span>').text(' and ') );
		$("#explanation").append( $('<span></span>').text(adopters[1]).css("color", "red").css("font-weight", "bold") );
		$("#explanation").append( $('<span></span>').text(' quickly made the informed decision of advocating for the use of masks, being considered "early adopters".') );
	} else if (state == 3){
		let adopters = spreadInformedAdopters();
		$("#sub-header").text("Step 3 (Apr 2020): Influencers consider this move");
		$("#explanation").text('Other worldwide influencers saw this move and considered adopting the trend themselves, based on their own well-formed opinions. In the end, ');
		$("#explanation").append( $('<span></span>').text(adopters.length).css("color", "red").css("font-weight", "bold") );
		$("#explanation").append( $('<span></span>').text(' more "informed" celebrities') );
		if (adopters.length > 0) $("#explanation").append( $('<span></span>').text(" (" + adopters.toString() + ")").css("color", "red").css("font-weight", "bold") );
		$("#explanation").append( $('<span></span>').text(' adopted the use of masks.') );
	} else if (state == 4){
		let fractions = spreadImitators();
		$("#next").attr("disabled", true);
		$("#sub-header").text("Step 4 (May 2020): Everyone else follows (or not) their influencers");
		$("#explanation").text('The remainder of the population, observing the actions of their influencers, decide whether or not to adopt the use os masks.');
		$("#explanation").append( $('<span></span>').text('Seeking an optimal adoption policy, they will start wearing masks if 2 or more of the influencers that they know have also started wearing masks.').css("display", "block") );
		let innerExplanation = $('<span></span>').css("display", "block");
		innerExplanation.append($('<span></span>').text('In the end, ') );
		innerExplanation.append( $('<span></span>').text(parseInt(fractions[0]) + '%').css("color", "red").css("font-weight", "bold") );
		innerExplanation.append($('<span></span>').text(' of the influencers and ') );
		innerExplanation.append( $('<span></span>').text(parseInt(fractions[1]) + '%').css("color", "red").css("font-weight", "bold") );
		innerExplanation.append($('<span></span>').text(' of the general population are now wearing masks.') );
		$("#explanation").append(innerExplanation);
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
