Vue.component("adminPage", {
	
	data: function(){
		return {
			admin: this.$root.$data.user,
			alert: '',
		}
	},

	methods: {
	},

	template: `
	<div>
		<h1 v-if="admin">{{admin.username}}</h1>
	</div>
	`
});