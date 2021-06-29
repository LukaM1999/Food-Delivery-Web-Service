Vue.component("userPage", {
	
	data: function(){
		return {
			username: this.$route.params.username,

			alert: '',
		}
	},

	methods: {
	},

	template: `
	<div><h1>PROSAO</h1></div>
	`
});