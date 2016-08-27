/****************  EventHandler Class  ***************/

function EventHandler() {}

/**
  * This function sets up the view for editing a specific floor.
  * It then calls the graphDataFetcher.getDataForEdit() function to get
  * the nodes corresponding to the floor to be edited.
  */
EventHandler.prototype.editBtnClicked = function(floorNumber) {
  // remove the edit button and replace it with a save
  // button and cancel button
  var edit_btns = $('.edit-btn').remove();
  var floor_labels = $('.floor-label');

  // remove all DOM elements inside the floor-group div
  var floor_group = $('.floor-group')[0];
  while (floor_group.firstChild) {
    floor_group.removeChild(floor_group.firstChild);
  }

  // add the new floor label inside the floor group div
  floor_group.innerHTML = this.newFloorLabel(floorNumber);

  // add css properties to the floor image
  var newFloorImg = $('.floor-img')[0];
  newFloorImg.style.width = ui.svgWidth.toString() + 'px';
  newFloorImg.style.height = ui.svgHeight.toString() + 'px';
  newFloorImg.style.position = 'absolute';
  newFloorImg.style.zIndex = '-1';

  graphDataFetcher.getDataForEdit(floorNumber);
}

EventHandler.prototype.getUpdatedNodes = function() {
  /* graphDataFetcher.graphDrawer property is of type SingleGraphDrawer
    When the edit button is clicked, the graphDrawer is set to draw
    a single graph for the floor selected. This graphDrawer object of type
    SingleGraphDrawer also contains the information about the nodes.
  */
  var nodes = graphDataFetcher.graphDrawer.nodes;
  var modifiedNodes = [];

  /* The properties node.x and node.y come from the force layout of d3js.
    The "moved" property is set to true in the dragstart function of d3js
    if a node is dragged.
  */

  for (var i = 0; i < nodes.length; i++) {
    if (typeof(nodes[i].moved) !== 'undefined' && nodes[i].moved == true) {
      modifiedNodes.push({
        'id': nodes[i].id,
        'x_coordinate': nodes[i].x,
        'y_coordinate': nodes[i].y
      });
    }
  }

  return modifiedNodes;
}

EventHandler.prototype.updateNodes = function(updatedNodes) {
  var request = $.ajax({
    url: BASEURL + '/nodes/update',
    type: 'POST',
    data: {nodes: JSON.stringify(updatedNodes)},
    dataType: 'json'
  });

  request.done(function(_data) {
    location.reload();
  });
}

EventHandler.prototype.cancelBtnClicked = function() {
  location.reload();
}

EventHandler.prototype.saveBtnClicked = function() {
  var updatedNodes = this.getUpdatedNodes();

  // if there are modified nodes
  if (updatedNodes.length !== 0) {
    this.updateNodes(updatedNodes);
  }
  // if there are no modified nodes but the user still clicks the save-btn
  // then just reload the page.
  else {
    location.reload();
  }
}

/**
  * This function creates a new floor container for the floor to be edited.
  */
EventHandler.prototype.newFloorLabel = function(floorNumber) {
  // create the new floor label div with corresponding floor number
  var newFloorLabel = ''
    + '<div class="floor" id="floor' + floorNumber.toString() + '">'
      + '<div class="floor-label">'
        + '<span>Floor ' + floorNumber.toString() + '</span>'
        + '<button type="button" class="success button save-btn">Save Graph</button>'
        + '<button type="button" class="success button cancel-btn">Cancel</button>'
      + '</div> <!-- end .floor-label -->'
      + '<div class="floor-graph">'
        + '<div class="graph-container">'
          + '<img src="/images/floorplan7.jpg" class="floor-img">'
        + '</div> <!-- end .graph-container -->'
      + '</div> <!-- end .floor-graph -->'
    + '</div> <!-- end .floor#floor1 -->';

    return newFloorLabel;
}

/**************  END EventHandler Class  *************/
