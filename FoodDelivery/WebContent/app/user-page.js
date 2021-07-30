const adminPage = { template: '<adminPage></adminPage>' }
const customerPage = { template: '<customerPage></customerPage>' }
const delivererPage = { template: '<delivererPage></delivererPage>' }
const managerPage = { template: '<managerPage></managerPage>' }

Vue.component("userPage", {

	data() {
		return {
			user: this.$root.$data.user,
		}
	},

	components: {
		'adminPage': adminPage,
		'customerPage': customerPage,
		'delivererPage': delivererPage,
		'managerPage': managerPage,
	},

	mounted() {
		var self = this
		$('.modal').on('show.bs.modal', async function () {
			let backdrop = await self.getBackdrop()
			backdrop[0]?.parentNode?.removeChild(backdrop[0])
		})
		this.getAllOrders()
	},

	methods: {
		getBackdrop() {
			return new Promise((resolve, reject) => {
				let backdrop = document.getElementsByClassName('modal-backdrop')
				if (backdrop) {
					resolve(backdrop)
				}
				reject('No backdrop yet')
			})

		},
		async getAllOrders(){
			const orders = await axios.get('rest/order/getAllOrders')
			this.$root.$data.orders = orders.data
		},
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