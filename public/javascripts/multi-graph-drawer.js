/***************  MultiGraphDrawer Class  ************/

function MultiGraphDrawer() {
  this.graphsDisplayed = false;
}

/**
  * @param floors = array of Floor objects each containing node and link data
  */
MultiGraphDrawer.prototype.drawGraphsForDisplay = function(floors) {
  for (var i = 0; i < floors.length; i++) {
    // check if it's the first time the graph is being displayed or not
    if (this.graphsDisplayed) {
      // check if the graph on a specific floor is to be updated or not
      if (!floors[i].updateDisabled) {  // if floor can be updated
        var singleGraphDrawer = new SingleGraphDrawer(floors[i]);
        singleGraphDrawer.updateGraphDisplay();
      }
    }
    else {
      var singleGraphDrawer = new SingleGraphDrawer(floors[i]);
      singleGraphDrawer.drawGraphDisplay();
    }
  }

  if (this.graphsDisplayed === false) this.graphsDisplayed = true;
}

/*************  END MultiGraphDrawer Class  **********/
