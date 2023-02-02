// Adding and removing options panel
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const listOptions = document.querySelectorAll(".option");
const container = document.querySelector(".container");
let map;

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
});

listOptions.forEach(options => {
    options.addEventListener("click", () => {
        // add/remove options drop-down
        selected.innerHTML = options.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active"); 

        // find id of university selected
        const input = options.querySelector(".radio");
        map = initMap(input.id);  
        addmarkers(input.id, map);      
        
        // move selection box
        container.style.justifyContent = 'flex-start';
    })
})

// Map functions
function initMap(university) {
    let campus; 

    switch(university) {
        case "guelph":
            campus = { lat: 43.5327217, lng: -80.2261804 };
            break;

        case "waterloo":
            campus = { lat: 43.4723, lng: -80.5449 };
            break;

        case "laurier":
            campus = { lat: 43.4738, lng: -80.5275 };
            break;

        case "western":
            campus = { lat: 43.0096, lng: -81.2737 };
            break;

        case "mcmaster":
            campus = { lat: 43.2609, lng: -79.91912};
            break;

        case "toronto":
            campus = { lat: 43.6629, lng:  -79.3957 };
            break;
    
        case "brock":
            campus = { lat: 43.1176, lng: -79.2477 };
            break;

    }

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: campus,
        
    });

    addMarkers(university); 
}

function addMarkers(university) {
    marker = new google.maps.Marker({
        position: {lat: 43.5294, lng: -80.2277},
        map,
        title: "Hello World!",
      });
}
