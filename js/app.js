// first goal: display a list with location names using Knockout.js (add the map later)
// hard coded Array of location objects
// Create a new blank array for all the listing markers.
var markers = [];
var appViewModel;
// initMap function 
function initMap() {
    var Oakland = {
        lat: 37.813331,
        lng: -122.261801
    };
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: Oakland,
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    //creat window that will be used to populate window content
    var largeInfowindow = new google.maps.InfoWindow();
    
    // The following group uses the location array to create an array of markers on initialize.
    /*for (var j = 0; j < firstLocations.length; j++) {*/
        firstLocations.forEach(function(mark){
        // Get the position from the location array.
        var position = mark.location;
        //Get title from the locatons array
        var title = mark.name;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            });

        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.

        var highlightedIcon = makeMarkerIcon('FFFF24');

        // Push the marker to our array of markers.
        markers.push(marker);
        appViewModel.allLocations()[i].marker = marker;
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            largeInfowindow.setContent(this.contentString);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        /*calls the foursquare api request*/
        getData(marker);
        //drops markers onto map on load
        showListings();
        
    });
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.


    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {

            // Set to current marker
            infowindow.marker = marker;

            infowindow.setContent('<div class="title">' + marker.title + '</div>' + marker.contentString);
            // sets animation to bounce 2 times when marker is clicked
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 2000);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
            infowindow.open(map, marker);
        }

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
    }

    // This function will loop through the markers array and display them all.
    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    // This function will loop through the listings and hide them all.
    function hideListings() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    // This function will loop through the listings and hide them all.
    function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }


    function getData(marker) {
        // foursquare client-id and client-secret
        var client_id = "2EVZTFM14QJ2T5M12PCFPIZS5Z5HYWPOM3RY5COEUZPGNDRK";
        var client_secret = "G1IG5LPMZLDDA2A24LGVOZIG5JU3JXDGB5KWACGHDS5WGTKK";

        // foursquare api url
        var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
        var address, category, foursquareId, contentString;

        // ajax request - foursquare api data (https://developer.foursquare.com/docs/)
        $.ajax({
            //  type: 'GET',
            url: foursquareUrl,
            dataType: "json",
            data: {
                client_id: client_id,
                client_secret: client_secret,
                query: marker.title,
                near: "Oakland, California",
                v: 20170630
            },
            success: function(data) {
                // get venue info
                var venue = data.response.venues[0];
                // get venue address info
                address = venue.location.formattedAddress[0];
                // gets link of place
                foursquareId = "https://foursquare.com/v/" + venue.id;
                // populates infowindow with api info

                contentString = "<div class='name'>" + "<span class='info'>" + venue.name + "</span></div>" +
                    "<div class='address'>" + "<span class='info'>" + address + "</span></div>" +
                    "<div class='information'>" + "More info: " + "<a href='" + foursquareId + "'>" + "Click me" + "</a></div>";

                marker.contentString = contentString;

            },
            error: function() {
                contentString = "<div class='name'>Data is currently not available. Please try again.</div>";
            }
        });

        function mapError() {
            alert("Map could not be loaded at this moment. Please try again");
        }
    }
}
//Location Constructor function
var List = function(data) {
    var self = this;
    this.name = data.name;
    this.location = data.location;
    this.visible = ko.observable(true);
};
var AppViewModel = function() {
    var self = this;

    this.markers = ko.observableArray([]);
    this.allLocations = ko.observableArray();
    self.myList = ko.observable("");

    for (i = 0; i < firstLocations.length; i++) {
        var itemsLocation = new List(firstLocations[i]);
        self.allLocations.push(itemsLocation);

    }

    this.searches = ko.computed(function() {
        var filter = self.myList().toLowerCase();
        if (!filter) {
            self.allLocations().forEach(function(itemsLocation) {
                itemsLocation.visible(true);
            });
            return self.allLocations();
        } else {
            return ko.utils.arrayFilter(self.allLocations(), function(itemsLocation) {
                var string = itemsLocation.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                itemsLocation.visible(result);
                return result;
            });
        }

    }, self);

    this.clickMarker = function(position) {
        google.maps.event.trigger(position.marker, 'click');
    };

};

appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);
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