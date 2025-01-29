window.onload = function() {
    main();
};

function main(){
    if (navigator.geolocation) {
        console.log("Geolocation is supported by this browser.");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        // Create a map centered at the user's location
        const map = L.map('map').setView([latitude, longitude], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a marker at the user's location
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup('You are here.')
            .openPopup();

        // Fetch and display benches from OpenStreetMap using Overpass API
        fetchBenches(map, latitude, longitude);

        // Update benches when the map is moved or zoomed
        map.on('moveend', function() {
            const center = map.getCenter();
            fetchBenches(map, center.lat, center.lng);
        });

        map.on('zoomend', function() {
            const center = map.getCenter();
            fetchBenches(map, center.lat, center.lng);
        });
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
    }

    function fetchBenches(map, lat, lon) {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=bench](around:1000,${lat},${lon});out;`;

        fetch(overpassUrl)
            .then(response => response.json())
            .then(data => {
                // Clear existing markers
                map.eachLayer(function(layer) {
                    if (layer instanceof L.Marker && !layer._popup._content.includes('You are here.')) {
                        map.removeLayer(layer);
                    }
                });

                // Add new markers
                data.elements.forEach(element => {
                    L.marker([element.lat, element.lon]).addTo(map)
                        .bindPopup('Bench');
                });
            })
            .catch(error => console.log('Error fetching benches:', error));
    }
}