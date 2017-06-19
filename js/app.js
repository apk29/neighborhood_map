// first goal: display a list with location names using Knockout.js (add the map later)
// hard coded Array of location objects
var locations = [
        {
            name: 'wholefoods', 
            lat: 37.812570, 
            lng: -122.260909
        },
        {
            name: 'Lake Chalet', 
            lat: 37.802232, 
            lng: -122.261591
        },
        {
            name: 'Oakland Chinatown', 
            lat: 37.798560, 
            lng: -122.269270
        },
        {
            name: 'Fox Theater', 
            lat: 37.808117, 
            lng: -122.269768
        },
        {
            name: 'Great Western Power Company',
            lat: 37.809787, 
            lng: -122.2701297
        },
    ];

function initMap() {

    
	
         // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.813331, lng: -122.261801},
          zoom: 13,
          /*styles: styles,*/
          mapTypeControl: false
        });
};
        

var AppViewModel = function () {
    var self = this;
        self.markers = ko.observableArray([]);
        self.allLocations = ko.observableArray(locations);
         
    self.filter =  ko.observable("");
    self.search = ko.observable("");
};

 var appViewModel = new AppViewModel();
 ko.applyBindings(appViewModel);

// https://github.com/udacity/ud864/blob/master/Project_Code_5_BeingStylish.html#L150

// initMap function (later)
// https://developers.google.com/maps/documentation/javascript/examples/map-simple

// Location constructor similiar to the Cat constructor form the JavaScript Design Patterns course (optional)

// ViewModel constructor
// In the ViewmModel create an observableArray with location objects
// http://knockoutjs.com/documentation/observables.html#mvvm-and-view-models
// Separating Out the Model video lesson:
// https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/271165859175461/lessons/3406489055/concepts/34284402380923
// Adding More Cats video lesson
// https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/271165859175461/lessons/3406489055/concepts/34648186930923

// Instantiate the ViewModel
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// The difference between defining the ViewModel as a function expression or defining the viewModel as an object literal:
// https://discussions.udacity.com/t/text-not-updating-with-search-box/182886/6

// Apply the bindings aka activate KO
// http://knockoutjs.com/documentation/observables.html#mvvm-and-view-models#activating-knockout 