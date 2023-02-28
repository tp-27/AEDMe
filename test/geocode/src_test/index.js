let map;
let directionsService;
let directionsDisplay;
let allLocations = [];
let markers = [];

// window.onload = function() {
//     document.getElementById('find_aed').addEventListener("click", function() {
//         const currLocation = new google.maps.LatLng(43.5327, -80.2262); // hard-coded CURRENT POSITION
//         let currMarker;
//         let nearestAEDS = [];

//         // find nearest AEDS
//         currMarker = setCurrMarker(currLocation);
//         console.log(markers[0]);
//         nearestAEDS = findNearestAED(markers, currMarker);

//         for (let i  = 0; i < nearestAEDS.length; i++) {
//             console.log(nearestAEDS[i]);
//         }

//         // remove find_aed button 
//         document.getElementById('find_aed').remove();
        
//         // display locations 
//         let locationPanel = document.getElementById("locations");
//         locationPanel.style.cssText = `
//             justify-content: space-evenly;
//             align-items: center;
//         `
//         createPanel(locationPanel); // hard-code for now , may change geocode method, test DOM adding
//     });
   
// }

// initialize map display
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: 43.5327, lng: -80.2262 },
    });


    getAddress();

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(map);
}

// get addresses and coordinates from json file 
function getAddress() {
    fetch('guelph_latlng.json') // fetch is preferrable when read JSON from exteral server/local
    .then(function(response) {return response.json(); })
    .then(function(results) {
        objectLen = Object.keys(results).length; // get total number of keys in object
        console.log(objectLen);

        let location = [];
        // let allLocations = [];
        for (key in results) {
            // transfer results of json obj to an array 
            location.push(results[key].address);
            location.push(results[key].coordinates);
            allLocations.push(location);
            
            // clear temporary location holder
            location = [];
        }

        return objectLen;
    })
    .then(function(numLocations) {
        createMarkers(numLocations);
    })
    .then(function() {
        // FIX ME - Make this into a function?
        document.getElementById('find_aed').addEventListener("click", function() {
            const currLocation = new google.maps.LatLng(43.5327, -80.2262); // hard-coded CURRENT POSITION
            let currMarker;
            let nearestAEDS = [];
    
            // find nearest AEDS
            currMarker = setCurrMarker(currLocation);
            nearestAEDS = findNearestAED(currMarker);

            // remove find_aed button 
            document.getElementById('find_aed').remove();
            
            // display locations 
            let locationPanel = document.getElementById("locations");
            locationPanel.style.cssText = `
                justify-content: space-evenly;
                align-items: center;
            `
            createPanel(locationPanel, nearestAEDS, currMarker); 
        })
    });
}

// create and add all markers to map
function createMarkers(numLocations) {
    // Add all markers to map
    for (let i = 0; i < numLocations; i++) {
        let coordinates = allLocations[i][1].split(',');
        let lng = coordinates[0];
        let lat = coordinates[1];
        let theLatLng = new google.maps.LatLng(lat, lng);

        let marker = new google.maps.Marker({
            position: theLatLng,
            map: map,
            animation: google.maps.Animation.DROP, // Possibly add delay between drops?
            // animation: google.maps.Animation.BOUNCE, 
        });

        markers.push(marker); 
    }
}

// create nearest aed locations panel next to map
function createPanel(panel, nearestAEDS, currMarker) {
    // console.log(allLocations);
    for (let i = 0; i < 5; i++) {
        let newDiv = document.createElement("div");
        let insideNewDiv = document.createElement("div");

        newDiv.style.cssText = `
            height: 100vh;
            width: 100%;
            border: 2px solid red;
        `

        insideNewDiv.style.cssText = `
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        `
        
        // add content to div + event listener
        insideNewDiv.innerHTML = nearestAEDS[i][2] + i;
        newDiv.appendChild(insideNewDiv);

        insideNewDiv.addEventListener("click", (e) => {
            map.panTo(nearestAEDS[i][3]);
            map.setCenter(nearestAEDS[i][3]);
            map.setZoom(16);

            // get directions from curr to aed
            directionsService.route({
                origin: getLatLng(currMarker),
                destination: getLatLng(nearestAEDS[i][0]),
                travelMode: 'WALKING'
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            })
        });

        panel.appendChild(newDiv);
    }
}

// compute distances from markers
function findNearestAED(currMarker) {
    let allDistances = [];
    let nearest = [];
    let distance;
    let address;
    let latLng;

    // compute distances between each marker and location
    for(let i = 0; i < markers.length; i++) {
        distance = haversine_distance(markers[i], currMarker);

        // find corresponding location information
        address = findLocationInfo(markers[i]);
        latLng = getLatLng(markers[i]);

        mark_dist = [markers[i], distance, address, latLng];
        allDistances.push(mark_dist);
    }

    // sort from smallest to largest - insertion sort
    allDistances.sort();

    // return an array of top 5
    for(let i = 0; i < 5; i++) {
        nearest.push(allDistances[i]);
    }

    return nearest; // I want to return the markers associated with the distance
}

// haversine formula for calculating distance in KM between two points on surface of a sphere
function haversine_distance(marker1, marker2) {
    let R = 6371.0710; // Radius of the Earth in km
    let rlat1 = marker1.position.lat() * (Math.PI/180); // Convert degrees to radians
    let rlat2 = marker2.position.lat() * (Math.PI/180); // Convert degrees to radians
    let difflat = rlat2-rlat1; // Radian difference (latitudes)
    let difflon = (marker2.position.lng()-marker1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

    let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}

function findLocationInfo(marker) {
    // create lat/lng string
    let lng = marker.getPosition().lat().toString(); // lat/lng from json file opposite of google maps
    let lat = marker.getPosition().lng().toString();
    let latlng = lat.concat(',  ' , lng); // Match json string format to compare
    let address = '';

    // FIX ME!!!!! Look at notes
    // compare string to all locations and assign with correct address
    for (let i = 0; i < allLocations.length; i++) {
        if (latlng == allLocations[i][1]) {
            console.log("comparing %s, to %s ", latlng, allLocations[i][1]);
            console.log("match"); // What about duplicates?
            address = allLocations[i][0];
            return address;

        }
    }

    return address;
}

// Helper function: returns LatLng object for a marker 
function getLatLng(marker) {
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    let latLng = new google.maps.LatLng(lat, lng);

    return latLng;
}

// create a marker for the current location
function setCurrMarker(currLocation) {
    let currMarker = new google.maps.Marker({
        map: map,
        position: currLocation,
        icon: { // make marker different colour
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    return currMarker;
}

// window.initMap = initMap;


