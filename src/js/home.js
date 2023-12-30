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
        optionMenu.classList.remove("active");
        selectedCampus = selectedOption.id;
        console.log(selectedCampus);

        // go to map 
        const url = `../src/html/map.html?campus=${selectedCampus}`;
        window.location.href = url;
    });
});