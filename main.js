const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const listOptions = document.querySelectorAll(".option");

let map = document.querySelector("map");


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
        mapOpen(input.id);     
    })
})

// Add action listener to <a> , retrieve which label is selected and display map
function mapOpen(university) {
    // FIX ME: remove map if exists - displays two maps instead of one 

        // if (map.hasChildNodes()) {
        //     map.remove();
        // }

    let googleMap = document.createElement("iframe");
    googleMap.src = "https://www.google.com/maps/d/embed?mid=10R-9p0w9a0FVXovNiuJzrygB_3w&ehbc=2E312F";
    googleMap.style.height = "480px";
    googleMap.style.width = "640px";

        // switch(university) {
        //     case "guelph": 
        //         map.src = "https://www.google.com/maps/d/u/0/viewer?mid=10R-9p0w9a0FVXovNiuJzrygB_3w&ll=43.534514775651104%2C-80.22755028221935&z=15";
        //         break;

        //     case "waterloo":
        //         map.src = "https://www.google.com/maps/place/University+of+Waterloo/@43.4722854,-80.5470409,17z/data=!3m1!4b1!4m5!3m4!1s0x882bf6ad02edccff:0xdd9df23996268e17!8m2!3d43.4722854!4d-80.5448576";
        //         break;

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
