
// Initialize the map and set its center and zoom level
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16
});

// Create a Device GPS marker variable
var markerDevice;

// Create a GPS marker variable
var markerGPS;
markerGPS = new google.maps.Marker({
    position: center,
    map: map,
    title: 'Your GPS location',
    icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // URL of the custom icon
        scaledSize: new google.maps.Size(80, 80) // Size of the custom icon
    }
});

// Create an array to hold the other user marker objects
var otherUserMarkers = [];

// Try to get the user's current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        // Set the center of the map to the user's current location
        var center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(center);

        // Create a new marker at the user's current location
        markerDevice = new google.maps.Marker({
            position: center,
            map: map,
            title: 'Your GPS location',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // URL of the custom icon
                scaledSize: new google.maps.Size(80, 80) // Size of the custom icon
            }
        });
    }, function () {
        // If the user denies geolocation or an error occurs, default to a fixed location
        var center = {
            lat: 51.58576287720759,
            lng: 4.792109261691982
        };
        map.setCenter(center);
    });
} else {
    // If geolocation is not supported, default to a fixed location
    var center = {
        lat: 51.58576287720759,
        lng: 4.792109261691982
    };
    map.setCenter(center);
}

// Generate random coordinates within map bounds
function generateRandomCoordinates() {
    var bounds = map.getBounds();
    var lat = Math.random() * (bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) + bounds.getSouthWest().lat();
    var lng = Math.random() * (bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) + bounds.getSouthWest().lng();
    return new google.maps.LatLng(lat, lng);
}

// Generate random new coordinates within map bounds with slight deviation
function generateNewCoordinates(previousCoordinates, deviation) {
    var bounds = map.getBounds();
    var previousLat = previousCoordinates.getPosition().lat();
    var previousLng = previousCoordinates.getPosition().lng();

    var latDeviation = (Math.random() * deviation) - (deviation / 2);
    var lngDeviation = (Math.random() * deviation) - (deviation / 2);

    var lat = previousLat + latDeviation;
    var lng = previousLng + lngDeviation;

    var newLat = Math.min(Math.max(lat, bounds.getSouthWest().lat()), bounds.getNorthEast().lat());
    var newLng = Math.min(Math.max(lng, bounds.getSouthWest().lng()), bounds.getNorthEast().lng());

    return new google.maps.LatLng(newLat, newLng);
}

// Update marker positions at regular intervals
function updateOtherUserMarkers() {
    // Iterate through the marker array
    for (var i = 0; i < otherUserMarkers.length; i++) {
        // Update each marker's position with newly generated random coordinates
        otherUserMarkers[i].setPosition(generateNewCoordinates(otherUserMarkers[i], 0.0005));
    }
}

// Function to create a marker
function createMarker(position, title) {
    return new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // URL of the custom icon
            scaledSize: new google.maps.Size(40, 40) // Size of the custom icon
        }
    });
}

// Function to add a marker to the map
function addMarker() {
    var marker = createMarker(generateRandomCoordinates(), 'Other User location');
    otherUserMarkers.push(marker);
}

// Create an empty array to store the heart rate sensor data
let heartRateData = [];

// Create a new Chart.js chart instance for sensor 1
let heartRateChart = new Chart(document.getElementById('heart-rate-chart-1'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Heart Rate',
            data: [],
            fill: false,
            borderColor: 'rgb(123, 191, 182)',
            lineTension: 0.1
        }]
    },
    options: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false, // Disable aspect ratio maintenance
        scales: {
            x: {
                title: {
                    font: {
                        size: 14,
                        weight: "bold"
                    },
                    color: 'black'
                },

                ticks: {
                    font: {
                        size: 20,
                        weight: "bold"
                    },
                    color: 'black',
                },
            },

            y: {
                title: {
                    font: {
                        size: 14,
                        weight: "bold"
                    },
                    color: 'black'
                },

                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 30,
                        weight: "bold"
                    },
                    color: 'black'
                }
            }
        },
        elements: {
            line: {
                borderWidth: 6 // Set the line width here
            }
        },
        plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 30
                    }
                }
            }
        }
    }
});
const SPACE_EXPRESSION = /\s+/;

const LATITUDE_EXPRESSION = /(\d{1,2})°\s*([0-5]?\d)(?:'([0-5]?\d(?:\.\d+)?)")?\s*(N|S|N\/S)$/; // 0- 90° 0-59' 0-59" N/S
const LONGITUDE_EXPRESSION = /(\d{1,3})°\s*([0-5]?\d)(?:'([0-5]?\d(?:\.\d+)?)")?\s*(E|W|E\/W)$/; // 0-180° 0-59' 0-59" E/W

const matchText = (expression, text) => {
    expression.lastIndex = 0;
    return expression.exec(text);
};

const parseCordinate = (expression, limit, surfaces, text) => {
    const match = matchText(expression, text);
    if (match) {
        const degrees = parseInt(match[1]); // 0-90° or 0-180°
        if (degrees > limit) {
            throw new Error('Incorrect degrees value (should be in range from 0 to ' + limit + ').');
        }
        const minutes = parseInt(match[2] || '0'); // 0-59'
        if (minutes > 59) {
            throw new Error('Incorrect minutes value (should be in range from 0 to 59).');
        }
        const seconds = parseFloat(match[3] || '0'); // 0-59"
        if (seconds > 59) {
            throw new Error('Incorrect seconds value (should be in range from 0 to 59).');
        }
        if (degrees === 0 && minutes === 0 && seconds === 0) {
            return 0;
        }
        const surface = match[4]; // N/S or E/W
        switch (surface) {
            case surfaces[0]: return +(degrees + minutes / 60 + seconds / 3600);
            case surfaces[1]: return -(degrees + minutes / 60 + seconds / 3600);
            default:
                throw new Error('Incorrect surface value (should be ' + surfaces[0] + ' or ' + surfaces[1] + ').');
        }
    }
    throw new Error('Incorrect coordinate format.');
};

const parseLatitude = (latitude) => parseCordinate(LATITUDE_EXPRESSION, 90, 'NS', latitude);
const parseLongitude = (longitude) => parseCordinate(LONGITUDE_EXPRESSION, 180, 'EW', longitude);

const parsePosition = (position) => {
    if (position) {
        const parts = position.split(SPACE_EXPRESSION);
        if (parts.length === 2) {
            const latitude = parseLatitude(parts[0]);
            const longitude = parseLongitude(parts[1]);
            return { latitude, longitude };
        }
    }
    return new Error('Incorrect position format.');
};

async function parseGPSData() {
    try {
        const response = await fetch('https://cmd.camp/iot/get/wuqTEzxE/');
        const data = await response.text();

        const coordinates = data.split(';');
        const latitudeDegrees = coordinates[0].substring(0, 2);
        const latitudeMinutesAndSeconds = coordinates[0].substring(2, coordinates[1].length - 1).split('.');
        const latitudeMinutes = latitudeMinutesAndSeconds[0];
        const latitudeSeconds = (("0." + latitudeMinutesAndSeconds[1]) * 60);
        const longitudeDegrees = coordinates[1].substring(0, 1);
        const longitudeMinutesAndSeconds = coordinates[1].substring(1, coordinates[1].length - 1).split('.');
        const longitudeMinutes = longitudeMinutesAndSeconds[0];
        const longitudeSeconds = (("0." + longitudeMinutesAndSeconds[1]) * 60);

        const latitudeDirection = coordinates[0].includes('N') ? 'N' : 'S';
        const longitudeDirection = coordinates[1].includes('E') ? 'E' : 'W';

        const formattedLatitude = latitudeDegrees + '°' + latitudeMinutes + '\'' + latitudeSeconds + '\"' + latitudeDirection;
        const formattedLongitude = longitudeDegrees + '°' + longitudeMinutes + '\'' + longitudeSeconds + '\"' + longitudeDirection;

        console.log('Data raw:', data);
        console.log('Latitude formatted:', formattedLatitude);
        console.log('Longitude formatted:', formattedLongitude);
        console.log('Latitude parsed:', parseLatitude(formattedLatitude));
        console.log('Longitude parsed:', parseLongitude(formattedLongitude));

        // Update the marker positions
        var newGPSPosition = new google.maps.LatLng(parseLatitude(formattedLatitude), parseLongitude(formattedLongitude));
        markerGPS.setPosition(newGPSPosition);
        navigator.geolocation.getCurrentPosition(function (position) {
            var newDevicePosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            markerDevice.setPosition(newDevicePosition);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getHeartRateData() {
    const response = await fetch('https://cmd.camp/iot/get/zDgGPPCC/');
    const data = await response.text();

    const now = new Date();
    const heartRate = parseInt(data);
    heartRateData.push({ x: now, y: heartRate });

    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    heartRateData = heartRateData.filter(dataPoint => dataPoint.x >= fiveMinutesAgo);

    const labels = heartRateData.map(dataPoint => dataPoint.x.toLocaleTimeString());
    const heartRates = heartRateData.map(dataPoint => dataPoint.y);

    heartRateChart.data.labels = labels;
    heartRateChart.data.datasets[0].data = heartRates;
    heartRateChart.update();
}

// Call functions every 2 seconds
setInterval(getHeartRateData, 2000);
setInterval(parseGPSData, 2000);
setInterval(updateOtherUserMarkers, 2000);
setInterval(addMarker, 4000);

