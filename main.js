const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const listOptions = document.querySelectorAll(".option");

let map = document.querySelector("map");
let googleMap = document.createElement("iframe");
let mapStatus = "off";

// Adding and removing options panel
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
        isMapOpen();
        mapOpen(input.id);     
    })
})

function isMapOpen() {
    if (mapStatus === "on") {
        let currentMap = document.querySelector(".iframe");
        body.removeChild(currentMap);
        mapStatus = "off";
    }
}

// Add action listener to <a> , retrieve which label is selected and display map
function mapOpen(university) {
    // FIX ME: remove map if exists - displays two maps instead of one 
    // googleMap.src = "https://www.google.com/maps/d/u/0/embed?mid=1SV3wkaPMxAM73jmbt37518-bN0wS7pg&ehbc=2E312F";
    googleMap.style.height = "480px";
    googleMap.style.width = "640px";

    mapStatus = "on";
    switch(university) {
        case "guelph": 
            googleMap.src = "https://www.google.com/maps/d/u/0/embed?mid=1SV3wkaPMxAM73jmbt37518-bN0wS7pg&ehbc=2E312F";
            break;
    
        case "toronto":
            googleMap.src = "https://www.google.com/maps/d/embed?mid=1m09YD9gbeu4nXdA8NY_O5QdqQW3F538&ehbc=2E312F";
            break;
    }
    //     case "laurier":

    //         break;

    //     case "western":

    //         break;

    //     case "mcmaster":

    //         break;

    //     case "toronto":

    //         break;

    //     case "brock":

    //         break;
        
    // }
    
    document.body.appendChild(googleMap);
}
