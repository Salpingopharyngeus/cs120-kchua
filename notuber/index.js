let map, infoWindow;

// Initialize and add the map
function initMap() {
    const southstation = { lat: 42.352271, lng: -71.05524200000001 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: southstation,
        zoom: 4,
    });

    infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(pos);
        },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    var markers = [];

    // Adds current location marker
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            const curLocation = new google.maps.Marker({
                position: pos,
                map: map,
            })
            markers.push(pos);



            const xhr = new XMLHttpRequest();
            xhr.open("POST", 'https://jordan-marsh.herokuapp.com/rides', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("username=p5fjWJty&lat=" + position.coords.latitude + "&lng=" + position.coords.longitude);

            xhr.onload = () => {

                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    const data = JSON.parse(xhr.responseText);


                    // Create markers.
                    for (let i = 0; i < data.length; i++) {
                        const marker = new google.maps.Marker({
                            position: { lat: data[i].lat, lng: data[i].lng },
                            icon: "car.png",
                            map: map,
                        });
                        markers.push({ lat: data[i].lat, lng: data[i].lng });
                    }

                    const closestCar = findClosestCar(markers);

                    curLocation.addListener("click", ({ domEvent, latLng }) => {
                        const { target } = domEvent;

                        infoWindow.close();
                        infoWindow.setContent("Nearest vehicle is located at lat:" + closestCar.position.lat + " lng: " + closestCar.position.lng + " and is " + closestCar.distance* 0.0006213712 + " miles away");
                        infoWindow.open(curLocation.map, curLocation);
                    }
                    
                    );

                }

            }

        },
    );
};

// Error Handling
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}


// Computes the distance of each of the markers, and returns the position of the nearest car.
function findClosestCar(markers) {
    // current location is at the 0 index.
    var closestCar = null;
    for (var j = 1; j < markers.length; j++) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(markers[0].lat, markers[0].lng), new google.maps.LatLng(markers[j].lat, markers[j].lng));
        if (closestCar == null || closestCar.distance > distance) {
            closestCar = { position: markers[j], distance: distance }
        }

    }
    return closestCar;
}

window.initMap = initMap;