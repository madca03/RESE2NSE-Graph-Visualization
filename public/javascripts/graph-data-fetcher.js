/******************  GraphDataFetcher Class  ****************/

function GraphDataFetcher(floorCount, floors) {
  this.floorCount = floorCount;
  this.floors = floors;
  this.graphDrawer = null;
  this.initialDataFetch = true;

  // temporarily place the attribute from MultiGraphDrawer here
  this.graphDisplayed = false;
  this.updateDisabled = false;
}

/**
  * This function gets the graph data containing the nodes with their
  * coordinates set and the links in between nodes. After a successful AJAX
  * call, it calls the draw_graph_for_display function and it passes to the
  * function the graph data from the AJAX call.
  * (in data.graph)
  *
  * Also included in the data is the current count of the archive sets.
  * (in data.archive_count)
  *
  * This function should only be called for the graph display of guest users.
  */

GraphDataFetcher.prototype.getDataForDisplay = function(archive_date) {
  var date_id;
  if (archive_date.length === 0) {
    /* query all of the archives */
    date_id = 0;
  } else {
    date_id = archive_date[archive_date.length - 1].id;
  }

  // ajax call for guest users
  var request = $.ajax({
    // url: BASEURL + "/nodes/display/" + date.id,
    url: BASEURL + "/nodes/display/" + date_id,
    type: "GET",
    dataType: "json",

    // Pass the GraphDataFetcher object to the ajax request so that it can be used
    // on the ajax's function callbacks
    context: this
  });

  request.done(function(_data, textStatus, jqXHR) {
    if (_data.data.date_archive_count > 0) {
      this.modifyNodesForDisplay(_data.data.graph.nodes);
      this.modifyLinks(_data.data.graph);

      this.graphDrawer = new GraphDrawer();
      this.graphDrawer.setGraph(_data.data.graph);

      if (this.graphDisplayed) {  // if graph display if just for update
        this.graphDrawer.updateGraphDisplay();
      } else {  // if it's the first time to display the graph
        this.graphDrawer.drawGraphDisplay();
        this.graphDisplayed = true;
      }

      // update the maximum value of the slider to the total archive count
      // add the old archive_date length to the number of new archive_date
      ui.updateSliderRange(archive_date.length + _data.data.date_archive_count);
      // update the array of archive dates stores in the UI object
      ui.updateArchiveDate(_data.data.date_archive);
    }
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus, errorThrown);
  });
}

/**
  * The link objects' source and target attributes are currently set to the
  * "node_id" of the source and target nodes. Using these node_ids, the source
  * and target attributes of each link object will be change to point to the
  * corresponding node objects from the @param {array} nodes.
  *
  * @param {object} graph - object containing the nodes and links
  * @return {array} modifiedLinks passed as property to graph object
  */
GraphDataFetcher.prototype.modifyLinks = function(graph) {
  var modifiedLinks = [];
  var links = graph.links;
  var nodes = graph.nodes

  for (var i = 0; i < links.length; i++) {
    var sourceNode = null;
    var targetNode = null;

    for (var j = 0; j < nodes.length; j++) {
      if (nodes[j].id === links[i].source_id) {
        sourceNode = nodes[j];
      } else if (nodes[j].id === links[i].target_id) {
        targetNode = nodes[j];
      }

      if (sourceNode !== null && targetNode !== null) {
        break;
      }
    }

    modifiedLinks.push({
      source: sourceNode,
      target: targetNode,
      floor_id: links[i].floor_id,
      id: links[i].id,
      status: links[i].status
    });
  }

  // replace the links propert of graph with the new modified links
  graph.links = modifiedLinks;
}

/**
  * This function adds "scaledX" and "scaledY" attributes to each node object.
  * These new attributes will be used in determining the node's visual position
  * given a certain browser width and height. Using these attributes, we can
  * also have a graph visualization that can respond to resizing of the browser
  * window by calculating the new node position for each browser resize.
  *
  * @param {array} nodes - array of node objects on a given floor
  * @return {array} nodes - array of modified node objects
  */
GraphDataFetcher.prototype.modifyNodesForDisplay = function(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].scaledX = (ui.svgWidth * nodes[i].x_coordinate) / ui.baseSVGWidth;
    /* TODO: don't scale the y_coordinate positioning of the node. It should be
      independent of the browser width. No need to scale the height for
      responsive design */
    // nodes[i].scaledY = (ui.svgHeight * nodes[i].y_coordinate) / ui.baseSVGHeight;
    nodes[i].scaledY = nodes[i].y_coordinate;
  }
}


/**
  * This method gets all of the nodes from the server.
  */
GraphDataFetcher.prototype.getDataForEdit = function() {
  // ajax call to get graph data
  var request = $.ajax({
    url: BASEURL + '/nodes/edit',
    type: 'GET',
    dataType: 'json',
    context: this
  });

  request.done(function(_data, textStatus, jqXHR) {
    /* third argument of Floor constructor is for the array of links. But
      since the admin user is only concerned in the editing of the position
      of the nodes, the present links doesn't matter. That's why we just pass
      null for the links array in the Floor constructor.
    */
    // var floor_for_edit = new Floor(floorNumber, nodes, null);
    //
    this.graphDrawer = new GraphDrawer();
    this.graphDrawer.setGraph(_data.data.graph);
    this.graphDrawer.drawGraphForEdit();
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus, errorThrown);
  });
}

/**
 * This method sorts the graph data per floor from the given data
 * received from the getDataForDisplay()'s ajax call.
 *
 * @param {object} graphData: unsorted graph dataset
 * @return array of graph dataset where each graph dataset element
 *    corresponds to one floor.
 */
GraphDataFetcher.prototype.getGraphPerFloor = function(graphData) {
  if (this.initialDataFetch) {
    // set the initialDataFetch attribute to false so that this will not be
    // executed for the next graph update
    this.initialDataFetch = false;

    for (var i = 0; i < this.floorCount; i++) {
      // get the nodes for the current floor
      var nodes = graphData.nodes.filter(function(node) {
        return node.floor_id === (i + 1);
      });

      // get the links for the current floor
      var links = graphData.links.filter(function(link) {
        return link.floor_id === (i + 1);
      });

      // modify links and nodes
      this.modifyNodesForDisplay(nodes);
      links = this.modifyLinks(nodes, links);

      // create a new "Floor" object containing the nodes and links
      // for the graph on that floor.
      this.floors.push(new Floor(i + 1, nodes, links));
    }
  }

  else {
    // This code block updates the nodes and links of each Floor object
    // This code block is called for every update on the graph display

    for (var i = 0; i < this.floors.length; i++) {
      var floor = this.floors[i];

      var nodes = graphData.nodes.filter(function(node) {
        return node.floor_id === floor.floorNumber;
      });

      var links = graphData.links.filter(function(link) {
        return link.floor_id === floor.floorNumber;
      });

      this.modifyNodesForDisplay(nodes);
      this.floors[i].nodes = nodes;
      this.floors[i].links = this.modifyLinks(nodes, links);
    }
  }
}

/**
 * This method gets the archive data of a graph for a certain archived datetime.
 *
 * @param {Number} floorNumber: the floor to be updated with the archive graph data.
 * @param {Number} dateArchiveID: the ID of the archive date in the database.
 */
GraphDataFetcher.prototype.getArchiveDataForDisplay = function(dateArchiveID) {
  var request = $.ajax({
    url: BASEURL + "/archive/date/" + dateArchiveID,
    type: "GET",
    dataType: "json",
    context: this
  });

  request.done(function(_data, statusText, jqXHR) {
    this.modifyNodesForDisplay(_data.data.graph.nodes);
    this.modifyLinks(_data.data.graph);

    var graphDrawer = new GraphDrawer();
    graphDrawer.setGraph(_data.data.graph);
    graphDrawer.updateArchiveGraphDisplay();

    // // find the Floor object which should be updated with the archive graph data
    // for (var i = 0; i < this.floors.length; i++) {
    //   if (this.floors[i].floorNumber === floorNumber) {
    //     this.modifyNodesForDisplay(nodes);
    //
    //     this.floors[i].nodes = nodes;
    //     this.floors[i].links = this.modifyLinks(nodes, links);
    //     // update the graph display
    //     var singleGraphDrawer = new SingleGraphDrawer(this.floors[i]);
    //     singleGraphDrawer.updateArchiveGraphDisplay();
    //     break;
    //   }
    // }
  });
}

/****************  END GraphDataFetcher Class  **************/
