const login = {
	template: '<login></login>',
	beforeRouteUpdate(to, from, next) {
		if (to.name !== 'login' && this.$root.$data.user.username !== to.params.username) next(false);
		next();

	},
}
const registration = { template: '<registration></registration>' }
const userPage = { template: '<userPage></userPage>' }
const mainPage = { template: '<mainPage></mainPage>' }
const restaurantPage = { template: '<restaurantPage></restaurantPage>' }
const restaurants = { template: '<restaurants></restaurants>' }
const users = { template: '<users></users>' }
const userProfile = { template: '<userProfile></userProfile>' }


const routes = [
	{
		path: '/',
		name: 'login',
		component: login,
	},
	{
		path: '/:username',
		component: userPage,
		props: true,
	}
]

const router = new VueRouter({
	mode: 'hash',
	routes
});

var app = new Vue({
	router,
	el: '#app',
	data: {
		user: null,
		alert: '',
		cart: {
			ownerUsername: '',
			articles: []
		},
		orders: []
	},
	methods: {
		showAlert(alert) {
			this.alert = alert
			$('#alertGlobal').fadeIn(300).delay(5000).fadeOut(300)
		},
		addOrder(order){
			this.orders.push(order)
		},
	}
});