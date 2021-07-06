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


const routes = [
	{
		path: '/',
		name: 'login',
		component: login,
		/* meta: { isAuthenticated: false } */
	},
	{
		path: '/:username',
		component: userPage,
		children: [
			{
				path: 'restaurant/:name',
				name: 'restaurant',
				component: restaurantPage
			}
		]
	},
	{
		path: '/restaurants/:name',
		component: restaurantPage
	}
]

const router = new VueRouter({
	mode: 'hash',
	routes
});

var app = new Vue({
	router,
	el: "#app",
	data: {
		user: null,
		loc: {},
	},
});