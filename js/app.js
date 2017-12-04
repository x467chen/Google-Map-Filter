var map;
var markers = [];
var CLIENT_ID = "GCZGVNTNRZJ3AR32R3NZVUQOVMUL3QO4PLKEB4B0EBEDEP1G";
var CLIENT_SECRET = "RLY15RO45VOEWOHCB12JVDH51KMNS5B2T5OXPPY4AHL3KVBR";

/* ======= Create Map ======= */
function initMap() {
    var styles = [
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "hue": "#FFBB00"
                },
                {
                    "saturation": 43.400000000000006
                },
                {
                    "lightness": 37.599999999999994
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "hue": "#FFC200"
                },
                {
                    "saturation": -61.8
                },
                {
                    "lightness": 45.599999999999994
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "hue": "#FF0300"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 51.19999999999999
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "hue": "#FF0300"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 52
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#0078FF"
                },
                {
                    "saturation": -13.200000000000003
                },
                {
                    "lightness": 2.4000000000000057
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "hue": "#00FF6A"
                },
                {
                    "saturation": -1.0989010989011234
                },
                {
                    "lightness": 11.200000000000017
                },
                {
                    "gamma": 1
                }
            ]
        }
    ];
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.64848, lng: -79.38544},
        zoom: 12,
        styles: styles,
        mapTypeControl: false
    });

    //Create a window show more detail
    var largeInfowindow = new google.maps.InfoWindow();
    // Set icon colour
    var defaultIcon = makeMarkerIcon('4');
    var highlightedIcon = makeMarkerIcon('3');


    //Create markers
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

        //click animation for marker
        marker.addListener('click', function () {
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
                // setTimeout
                this.setAnimation(4);
            }
        });

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            popInfoWindow(this, largeInfowindow);
        });
        
        //listeners for mouseover, change the colors red
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        //listeners for mouseover, change the colors black
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    }
    showListings(markers);
}


//Pop the infowindow when the marker is clicked
//only allow one infowindow at each time
//add info to mark from API
function popInfoWindow(marker, infowindow) {
    this.lat = marker.position.lat().toFixed(2);
    this.long = marker.position.lng().toFixed(2);
    this.title = marker.title;

    var URL = 'https://api.foursquare.com/v2/venues/search?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&ll=' + this.lat + ',' + this.long + '&query=' + this.title + '&v=20170801';


    $.getJSON(URL, function (json) {
        var res = json.response.venues[0];

        this.address = res.location.formattedAddress[0];
        this.url = res.url;

        // var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + this.address + '';
        // console.log(streetviewUrl);

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            //assign the current mark to the window
            infowindow.marker = marker;

            if (this.url === undefined) {
                this.url = "Not provided";
            }
            infowindow.setContent('<div><b>' + marker.title + '</b></div>' + '<div><b>' + this.address + '</b></div>' + '<a href="' + this.url + ' ">' + this.url + '</a><br>');
            // + '<div><img src="' + streetviewUrl + '"></div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    }).fail(function () {
        alert("Loading Foursquare API Failure. Please refresh your page to try again.");
    });
}


//Loop all markers and display them all.
function showListings() {
    //set bound for the map
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}



//Creates a new marker
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'img/' + markerColor + '.png',
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(32, 32));
    return markerImage;
}


/* ======= Model ======= */
var locations = [
    {title: 'Toronto', location: {lat: 43.64, lng: -79.38}},
    {title: 'Laylow Beer Bar & Eatery', location: {lat: 43.65, lng: -79.43}},
    {title: 'Edo-Ko', location: {lat: 43.68, lng: -79.41}},
    {title: 'La Prep', location: {lat: 43.67, lng: -79.38}},
    {title: 'Live Organic Food Bar', location: {lat: 43.67, lng: -79.40}},
    {title: 'Barrio Coreano', location: {lat: 43.66, lng: -79.41}},
    {title: 'WVRST', location: {lat: 43.64, lng: -79.40}},
    {title: 'Swiss Chalet', location: {lat: 43.68, lng: -79.39}}
];


/* ======= ViewModel ======= */
var koViewModel = function (locations) {
    var self = this;

    self.googleMap = map;
    self.markers = markers;
    initMap();

    //add info to mark
    var Lo = function (data) {
        this.title = data.title;
        this.location = data.position;
        this.marker = data;
        this.visible = ko.observable(true);
    };

    self.tmpname = ko.observableArray([]);
    self.markers.forEach(function (marker) {
        self.tmpname.push(new Lo(marker));
    });


    //create an array to control markers
    self.visiblePlaces = ko.observableArray();
    self.markers.forEach(function (marker) {
        self.visiblePlaces.push(marker);
    });
    // create a input collecter
    self.userInput = ko.observable('');

    // filter markers
    self.filterMarkers = function () {
        var searchInput = self.userInput().toLowerCase();

        self.visiblePlaces.removeAll();

        self.markers.forEach(function (marker) {
            marker.setMap(null);

            if (marker.title.toLowerCase().indexOf(searchInput) !== -1) {
                self.visiblePlaces.push(marker);
            }
        });


        self.visiblePlaces().forEach(function (marker) {
            marker.setMap(map);
        });
    };

    // filter list
    this.filterList = ko.computed(function () {
        var currentInput = self.userInput().toLowerCase();
        if (!currentInput) {
            self.tmpname().forEach(function (location) {
                location.visible(true);
                self.filterMarkers();
            });
            return self.tmpname();
        } else {
            return ko.utils.arrayFilter(self.tmpname(), function (location) {
                var result = (location.title.toLowerCase().search(currentInput) >= 0);
                location.visible(result);
                self.filterMarkers();
                return result;
            });
        }
    }, self);


    this.popInfo = function () {
        google.maps.event.trigger(this.marker, 'click');

    };

    this.showall = function () {
        self.markers.forEach(function (marker) {
            marker.setMap(map);
        });
    };

    this.hideall = function (){
        self.markers.forEach(function (marker) {
            marker.setMap(null);
        });
    }


};


function StartApp() {
    ko.applyBindings(new koViewModel(locations));

}

function googleError() {
    alert('Google Maps custom error triggered');
}

