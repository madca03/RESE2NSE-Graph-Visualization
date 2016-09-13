function Slider() {
  this.range_value_enum = {
    MINUTE_1: {val: 0, sec: 60},
    MINUTE_2: {val: 1, sec: 120},
    MINUTE_3: {val: 2, sec: 180},
    all_all: {val: 3}
  };

  this.current_range = this.range_value_enum[$('.range-menu').val()];

  /* "initialDisplay" property is used to know whether to
    enable the slider or not.
  */
  this.initialDisplay = true;
  this.currentFocusTime = null;
}

/**
 * This method adds a time slider for the graph display. It sets up the slide
 * event that is used to change the displayed time and the "stop" event
 * that is used to change the display to show an archive data.
 */
Slider.prototype.init = function(dataFetcher, graph) {
  var thisObj = this;

  $('.slider-range').slider({
      orientation: 'horizontal',
      range: 'max',
      min: 1,
      max: 0,
      disabled: true,
      slide: function(event, ui) {
          /* update the time-label of the graph */
          thisObj.changeTimeDisplay(
            graph.archiveDate[ui.value - 1].datetime_archive);

          thisObj.currentFocusTime = new Date(
            graph.archiveDate[ui.value - 1].datetime_archive);
      },
      stop: function(event, ui) {
        /*disable the update on the floor so that the graph for the
          time specified is shown.

          "this" points to the slider
        */
        var max = $(this).slider('option','max');
        if (ui.value != max) {

          /* Set the updateDisabled to true so that the continuously running
            function in graph.js that updates the graph will not execute.
          */
          dataFetcher.updateDisabled = true;

          /* pass the associated archive date to the current value of
            the slider to the graph_drawer
          */
          dataFetcher.getArchiveDataForDisplay(
            graph.archiveDate[ui.value - 1].id);
        } else {
          dataFetcher.updateDisabled = false;
        }
      }
  });
}

Slider.prototype.changeTimeDisplay = function(datetime) {
  var date = new Date(datetime);

  var dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long'
  }

  $('.slider-time').html(date.toLocaleString('en-us', dateOptions));
}

Slider.prototype.adjustSlider = function(archiveDate, newArchive, range_str) {
  this.adjustSliderRange(archiveDate, newArchive);
  // this.adjustSliderHandlePosition(range_str);
}

Slider.prototype.adjustSliderHandlePosition = function(range_str, archiveDate) {
  var new_range = this.range_value_enum[range_str];
  // console.log("range_str " + range_str);
  // console.log("new range");
  // console.log(new_range);
  // console.log("current_range");
  // console.log(this.current_range);

  var slider_min = $('.slider-range').slider('option', 'min');
  var slider_val = $('.slider-range').slider('option', 'value');
  var slider_max = $('.slider-range').slider('option', 'max');
  var old_range_count = slider_max;
  var new_range_count = archiveDate.length;

  $('.slider-range').slider('option', 'max', archiveDate.length);

  /* if slider handle is at maximum */
  if (slider_val === slider_max) {
    $('.slider-range').slider('option', 'value', archiveDate.length);
  }

  /* if slider handle is at minimum */
  // if (slider_min === slider_val) {
  //   this.changeTimeDisplay(archiveDate[0].datetime_archive);
  // }

  if (slider_val !== slider_max) {
    /* if the user is changing from higher range to a lower range */
    if (new_range.val < this.current_range.val) {
      // console.log("new < current");
      var firstDate = new Date(archiveDate[0].datetime_archive);

      /* if ---x----------- <- current range
                    o------ <- new range
                    #------ <- slider handler
      */
      if (this.currentFocusTime < firstDate) {
        this.changeTimeDisplay(archiveDate[0].datetime_archive);
        /* move the handler to the leftmost */
        $('.slider-range').slider('option', 'value', 1);
      }
      /*  if -----------x-- <- current range
                    o------ <- new range
                    o---#-- <- slider handler
      */
      else {
        var new_pos = new_range_count - (old_range_count - slider_val);
        $('.slider-range').slider('option', 'value', new_pos);
      }
    }
    /* if the user is changing from lower range to a higher range */
    else {
      /*  if          -x---- <- current range
              o------------- <- new range
              o--------#---- <- # slider handler
      */

      var new_pos = new_range_count - (old_range_count - slider_val);
      $('.slider-range').slider('option', 'value', new_pos);
    }
  }

  this.current_range = new_range;
}

Slider.prototype.adjustSliderRange = function(archiveDate, newArchive) {
  /* replace the stored archiveDate with the new archiveDate corresponding
    to the new range.
  */
  this.archiveDate = newArchive;

  /* update the maximum range of the slider to match the length of the
    archiveDate array
  */
  $('.slider-range').slider('option', 'max', archiveDate.length);
}

/**
 * This method updates the slider range to accomodate the new archive data
 * stored in the database.
 *
 * @param {Number} archive_count: current total of archive sets in the database
 */
Slider.prototype.updateSliderRange = function(archive_count) {
  var current_slider_value = $('.slider-range').slider('option', 'value');
  var current_slider_max = $('.slider-range').slider('option', 'max');

  /* if the guest user is currenly viewing the latest graph display and
     there exists an archive data in the database then update the current
    value of the slider as well as the max value of the slider to
    the current archive count.

    When the guest user is viewing the graph of an archive data, we should not
    update the max value. If max value is updated when archived graph is being
    viewed, the handler is adjusting to the left to accomodate for more slider
    values of incoming datetime_archive.
  */

  if ((current_slider_value === current_slider_max) && (archive_count !== 0)) {
    $('.slider-range').slider('option', 'value', archive_count);
    // update the max value of the slider to the current archive count
    $('.slider-range').slider("option", "max", archive_count);
  }

  /* for the initial/first graph display, enable the use of the slider and
    set the current slider value to archive_count
  */
  if (this.initialDisplay && archive_count !== 0) {
    // enable the slider
    $('.slider-range').slider("option", "disabled", false);
    // only update slider range when there is archive data
    $('.slider-range').slider("value", archive_count);
    // set the state of the graph as "displayed"
    this.initialDisplay = false;
  }
}

Slider.prototype.updateArchiveDate = function(archiveDate) {
  this.currentFocusTime = new Date(
    archiveDate[archiveDate.length - 1].datetime_archive);

  var currentMax = $('.slider-range').slider("option", "max");
  var currentValue = $('.slider-range').slider("option", "value");

  /* if the slider handle is currently pointing at the maximum value
    (in this case, the rightmost of the slider contains the maximum value)
    and there exists archive data then update the text showing the time
    associated with the slider's max value.
  */
  if ((currentValue === currentMax) && (archiveDate.length !== 0)) {
    this.changeTimeDisplay(archiveDate[archiveDate.length - 1].datetime_archive);
  }
}
