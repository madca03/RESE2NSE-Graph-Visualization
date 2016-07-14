/*********************  UI Class  ********************/

function UI() {
  this.svgWidth = null;
  this.svgHeight = null;
  this.baseSVGWidth = 866;
  this.baseSVGHeight = 396;
  this.initialDisplay = true;
  this.archive_date = [];
}

/**
 * This method initializes the UI components to be used for the graph display.
 */
UI.prototype.init = function() {
  this.setFloorImageDimensions();
  this.setScrollToLink();
  this.setNavbars();
}

/**
 * This method adds a time slider for each graph display. It first gets the
 * total number of archive from the database and it uses this data to set
 * the maximum value for the slider.
 */
UI.prototype.setTimeSlider = function() {
  var thisObj = this;

  $(".slider-range").slider({
      range: "max",
      min: 1,
      disabled: true,
      slide: function(event, ui) {
          var floorNumber = $(this).data("floorNumber");
          var floor = null;

          for (var i = 0; i < floors.length; i++) {
            if (floors[i].floorNumber === floorNumber) {
              floor = floors[i];
              break;
            }
          }

          // update the time-label of the graph
          var date = new Date(thisObj.archive_date[ui.value - 1].datetime_archive);

          var date_options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'long'
          };

          $("#slider-time-" + floor.floorNumber)
            .html(date.toLocaleString('en-us', date_options));
      },
      change: function(event, ui) {
        var max = $(".slider-range").slider("option", "max");
        var floorNumber = $(this).data("floorNumber");
        var floor = null;

        // global variable "floors"
        // find the floor object corresponding to this slider
        for (var i = 0; i < floors.length; i++) {
          if (floors[i].floorNumber === floorNumber) {
            floor = floors[i];
            break;
          }
        }

        if (ui.value != max) {
          /*
            disable the update on the floor so that the graph for the
            time specified is shown.
            continuously update other floors whose ui.value is equal to
            the max time.
          */

          floor.updateDisabled = true;
          if (floor.recentlyDisabled) {
            floor.updateJustEnabled = false;
          }

          // update the display for the specific floor to show the graph
          // for the chosen time.
          graphDataFetcher.getArchiveDataForDisplay(floorNumber, ui.value);

        } else {
          if (floor.updateDisabled) {
            floor.updateDisabled = false;
            floor.updateJustEnabled = true;
          }
        }
      }
  });
}

UI.prototype.setFloorImageDimensions = function() {
  // SVG stage and floorplan image properties
  var graph_container = document.getElementsByClassName('graph-container');
  var graph_container_style = window.getComputedStyle(graph_container[0]);
  var floor_img = document.getElementsByClassName('floor-img');
  var floor_img_style = window.getComputedStyle(floor_img[0]);
  var img_border = parseFloat(floor_img_style.getPropertyValue('border-top-width'));
  var container_width = parseFloat(graph_container_style.getPropertyValue('width'));
  var container_height = parseFloat(graph_container_style.getPropertyValue('height'));

  this.svgWidth = container_width - img_border;
  this.svgHeight = container_height - img_border;

  for (var i = 0; i < floor_img.length; i++) {
    floor_img[i].style.width = this.svgWidth.toString() + 'px';
    floor_img[i].style.height = this.svgHeight.toString() + 'px';
  }
}

UI.prototype.setScrollToLink = function() {
  $('.floor-link').on('click', function() {
    var link = '#floor' + this.dataset.floorNumber.toString();
    var top_offset = $('.main-nav').outerHeight(); // offset covered by navbar

    $('html, body').animate({
      scrollTop: $(link).offset().top - top_offset
    }, 750);
  });
}

UI.prototype.setNavbars = function() {
  var main_nav = $('.main-nav');
  var side_nav = $('.nav-side');

  // compute for the scroll top value where the header is not seen anymore
  var header = document.getElementsByClassName('nav-top')[0];
  var header_styles = window.getComputedStyle(header);
  var scroll_offset = parseInt(header_styles.getPropertyValue('height'))
    + parseInt(header_styles.getPropertyValue('margin-bottom'));

  // classes to be added
  var mn_class = 'main-nav-scrolled';
  var sn_class = 'nav-side-scrolled';

  // set the margin bottom of main nav to negative of its height
  main_nav.css('margin-bottom', (main_nav.outerHeight() * (-1)).toString() + 'px');

  $(window).scroll(function() {
    // if header is not seen anymore
    if ($(this).scrollTop() > scroll_offset) {
      main_nav.addClass(mn_class);

      var sn_width = side_nav.css('width');
      side_nav.addClass(sn_class);
      side_nav.css('width', sn_width);
    }
    // if header can be seen in the window
    else {
      main_nav.removeClass(mn_class);
      side_nav.removeClass(sn_class);
    }
  });
}

UI.prototype.updateUIOnBrowserResize = function() {
  this.setFloorImageDimensions();
  this.updateSideNav();
}

UI.prototype.updateSideNav = function() {
  var sideNav = $('.nav-side');
  var parentDivWidth = sideNav.parent().width();

  sideNav.width(parentDivWidth);
}

/**
 * This method updates the slider range to accomodate the new archive data
 * stored in the database.
 *
 * @param {Number} archive_count: current total of archive sets in the database
 */
UI.prototype.updateSliderRange = function(archive_count) {
  var sliders = $('.slider-range').toArray();

  // for each slider, update the slider value if the current slider is
  // pointing to the max value
  for (var i = 0; i < sliders.length; i++) {
    var currentSliderValue = $(sliders[i]).slider("option", "value");
    var currentSliderMax = $(sliders[i]).slider("option", "max");

    if (currentSliderValue === currentSliderMax && archive_count !== 0) {
      $(sliders[i]).slider("option", "value", archive_count);
    }
  }

  // update the max value of all the sliders to the current archive count
  $('.slider-range').slider("option", "max", archive_count);

  // for the initial/first graph display, enable the use of the slider and
  // set the current slider value to archive_count
  if (this.initialDisplay && archive_count !== 0) {
    $('.slider-range').slider("option", "disabled", false);

    // only update slider range when there is archive data
    $('.slider-range').slider("value", archive_count);

    this.initialDisplay = false;
  }
}

UI.prototype.updateArchiveDate = function(archive_date) {
  // update the array of archive dates
  for (var i = this.archive_date.length; i < archive_date.length; i++) {
    this.archive_date.push(archive_date[i]);
  }

  var sliders = $('.slider-range').toArray();
  var currentMax = $('.slider-range').slider("option", "max");

  for (var i = 0; i < sliders.length; i++) {
    var currentValue = $(sliders[i]).slider("option", "value");

    if (currentValue === currentMax && archive_date.length !== 0) {
      var slider_time = $(sliders[i]).prev().children('.slider-time')[0]
      var date = new Date(this.archive_date[this.archive_date.length - 1].datetime_archive);

      var date_options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'long'
      }

      $(slider_time).html(date.toLocaleString('en-us', date_options));
    }
  }
}

/*******************  END UI Class  ******************/
