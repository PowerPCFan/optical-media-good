var urlStart = "img/wallpapers";
var backgrounds = [
    urlStart + "/Bliss.jpg",
    urlStart + "/Red-moon-desert.jpg",
    urlStart + "/Ascent.jpg",
    urlStart + "/Follow.jpg",
    urlStart + "/Autumn.jpg",
    urlStart + "/House.jpg"
];

var choice = backgrounds[Math.floor(Math.random() * backgrounds.length)];

document.body.style.backgroundImage = "url(" + choice + ")";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
