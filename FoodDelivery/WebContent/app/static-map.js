Vue.component("staticMap", {

	data() {
		return {
			map: null,
			marker: null,
			loc: null
		}
	},

	mounted() {
		let self = this;
		axios
			.get('rest/restaurant/getLocation')
			.then(response => {
				if (response.data) {
					self.loc = response.data
					const ns = { lat: self.loc.latitude, lng: self.loc.longitude };
					this.map = new google.maps.Map(document.getElementById("static"), {
						zoom: 12,
						center: ns,
						mapTypeId: "terrain",
					});
					this.marker = new google.maps.Marker({
						position: ns,
						map: this.map,
					});
					this.marker.setMap(this.map);


				}
			});

	},

	template: `
	<div id="static" style=" height: 400px; width: 700px;" >
		
	</div>
	`
});