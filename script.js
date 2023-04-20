var button = document.getElementById("button");
var routeContainer = document.querySelector(".route-container");
var routeContainers = document.querySelectorAll(".route-container");

// Function for selecting a route
console.log("wowaaas");
button.onclick = function showRelatedRoutes() {
    console.log("wowooos");
    if (routeContainer.style.display === "none") {
        for (var i = 0; i < routeContainers.length; i++) {
            routeContainers[i].style.display = "flex";
        }
    }
}

// add a click event listener to the route-container element
routeContainer.addEventListener('click', () => {
    fetch('https://cmd.camp/iot/send/DjfWydrH/1');
    window.location.href = 'map.html'; // navigate to the desired page
});