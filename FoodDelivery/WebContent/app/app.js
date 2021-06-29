const login = { template: '<login></login>' }
const registration = { template: '<registration></registration>' }

var app = new Vue({
	el: "#app",
	components: {
		'login': login,
		'registration': registration,
	}
});