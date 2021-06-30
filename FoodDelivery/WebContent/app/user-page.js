const adminPage = { template: '<adminPage></adminPage>' }
const customerPage = { template: '<customerPage></customerPage>' }
const delivererPage = { template: '<delivererPage></delivererPage>' }
const managerPage = { template: '<managerPage></managerPage>' }

Vue.component("userPage", {
	
	data: function(){
		return {
			user: null,
		}
	},

	components: {
		'adminPage': adminPage,
		'customerPage': customerPage,
		'delivererPage': delivererPage,
		'managerPage': managerPage,
	},

	mounted(){
		axios
		.get('rest/user/getUser/' + this.$route.params.username)
		.then(response => {
			this.user = response.data
			this.$root.$data.user = response.data
		});
	},

	template: `
	<div>
		<div v-if="user">
			<adminPage v-if="user.role === 'ADMIN'"></adminPage>
			<customerPage v-else-if="user.role === 'CUSTOMER'"></customerPage>
			<delivererPage v-else-if="user.role === 'DELIVERER'"></delivererPage>
			<managerPage v-else></managerPage>
		</div>
	</div>
	`
});