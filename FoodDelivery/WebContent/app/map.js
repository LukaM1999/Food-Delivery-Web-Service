Vue.component("googleMap", {

	data() {
		return {
			map: null,
			marker: null,
			loc: null,
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
						let street, streetNumber, city, zipCode;
						results[1].address_components.forEach(element => {
							switch (element.types[0]) {
								case 'street_number': {
									streetNumber = element.long_name
									break
								}
								case 'route': {
									street = element.long_name;
									break
								}
								case 'locality': {
									city = element.long_name;
									break
								}
								case 'postal_code': {
									zipCode = element.long_name;
									break
								}
							}
						});

						if (zipCode == null) zipCode = '21000';

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
			}).then(this.$parent.$data.loc = this.loc);
			//this.$emit('updateLocation', this.loc)
		});
	},

	template: `
	<div id="map" style=" height: 400px; width: 400px;" >
		
	</div>
	`
});