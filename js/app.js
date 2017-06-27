// first goal: display a list with location names using Knockout.js (add the map later)
// hard coded Array of location objects
// Create a new blank array for all the listing markers.


var markers = [];
var appViewModel;
// initMap function 
function initMap() {
     
     // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.813331,
            lng: -122.261801
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    //creat window that will be used to populate window content
    var largeInfowindow = new google.maps.InfoWindow();    
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        //Get title from the locatons array
        var title = locations[i].name;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon;

        highlightedIcon = makeMarkerIcon('FFFF24');
        
        // Push the marker to our array of markers.
      markers.push(marker);
        locations[i].marker = marker;
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
        marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
        marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });
        //drops markers onto map on load
        showListings();

        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
    }

    appViewModel = new AppViewModel();
    ko.applyBindings(appViewModel);


function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        infowindow.open(map, marker);
    };
    
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
};
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
};

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
};

// This function will loop through the listings and hide them all.
function hideListings() {
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(null);
}
};

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(null);
}
};

var List = function(data) {
    var self = this;
    this.name = data.name;
};

    
var AppViewModel = function() {
    var self = this;
    
    firstLocations.forEach(function(itemsLocation){
    self.allLocations.push(new List(itemsLocation));
});

    self.allLocations = ko.observableArray();
    self.markers = ko.observableArray([]);

    self.myList = ko.observable("");
    self.search = ko.computed(function() {
      var filter = self.myList;
      if(!filter) {self.allLocations().forEach(function(itemsLocation){
        itemsLocation.visible(true)
      })};
      
    });
    
    self.clickMarker = function(location) {
      console.log(location);
      google.maps.event.trigger(location.marker,'click');
    }
};};
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