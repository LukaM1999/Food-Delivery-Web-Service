const login = {
	template: '<login></login>',
	beforeRouteUpdate(to, from, next) {
		if (to.name !== 'login' && this.$root.$data.user.username !== to.params.username) next(false)
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
const orders = { template: '<orders></orders>' }


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


window.onscroll = function () {
	scroll()
}

function scroll() {
	var body = document.body,
		html = document.documentElement

	var height = Math.max(body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight, html.getBoundingClientRect().height)

	if (body.scrollTop > height * 0.2 || html.scrollTop > height * 0.2)
		$('#back-to-top').fadeIn(500)
	else
		$('#back-to-top').fadeOut(500)
}

$('.modal').on('shown.bs.modal', function () {
    $(this).find('[autofocus]').focus()
})

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
		orders: [],
		deliveryRequests: [],
		comments: [],
	},
	methods: {
		showAlert(alert) {
			this.alert = alert
			$('#alertGlobal').fadeIn(300).delay(5000).fadeOut(300)
		},
		addOrder(order) {
			this.orders.push(order)
		},
		initializeRating(){
			$('.rating').each(function () {
				$(this).rating({ showCaption: false, displayOnly: true, step: 0.1 })
			})
		},
		logOut(){
			this.user = null
			this.orders = []
			this.deliveryRequests = []
			this.comments = []
			this.cart = {
				ownerUsername: '',
				articles: []
			}
			this.$router.push('/')
		},
	}
});