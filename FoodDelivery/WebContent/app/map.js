Vue.component("googleMap", {

	data() {
		return {
			map: null,
			marker: null,
			loc: {},

		}
	},

	mounted() {
		const ns = { lat: 45.255277, lng: 19.844444 };
		this.map = new google.maps.Map(document.getElementById("map"), {
			zoom: 12,
			center: ns,
			mapTypeId: "terrain",
		});
		this.map.addListener("click", (event) => {
			if (this.marker) {
				let oldMarker = this.marker;
				oldMarker.setMap(null);
			}
			this.marker = new google.maps.Marker({
				position: event.latLng,
				map: this.map,
			});
			this.marker.setMap(this.map);
			var latlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						alert("Location: " + results[1].formatted_address + "\r\nLatitude: " + event.latLng.lat() + "\r\nLongitude: " + event.latLng.lng());
						let commaSplit = results[1].formatted_address.split(',');

						let street = commaSplit[0].replace(/[0-9]/g, '');
						let streetSplit = commaSplit[0].split(' ');
						let streetNumber = streetSplit[streetSplit.length - 1];

						let citySplit = commaSplit[1].split(' ');
						let zipCode = citySplit[citySplit.length - 1];
						let city = commaSplit[1].replace(/[0-9]/g, '');

						var location = {
							'longitude': event.latLng.lng(),
							'latitude': event.latLng.lat(),
							'address': {
								'street': street.trim(),
								'streetNumber': parseInt(streetNumber),
								'city': city.trim(),
								'zipCode': parseInt(zipCode)
							}
						}
						this.loc = location;
					}
				}
			});
		});
	},

	template: `
	<div id="map" style=" height: 400px; width: 100%;" >
		
	</div>
	`
});