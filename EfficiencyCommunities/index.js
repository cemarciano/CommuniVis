var network;								// Network objects
var data, edges;							// Networks data
var container;								// Networks DOM object
var threshold = 0.85;						// Threshold to create the network with
var time = 0;								// Simulated time measured in seconds
var startingNode = {id:4, distance:-1};		// Id of node that sends the original tweet
var idsDelays = [];							// Ordered list of objects of the type {id: *id of neighboring node*, delay: *time until node gets contaminated*}, for sending tweets:
var options = {								// Networks initialization options
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
var enjoyColor = {
	border: '#9c0005',
	background: '#f74349',
	highlight: {
		border: '#9c0005',
		background: '#f74349'
	}
}
var notEnjoyColor = {
	border: '#777',
	background: '#aaa',
	highlight: {
		border: '#777',
		background: '#aaa'
	}
}
var edgeColor = {
	color: '#add0ff',
	highlight: '#4d99ff',
	opacity: 1.0
}
var enjoyEdgeColor = {
	color: '#f74349',
	highlight: 'red',
	opacity: 1.0
}
var notEnjoyEdgeColor = {
	color: '#aaa',
	highlight: '#777',
	opacity: 1.0
}

// Nodes in the network:
var nodes = new vis.DataSet([
	{id: 1, label: 'W.H.O.', center: 0, informed: true},
	{id: 4, label: 'Justin Trudeau', center: 1.8},
	{id: 8, label: "Alberto Fernández", center: 2.4},
	{id: 12, label: "Tsai Ing-wen", center: 3.1},
	{id: 9, label: "Putin", center: 5.1},
	{id: 13, label: "Kim Jong-un", center: 6.6},
	{id: 5, label: 'Maduro', center: 7.5},
	{id: 2, label: 'Bolsonaro', center: -7.3},
	{id: 3, label: 'Trump', center: -6.7},
	{id: 11, label: "Boris Johnson", center: -4.1},
	{id: 6, label: "Angela Merkel", center: -2.5},
	{id: 7, label: "Macron", center: -2.1},
	{id: 10, label: "Jacinda Ardern", center: 1.6},
]);


// Edges in the network:
var edges = new vis.DataSet([]);


// Startup function:
function createNetwork(){

	// Gets threshold from the URL:
	let searchParams = new URLSearchParams(window.location.search);
	if (searchParams.has('threshold')){
		threshold = searchParams.get('threshold');
	}

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
				let probability = calcProb(distance);
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

	// Renders text:
	nextState(0);

	$("#refresh").on("click", () => {
		var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?threshold=' + $("#selectThreshold").val();
		window.history.pushState({ path: refresh }, '', refresh);
		window.location.reload();
	});

	$("#send").on("click", () => {
		// Retrieves starting node:
		startVal = $("#selectNode").val();
		startingNode = {id: parseInt(startVal), originalInterest:-1}
		sendTweet(startingNode);
	});


}


// Makes node *nodeId* send a tweet through the network:
function sendTweet(idDelay){
	//  Checks if node hasn't been contaminated yet:
	let originNode = nodes.get(idDelay.id);
	if (originNode.contaminated !== true){
		// Contaminates the node:
		originNode.contaminated = true;
		nodes.update(originNode);
		// Calculates distance from the very first node who tweeted:
		let totalDistance = Math.abs(originNode.center - idDelay.originalCoI);
		if (idDelay.originalCoI === undefined) totalDistance = -1;
		// Rolls the dice to see if it will enjoy this tweet:
		if (Math.random() < calcProb(totalDistance)){
			// Colors the origin node and edge:
			if (idDelay.edge !== undefined) {
				idDelay.edge.color = enjoyEdgeColor;
				edges.update(idDelay.edge);
			}
			originNode.color = enjoyColor;
			nodes.update(originNode);
			// Checks if this node is from the core or if this is the first node. If it is, resends the tweet:
			if ((originNode.informed === true) || (time === 0)){
				// Retrieves neighbors of origin:
				let neighEdges = edges.get( network.getConnectedEdges(originNode.id) );
				// Builds list of neighboring node ids:
				let neighNodes = neighEdges.map(item => {
					let idToReturn = 0;
					item.to === originNode.id ? idToReturn = item.from : idToReturn = item.to;
					return {node: nodes.get(idToReturn), edge: item};
				})
				// Builds a list of objects of the type {id: *id of neighboring node*, delay: *time until node gets contaminated*}:
				let tempIdsDelays = neighNodes.map(item => {
						if (item.node.contaminated !== true){
							originalCoI = idDelay.originalCoI;
							if (originalCoI === undefined) originalCoI = originNode.center;
							return {id: item.node.id, delay: time+10*Math.abs(originNode.center - item.node.center), distance: Math.abs(originNode.center - item.node.center), edge: item.edge, originalCoI: originalCoI}
						}
					}).filter(item => item !== undefined);
				// Merge the temporary ids with the existing ids:
				idsDelays = idsDelays.concat(tempIdsDelays);
				// Sorts array:
				idsDelays.sort( compare );
				// Starts animation if not started:
				if (time === 0) requestAnimationFrame(fire);
			}
		// In case this node does not enjoy the tweet:
		} else {
			// Colors the origin node:
			if (idDelay.edge !== undefined) {
				idDelay.edge.color = notEnjoyEdgeColor;
				edges.update(idDelay.edge);
			}
			originNode.color = notEnjoyColor;
			nodes.update(originNode);
		}
	}

}



// Main recurring function, being called every keyframe:
function fire(){
	// Increments counter:
	time += 0.25;
	$("#time").html("Time: " + Math.round(time) + " sec.");
	// Checks if top of the list is ready to get contaminated:
	if (idsDelays.length > 0){
		if (time >= idsDelays[0].delay){
			// Makes that node send a tweet:
			removedNode = idsDelays.shift();
			sendTweet(removedNode);
		}
	} else {
		$("#time").html("Time: " + Math.round(time) + " sec. <span style='color:#b30202'><b>Finished!</span>");
		return;
	}

	// Repeats itself:
	requestAnimationFrame(fire);
}


// Probability of a node producing content that interests another node:
function calcProb(distance){
	return (15-distance)/16;
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
		$("#explanation5").html('<div style="color:#b30202"><b>B(y|z)</b> = (15 \u2013 distance(y,z)) / 16</div>');
		$("#explanation6").html('All periphery agents are connected to the core. However, edges between periphery agents y and z only exist if <b>B(y|z) &#8805; ' + threshold + '</b> (threshold).');
		$("#explanation7").html('Select who should send a tweet. You can also change the threshold (must refresh page):');
		// Fills select options:
		nodes.forEach(item => {
			$('<option>').val(item.id).text(item.label).appendTo('#selectNode');
		})
		for (let i=0.3; i<=1; i+=0.05){
			$('<option>').val(i.toFixed(2)).text(i.toFixed(2)).appendTo('#selectThreshold');
		}
		$("#selectThreshold").val(threshold);
	}
}


// Helper function to sort by delay:
function compare( a, b ) {
	if ( a.delay < b.delay ){
		return -1;
	}
	if ( a.delay > b.delay ){
		return 1;
	}
	return 0;
}

// Starts the program upon loading page:
window.onload = function(){
	createNetwork();
}

$( window ).resize(function() {
  network.redraw();
});
