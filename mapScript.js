// Define a global variable to hold the directionsService object
var directionsService;

var waypoints = [{
        location: 'Rijksmuseum, Museumstraat 1, 1071 XX Amsterdam'
    },
    {
        location: 'Heineken Brouwerijen B.V., Tweede Weteringplantsoen 21, 1017 ZD Amsterdam'
    },
    {
        location: 'Rembrandtplein, 1017 CT Amsterdam'
    },
    {
        location: 'InterContinental Amstel Amsterdam, Professor Tulpplein 1, 1018 GX Amsterdam'
    },
    {
        location: 'Munttoren, Muntplein 12/14, 1012 WR Amsterdam'
    },
    {
        location: 'Dam, Amsterdam'
    },
    {
        location: 'Damrak, Amsterdam'
    },
    {
        location: 'Amsterdam Centraal, Stationsplein, 1012 AB Amsterdam'
    },
];

// Initialize the map and set its center and zoom level
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15
});

// Try to get the user's current location
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//         // Set the center of the map to the user's current location
//         var center = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//         };
//         map.setCenter(center);

//         // Create a new marker at the user's current location
//         var marker = new google.maps.Marker({
//             position: center,
//             map: map,
//             title: 'Your location'
//         });
//     }, function () {
//         // If the user denies geolocation or an error occurs, default to a fixed location
//         var center = {
//             lat: 52.3708071103309,
//             lng: 4.89979075243757
//         };
//         map.setCenter(center);
//     });
// } else {
//     // If geolocation is not supported, default to a fixed location
var center = {
    lat: 52.3708071103309,
    lng: 4.89979075243757
    //52.3708071103309, 4.89979075243757
};
map.setCenter(center);
// }

// Create a marker image
var markerImage = {
    url: 'img/location-icon.png',
    size: new google.maps.Size(316, 452),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(32, 64),
    scaledSize: new google.maps.Size(52, 75)
};

// Create a new marker and set its properties
var marker1 = new google.maps.Marker({
    position: {
        lat: 52.359992927340016,
        lng: 4.885133598746045
        //52.359992927340016, 4.885133598746045
    },
    map: map,
    title: 'Place of Interest 1',
    icon: markerImage
});

// Create another marker and set its properties
var marker2 = new google.maps.Marker({
    position: {
        lat: 52.35856868159965,
        lng: 4.893034967473499
        // 52.35856868159965, 4.893034967473499
    },
    map: map,
    title: 'Place of Interest 2',
    icon: markerImage
});

// Create a third marker and set its properties
var marker3 = new google.maps.Marker({
    position: {
        lat: 52.365845437941495,
        lng: 4.896923804704618
        // 52.365845437941495, 4.896923804704618
    },
    map: map,
    title: 'Place of Interest 3',
    icon: markerImage
});

// Create a fourth marker and set its properties
var marker4 = new google.maps.Marker({
    position: {
        lat: 52.3600379495618,
        lng: 4.905258364525107
        // 52.3600379495618, 4.905258364525107
    },
    map: map,
    title: 'Place of Interest 3',
    icon: markerImage
});

// Create a fifth marker and set its properties
var marker5 = new google.maps.Marker({
    position: {
        lat: 52.367099363044034,
        lng: 4.893260735511275
        // 52.367099363044034, 4.893260735511275
    },
    map: map,
    title: 'Place of Interest 3',
    icon: markerImage
});

// Create a sixth marker and set its properties
var marker6 = new google.maps.Marker({
    position: {
        lat: 52.373102446569874,
        lng: 4.89271112002922
        // 52.373102446569874, 4.89271112002922
    },
    map: map,
    title: 'Place of Interest 3',
    icon: markerImage
});

// Create a seventh marker and set its properties
var marker7 = new google.maps.Marker({
    position: {
        lat: 52.37526604056839,
        lng: 4.895879835827166
        // 52.37526604056839, 4.895879835827166
    },
    map: map,
    title: 'Place of Interest 3',
    icon: markerImage
});

// Create a eigth marker and set its properties
var marker8 = new google.maps.Marker({
    position: {
        lat: 52.37918569392012,
        lng: 4.900382747738388
        // 52.37918569392012, 4.900382747738388
    },
    map: map,
    title: 'Place of Interest 3',
    icon: markerImage
});

// Create a new DirectionsService object
directionsService = new google.maps.DirectionsService();

var request = {
    origin: 'Rijksmuseum, Museumstraat 1, 1071 XX Amsterdam',
    destination: 'Amsterdam Centraal, Stationsplein, 1012 AB Amsterdam',
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
};

directionsService.route(request, function (result, status) {
    if (status == 'OK') {
        var directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true, // Set suppressMarkers option to true
            polylineOptions: {
                strokeColor: '#FF0000', // Set the color of the line
                strokeWeight: 5 // Set the width of the line
            }
        });
        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(result);
    }
});