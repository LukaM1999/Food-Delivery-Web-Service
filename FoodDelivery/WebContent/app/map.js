Vue.component("olmap", {
	
	data() {
		return {
			olmap: null
		}
	},

	mounted() {
		this.olmap = new ol.Map({
        target: 'olmap',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([45.255277, 19.844444]),
          zoom: 4
        })
      });
	},

	template: `
	<div id="olmap" style=" height: 400px; width: 100%;" >
		
	</div>
	`
});