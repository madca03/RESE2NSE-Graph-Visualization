"use strict"

/*************  Constants  *************/

const BASEURL = "http://localhost:3000";
// node visual properties
const NODERADIUS = 8;
const NODEFILL = "black";
// link visual properties
const LINKSTROKEOPACITY = '1';
const LINKSTROKEWIDTH = '2px';
const UPDATERATE = 1000;

/*************  Application starts here  *************/

var floorCount = $('.floor').length;

// This wlll be the storage for all of the Floor objects.
var floors = [];

var dummy;

var ui = new UI();
var graphDataFetcher = new GraphDataFetcher(floorCount, floors);

// http://stackoverflow.com/questions/544993/official-way-to-ask-jquery-wait-for-all-images-to-load-before-executing-somethin
/* wait for all images to load */
$(window).on("load", function() {
  ui.init();
  var eventHandler = new EventHandler();
  ui.setTimeSlider();

  graphDataFetcher.getDataForDisplay(ui.archive_date);
  // var display_timer = setInterval(function() {
  //   if (!graphDataFetcher.updateDisabled) {
  //     graphDataFetcher.getDataForDisplay(ui.archive_date);
  //   }
  // }, UPDATERATE);

  setTimeout(function() {
    graphDataFetcher.getDataForDisplay(ui.archive_date);
    console.log("hello");
  }, 3000);

  // function is called when the browser is resized

  // window.onresize = function() {
  //   ui.updateUIOnBrowserResize();
  //   graphDataFetcher.getDataForDisplay();
  //
  //   console.log("browser resize");
  //   clearInterval(display_timer);
  //
  //   display_timer = setInterval(function() {
  //     graphDataFetcher.getDataForDisplay();
  //   }, UPDATERATE);
  // }


  $('.range-menu').change(function() {
    var range_val = $(this).val();

    var request = $.ajax({
      url: BASEURL + "/datetime/" + range_val,
      type: "GET",
      dataType: "json",
      context: this
    });


    request.done(function(_data, textStatus, jqXHR) {
      ui.adjust_slider_range(_data.data);
    });
  });

  // add click event listener to edit graph button
  $('.edit-btn').on('click', function() {
    // clearInterval(display_timer);
    eventHandler.editBtnClicked();

    // add event handler to cancel button
    $('.cancel-btn').on('click', function() {
      eventHandler.cancelBtnClicked();
    });

    // add event handler to save button
    $('.save-btn').on('click', function() {
      eventHandler.saveBtnClicked();
    });
  });
}); // end application block

/***********************  END  ***********************/
