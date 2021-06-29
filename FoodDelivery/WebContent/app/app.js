const login = {
	template: '<login></login>',
	beforeRouteLeave(to, from, next) {
		alert(to.name + " " + from.meta.isAuthenticated);
		if (to.name !== 'login' && !from.meta.isAuthenticated) next(false);
		else next();
	},
}
const registration = { template: '<registration></registration>' }
const userPage = { template: '<userPage></userPage>' }

const routes = [
	{
		path: '/',
		name: 'login',
		component: login,
		meta: { isAuthenticated: false }
	},
	{ path: '/:username', component: userPage }
]

const router = new VueRouter({
	mode: 'hash',
	routes
});

var app = new Vue({
	router,
	el: "#app",
});