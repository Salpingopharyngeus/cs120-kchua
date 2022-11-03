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



            const xhr = new XMLHttpRequest();
            xhr.open("POST", 'https://jordan-marsh.herokuapp.com/rides', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("username=p5fjWJty&lat=" + position.coords.latitude + "&lng=" + position.coords.longitude);

            xhr.onload = () => {

                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    const data = JSON.parse(xhr.responseText);


                    // Create markers.
                    for (let i = 0; i < data.length; i++) {
                        console.log({ lat: data[i].lat, lng: data[i].lng})
                        const marker = new google.maps.Marker({
                            position: { lat: data[i].lat, lng: data[i].lng},
                            icon: "car.png",
                            map: map,
                        });
                    }
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

window.initMap = initMap;