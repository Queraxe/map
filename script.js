window.onload = function () {
	main();
};

function main() {
	if (navigator.geolocation) {
		console.log("Geolocation is supported by this browser.");
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}

	function showPosition(position) {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;


        setCookies(longitude, latitude);

		console.log(`Coordinaten: ${latitude}, ${longitude}`);

		// Create a map centered at the user's location
		const map = L.map("map").setView([latitude, longitude], 15);

		// Add OpenStreetMap tiles
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		// Add a marker at the user's location
		L.circleMarker([latitude, longitude], {
			radius: 10,
			color: "blue",
			fillColor: "blue",
			fillOpacity: 0.5,
		})
			.addTo(map)
			.bindPopup("location");

		// Fetch and display benches from OpenStreetMap using Overpass API
		updateBenches(map);

		// Update benches when the map is moved or zoomed
		map.on("moveend", function () {
			updateBenches(map);
		});

		map.on("zoomend", function () {
			updateBenches(map);
		});
	}

	function updateBenches(map) {
		const center = map.getCenter();
		// Die aktuellen Karten-Grenzen abrufen
		let bounds = map.getBounds();

		// Die westlichste (links) und östlichste (rechts) Koordinate
		let west = bounds.getWest();
		let east = bounds.getEast();
		let north = bounds.getNorth();
		let south = bounds.getSouth();

		// Die Entfernung in Metern berechnen (Haversine-Formel / Leaflet-Funktion)
		let distanceW = L.latLng(0, west).distanceTo(L.latLng(0, east));
		let distanceH = L.latLng(north, 0).distanceTo(L.latLng(south, 0));

		// Die größere Entfernung als Zoom verwenden
		let zoom = Math.max(distanceW, distanceH);
		zoom = Math.min(zoom, 10000);

		fetchBenches(map, center.lat, center.lng, zoom);
	}

	function showError(error) {
		switch (error.code) {
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

	function fetchBenches(map, lat, lon, zoom) {
		let amenity = "bench";
		const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=${amenity}](around:${zoom},${lat},${lon});out;`;

		fetch(overpassUrl)
			.then((response) => response.json())
			.then((data) => {
				// Clear existing markers
				map.eachLayer(function (layer) {
					if (
						layer instanceof L.CircleMarker &&
						!layer._popup._content.includes("location")
					) {
						map.removeLayer(layer);
					}
				});

				// Add new markers
				data.elements.forEach((element) => {
					L.circleMarker([element.lat, element.lon], {
						color: "black",
						radius: 6,
					})
						.addTo(map)
						.bindPopup(JSON.stringify(element.tags));
				});
			})
			.catch((error) => console.log("Error fetching benches:", error));
	}
}
