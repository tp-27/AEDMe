// Adding and removing options panel
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const listOptions = document.querySelectorAll(".option");
const container = document.querySelector(".container");
const checkbox = document.getElementById("checkbox");
const optionMenu = document.querySelector(".select-menu"),
                    selectBtn = optionMenu.querySelector(".select-btn"),
                    options = optionMenu.querySelectorAll(".option"),
                    sBtn_text = optionMenu.querySelector(".sBtn-text");
let map;
let geocoder;
let selectedOption;
let selectedCampus;

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));
options.forEach(option => {
    option.addEventListener("click", () => {
        selectedOption = option.querySelector(".option-text");
        sBtn_text.innerText = selectedOption.innerHTML;
        // console.log(selectedOption);
        optionMenu.classList.remove("active");
        selectedCampus = selectedOption.id;
        console.log(selectedCampus);
    });
});

checkbox.addEventListener('change', function() {
    if(this.checked) {
        const url = `./map.html?campus=${selectedCampus}`;
        window.location.href = url;
    }
});


// selected.addEventListener("click", () => {
//     optionsContainer.classList.toggle("active");
// });

// listOptions.forEach(options => {
//     options.addEventListener("click", () => {
//         // add/remove options drop-down
//         selected.innerHTML = options.querySelector("label").innerHTML;
//         optionsContainer.classList.remove("active"); 

//         // find id of university selected
//         const input = options.querySelector(".radio");
//         map = initMap(); 
//         // addmarkers(input.id, map);      
        
//         // move selection box
//         container.style.justifyContent = 'flex-start';
//     });
// });
