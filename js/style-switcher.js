const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

styleSwitcherToggler.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open")
})

window.addEventListener("scroll", () =>{
    if(document.querySelector(".style-switcher").classList.contains("open")){
        document.querySelector(".style-switcher").classList.remove("open");
    }
})


/*------------------- theme colors -------------------  */
const alternateStyle = document.querySelectorAll(".alternate-style");

function setActiveStyle(color) {
    alternateStyle.forEach((style) =>{
        if(color === style.getAttribute("title")){
            style.removeAttribute("disabled");
        }
        else{
            style.setAttribute("disabled", "true")
        }
    })

    // Update active class for color switcher spans
    const colorSpans = document.querySelectorAll(".style-switcher .colors span");
    colorSpans.forEach((span) => {
        span.classList.remove("active");
        if (span.classList.contains(color)) { // Assumes color parameter is 'color-X'
            span.classList.add("active");
        }
    });
    
    // Update skin color RGB values for modern image effects
    const root = document.documentElement;
    
    // RGB values for each theme color
    const colorRgbValues = {
        'color-1': '255, 93, 143',  // Pink
        'color-2': '32, 201, 151',   // Green
        'color-3': '31, 171, 137',   // Teal
        'color-4': '255, 74, 86',    // Red
        'color-5': '252, 176, 69'    // Orange
    };
    
    // Set the CSS variable
    root.style.setProperty('--skin-color-rgb', colorRgbValues[color]);
}

/*------------------- dark mode -------------------  */
const dayNight = document.querySelector(".day-night");

dayNight.addEventListener("click", () =>{
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
});

window.addEventListener("load", ()=>{
    if(document.body.classList.contains("dark")){
        dayNight.querySelector("i").classList.add("fa-sun");
        dayNight.querySelector("i").classList.remove("fa-moon");
    }
    else{
        dayNight.querySelector("i").classList.add("fa-moon");
        dayNight.querySelector("i").classList.remove("fa-sun");
    }
    // Set the default active color (color-4) on load
    const defaultColorSpan = document.querySelector(".style-switcher .colors .color-4");
    if (defaultColorSpan) {
        defaultColorSpan.classList.add("active");
    }
    // If another color is active via link (e.g. color-4 is default enabled in HTML), ensure it's marked active
    let currentlyActiveColor = "color-4"; // Default
    alternateStyle.forEach((style) => {
        if (!style.hasAttribute("disabled")) {
            currentlyActiveColor = style.getAttribute("title");
        }
    });
    const activeColorSpan = document.querySelector(`.style-switcher .colors .${currentlyActiveColor}`);
    if (activeColorSpan) {
        // Remove active from all first
        document.querySelectorAll(".style-switcher .colors span").forEach(s => s.classList.remove("active"));
        activeColorSpan.classList.add("active");
    }
});