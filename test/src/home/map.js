let map;
let directionsService;
let directionsDisplay;
let infowindow;
let allLocations = [];
let markers = []; // markers = [ {marker, location, building} ]
let campus;
let currPosLatLng; 
let currLatLng;
let currPosMarker;
const campusCoord = {};


// initialize map display
function initMap() {
    const queryParams = new URLSearchParams(window.location.search);    // get query string for campus selected
    const geolocate_switch = document.getElementById("switcher");

    campusCoord["guelph"] = [43.5322 , -80.2267];
    campusCoord["waterloo"] = [43.4723, -80.5449];
    campusCoord["carleton"] = [45.3838, -75.6960];
    campusCoord["ottawa"] = [45.4215, -75.6972];
    campusCoord["toronto"] = [43.6532, -79.3832];
    campusCoord["mcmaster"] = [43.2619, -79.9192];
    campusCoord["manitoba"] = [49.8086, -97.1325];
    campusCoord["brock"] = [43.1167, -79.2494];

    campus = queryParams.get("campus");
    if (campus == "undefined") {
        campus = "guelph"; //default map
    } 

    // get map coordinates
    let coords = campusCoord[campus];
    let latitude = coords[0];
    let longitude = coords[1];

    // initialize map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat:  latitude, lng: longitude },
    });

    currPosLatLng = new google.maps.LatLng(latitude, longitude);
    currPosMarker = setCurrMarker(currPosLatLng);
    getAEDInfo(campus, currPosLatLng);    // retrieve AED information

    // current location button
    geolocate_switch.addEventListener('change', function() {
        if(this.checked) {
            // reset map
            clear(document.getElementById("locations"));
            // clearMarkers();
            
            // add loading icon
            let panel = document.getElementById("locations");
            let icon = makeLoadElement();
            panel.appendChild(icon);

            // find geolocation
            setTimeout(geolocate(), 450); // this delay allows for the toggler switch animation to play out 
        } else {
            // reset map (clear AED marker and curr location marker)
            currPosMarker.setMap(null);

            // clear AED locations panel
            clear(document.getElementById("locations"));
            let locationPanel = document.getElementById("locations");

            // find new locations
            currPosLatLng = new google.maps.LatLng(latitude, longitude);
            currPosMarker = setCurrMarker(currPosLatLng);
            let nearestAEDS = findNearestAED(currPosLatLng);
            createPanel(locationPanel, nearestAEDS, currPosMarker); 
            // getAEDInfo(campus, currPosLatLng);
        }

        directionsDisplay.setMap(null);
    });

    // FIX ME - MIGHT NEED TO BREAK DOWN getAEDInfo into functions 
    function geolocate() {
        let pos;

        // check for geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    
                    currPosMarker.setMap(null); // remove current marker from map
                    currPosLatLng = new google.maps.LatLng(pos['lat'], pos['lng']); 
                    // map.setCenter(currPosLatLng);
                    currPosMarker = setCurrMarker(currPosLatLng); // returns a new marker
                    
                    // ****** TEST *********
                        let nearestAEDS = [];
        
                        // find nearest AEDS
                        nearestAEDS = [];
                        nearestAEDS = findNearestAED(currPosLatLng); // nearestAEDS = [{marker, distance, latLng}], marker = {building, location}
            
                        // display locations 
                        let locationPanel = document.getElementById("locations");
                        locationPanel.style.cssText = `
                            background-color: white;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-evenly;
                            align-items: center;
                            overflow: auto;
                            height: 800px;
                            width: 600px;
                        `


                        console.log(nearestAEDS);
                        createPanel(locationPanel, nearestAEDS, currLatLng); 

                    // *************************
                    // getAEDInfo(campus, currLatLng);    // retrieve AED information
                    // alert(currLatLng);
                }
            )
        } else {
            alert("Browser does not support geolocation"); // use campus location
            pos = {
                lat: latitude,
                lng: longitude
            };

            currLatLng = new google.maps.LatLng(pos['lat'], pos['lng']); 
            console.log(currLatLng);
            currPosLatLng = setCurrMarker(currLatLng);
            getAEDInfo(campus, currPosLatLng);    // retrieve AED information
        }
    }

    // add directions display to map
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
}

// function clearMarkers() {
//     for (let i = 0 ; i < markers.length; i++) {
//         markers[i][0].setMap(null);
//     }

//     markers[0] = 0;
// }

// creates a div element that contains a loading icon
function makeLoadElement() {
    const div = document.createElement("div");
    const icon = document.createElement("i");

    div.className = "fa-4x";
    icon.className = "fa-solid fa-heart fa-beat";
    div.appendChild(icon);
    return div;
}


// retrieve AED info from corresponding json, add markers to map, add location panel
function getAEDInfo(campus, currPosMarker) {
    const fileNames = {
        "guelph": "../info_json/guelph/guelph_latlng.json",
        "waterloo": "../info_json/waterloo/waterloo_latlng.json",
        "carleton": "../info_json/carleton/carleton_latlng.json",
        "ottawa": "../info_json/ottawa/ottawa_latlng.json",
        "toronto": "../info_json/toronto/toronto_latlng.json",
        "mcmaster": "../info_json/mcmaster/mcmaster_latlng.json",
        "manitoba": "../info_json/manitoba/manitoba_latlng.json",
        "brock": "../info_json/brock/brock_latlng.json"
    }

    file = fileNames[campus];
    fetch(file) 
    .then(function(response) {return response.json();})
    .then(function(results) {
        objectLen = Object.keys(results).length; // get total number of keys in object
        console.log(objectLen);

        let location = [];
        for (key in results) {
            location.push(results[key].building);
            location.push(results[key].location);
            location.push(results[key].coordinates);
            allLocations.push(location); // transfer results of json obj to an array 
            
            location = [];   // clear temporary location holder
        }
        return objectLen;
    })
    .then(function(numLocations) {
        infowindow = new google.maps.InfoWindow();
        createMarkers(numLocations);
    })
    .then(function() {
        const button = document.getElementById("find-me");
        if (button) {
            button.addEventListener("click", function() {
                let nearestAEDS = [];
    
                // find nearest AEDS
                nearestAEDS = findNearestAED(currPosMarker); // nearestAEDS = [{marker, distance, latLng}], marker = {building, location}
    
                // remove find_aed button 
                document.getElementById('find-me').remove();
                
                // display locations 
                let locationPanel = document.getElementById("locations");
                locationPanel.style.cssText = `
                    background-color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                    overflow: auto;
                    height: 800px;
                    width: 600px;
                `
                createPanel(locationPanel, nearestAEDS, currPosMarker); 
            });
        } else {
            let nearestAEDS = [];
            let locationPanel = document.getElementById("locations");

            // locationPanel.clear();
            clear(locationPanel);
            locationPanel.style.cssText = `
                background-color: white;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                overflow: auto;
                height: 800px;
                width: 600px;
            `
            nearestAEDS = findNearestAED(currPosMarker); // nearestAEDS = [{marker, distance, latLng}], marker = {building, location}
            createPanel(locationPanel, nearestAEDS, currPosMarker); 
        }
    })
}

// clears all of the children nodes within an element
function clear(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

// create and add all markers to map
function createMarkers(numLocations) {
    // Add all markers to map
    for (let i = 0; i < numLocations; i++) {
        let coordinates = allLocations[i][2].split(','); // allLocations =  {[building, location, coordinates]}
        let lng = coordinates[0];
        let lat = coordinates[1];
        let theLocation = allLocations[i][1];
        let theBuilding = allLocations[i][0];
        let theLatLng = new google.maps.LatLng(lat, lng);
        let theMarker = []

        let marker = new google.maps.Marker({
            position: theLatLng,
            map: map,
            animation: google.maps.Animation.DROP, // Possibly add delay between drops?
        });
        
        const contentStr = 
            '<h3>' + theBuilding + '</h3>' +
            '<p>' + theLocation + '</p>';

        marker.addListener("click", () => {
            infowindow.setContent(contentStr);
            infowindow.open({
                anchor: marker,
                map,
            });
        });

        theMarker.push(marker, theLocation, theBuilding);
        markers.push(theMarker); 
    }
}

// create nearest aed locations panel next to map
function createPanel(panel, nearestAEDS, currMarker) {
    clear(panel);
    // add locations to panel - maybe (add whole list with scroll?)
    console.log(nearestAEDS.length);
    for (let i = 0; i < nearestAEDS.length; i++) {
        let infoDiv = document.createElement("div");
        let buildingDiv = document.createElement("div");
        let locationDiv = document.createElement("div");
        let newDiv = document.createElement("div");

        newDiv.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 30px;
        `
      
        infoDiv.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 15px;
            font-size: 25px;
        `

        locationDiv.style.cssText = `
            height: 50%;
            width: 400px;
            font-size: 19px;
            font-weight: 700;
        `

        buildingDiv.style.cssText = `
            height: 50%;
            width: 400px;
            font-size: 17px; 
            color: light grey;
        `

        // add icon with distance
        let iconDiv = document.createElement("div");
        let icon = document.createElement("i");
        let distDiv = document.createElement("div");
        
        iconDiv.style.cssText = `
            display: flex;
            height: 50px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-right: 20px;
        `

        distDiv.style.cssText = `
            font-size: 13px;
        `

        icon.classList.add('bx' , 'bx-map'); // add map icon
        distDiv.innerHTML = parseFloat(nearestAEDS[i][1]).toFixed(2) + "km"; // truncate dist to 2 decimal places
        iconDiv.append(icon);
        iconDiv.append(distDiv);
        
        // add content to div + event listener
        // nearestAEDS = [{marker, distance, latLng}], marker = {building, location}
        locationDiv.innerHTML = nearestAEDS[i][0][1];
        buildingDiv.innerHTML = nearestAEDS[i][0][2]; 

        infoDiv.appendChild(locationDiv);
        infoDiv.appendChild(buildingDiv);
        
        newDiv.addEventListener('mouseenter', function() {
            newDiv.style.backgroundColor = "#F2F2F2";
        });

        newDiv.addEventListener('mouseleave', function() {
            newDiv.style.backgroundColor = "";
            newDiv.style.fontWeight = "";
        });

        
        newDiv.appendChild(iconDiv);
        newDiv.appendChild(infoDiv);

        infoDiv.addEventListener("click", (e) => {
            map.panTo(nearestAEDS[i][2]);
            map.setCenter(nearestAEDS[i][2]);
            map.setZoom(16);

            // draw line from current location to aed selected
            directionsService.route({
                origin: currPosLatLng, // FIX ME - CURRMARKER WILLL BE A MARKER_INFO OBJECT AS WELL
                destination: nearestAEDS[i][2],
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
function findNearestAED(currPosLatLng) {
    let allDistances = [];
    let nearest = [];
    let distance;
    let address;
    let latLng;

    console.log(currPosLatLng);
    // compute distances between each marker and location
    for(let i = 0; i < markers.length; i++) {
        distance = haversine_distance(markers[i][0], currPosLatLng);

        latLng = getLatLng(markers[i][0]);

        mark_dist = [markers[i], distance, latLng]; // markers[i] contains {marker, building, location}
        allDistances.push(mark_dist);
    }

    // sort from smallest to largest - insertion sort
    allDistances.sort(function(a, b) { return a[1] - b[1] });

    for(let i = 0; i < allDistances.length; i++) {
        console.log(allDistances[i][1]);
    }

    return allDistances; // I want to return the markers associated with the distance
}

// haversine formula for calculating distance in KM between two points on surface of a sphere
function haversine_distance(marker1, currLocation) {
    // console.log(currLocation.lat());
    // console.log(currLocation.lng());

    let R = 6371.0710; // Radius of the Earth in km
    let rlat1 = marker1.position.lat() * (Math.PI/180); // Convert degrees to radians
    let rlat2 = currLocation.lat() * (Math.PI/180); // Convert degrees to radians
    let difflat = rlat2-rlat1; // Radian difference (latitudes)
    let difflon = (currLocation.lng()-marker1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

    let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    console.log(d);
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

    map.setCenter(currLocation);
    return currMarker;
}

