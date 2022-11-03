let map, infoWindow;

// Initialize and add the map
function initMap() {
    const southstation = { lat: 42.352271, lng: -71.05524200000001 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: southstation,
        zoom: 14,
    });

    infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
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



    const icons = {
        car: {
            icon: "car.png",
        }
    };
    const features = [
        {
            position: new google.maps.LatLng(42.3453, - 71.0464),
            type: "car",
        },

    ];
    // Create markers.
    for (let i = 0; i < features.length; i++) {
        const marker = new google.maps.Marker({
            position: features[i].position,
            icon: icons[features[i].type].icon,
            map: map,
        });
    }
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

            XMLHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            const cars = XMLHttpRequest.send(
                "username=p5fjWJty&lat=" + position.coords.latitude + "&lng" + position.coords.longitude);
            console.log(cars);
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

window.initMap = initMap;