// Commit `623828c3f1497e45bbda783bee1bf8f245e33ce9` on `https://github.com/PowerPCFan/optical-media-good` branch `main`
// var urlStart = "https://raw.githubusercontent.com/PowerPCFan/optical-media-good/623828c3f1497e45bbda783bee1bf8f245e33ce9/img/wallpapers";
var urlStart = "//wsrv.nl/?url=raw.githubusercontent.com/PowerPCFan/optical-media-good/623828c3f1497e45bbda783bee1bf8f245e33ce9/img/wallpapers";
var backgrounds = [
    urlStart + "/Bliss.jpg",
    urlStart + "/Red-moon-desert.jpg",
    urlStart + "/Ascent.jpg",
    urlStart + "/Follow.jpg",
    urlStart + "/Autumn.jpg",
    urlStart + "/House.jpg"
];

var choice = backgrounds[Math.floor(Math.random() * backgrounds.length)];

addEventCompat(document, "DOMContentLoaded", function() {
    document.body.style.backgroundImage = "url(" + choice + ")";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
});