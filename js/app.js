// first goal: display a list with location names using Knockout.js (add the map later)
// hard coded Array of location objects
// Create a new blank array for all the listing markers.
var locations = [{
    name: 'Wholefoods',
    location: {
        lat: 37.812570,
        lng: -122.260909
    }
}, {
    name: 'Lake Chalet',
    location: {
        lat: 37.802232,
        lng: -122.261591
    }
}, {
    name: 'Oakland Chinatown',
    location: {
        lat: 37.798560,
        lng: -122.269270
    }
}, {
    name: 'Fox Theater',
    location: {
        lat: 37.808117,
        lng: -122.269768
    }
}, {
    name: 'Great Western Power Company',
    location: {
        lat: 37.809787,
        lng: -122.2701297
    }
}, ];

var markers = [];

var largeInfowindow = new google.maps.InfoWindow();

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
    
    

    var styles = [{
        elementType: 'geometry',
        stylers: [{
            color: '#ebe3cd'
        }]
    }, {
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#523735'
        }]
    }, {
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#f5f1e6'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#c9b2a6'
        }]
    }, {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#dcd2be'
        }]
    }, {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#ae9e90'
        }]
    }, {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{
            color: '#dfd2ae'
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
            color: '#dfd2ae'
        }]
    }, {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#93817c'
        }]
    }, {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{
            color: '#a5b076'
        }]
    }, {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#447530'
        }]
    }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
            color: '#f5f1e6'
        }]
    }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
            color: '#fdfcf8'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
            color: '#f8c967'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#e9bc62'
        }]
    }, {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{
            color: '#e98d58'
        }]
    }, {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#db8555'
        }]
    }, {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#806b63'
        }]
    }, {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{
            color: '#dfd2ae'
        }]
    }, {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#8f7d77'
        }]
    }, {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#ebe3cd'
        }]
    }, {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{
            color: '#dfd2ae'
        }]
    }, {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{
            color: '#b9d3c2'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#92998d'
        }]
    }];

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });

        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        function populateInfoWindow(marker, infowindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                // Clear the infowindow content to give the streetview time to load.
                infowindow.setContent('<div>' + marker.name + '</div>');
                infowindow.open(map, marker);
                infowindow.marker = marker;
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });




            };
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });
            document.getElementById('show-listings').addEventListener('click', showListings);
            document.getElementById('hide-listings').addEventListener('click', hideListings);
        }
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
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon;

        highlightedIcon = makeMarkerIcon('FFFF24');
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
      function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }
    }

    var AppViewModel = function() {
        var self = this;
        self.markers = ko.observableArray([]);
        self.allLocations = ko.observableArray(locations);

        self.filter = ko.observable("");
        self.search = ko.observable("");
    };

    var appViewModel = new AppViewModel();
    ko.applyBindings(appViewModel);
};

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