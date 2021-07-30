Vue.component('shoppingCart', {

	data: function () {
		return {
			cart: this.$root.$data.cart,
			totalPrice: 0
		}
	},

	mounted() {

	},

	watch: {
		'$root.$data.cart': function (newValue, oldValue) {
			if (typeof (newValue) === 'undefined') return
			this.cart = newValue
			this.setTotalPrice()
		}
	},

	methods: {
		incrementAmount(a) {
			a.amount += 1
			this.cart = {
				ownerUsername: this.$root.$data.user.username,
				articles: this.cart.articles
			}
			this.setTotalPrice()
		},
		decrementAmount(a) {
			if (a.amount > 0) {
				a.amount -= 1
				this.cart = {
					ownerUsername: this.$root.$data.user.username,
					articles: this.cart.articles
				}
				this.setTotalPrice()
			}
		},
		setTotalPrice() {
			const priceWithoutDiscount = this.cart.articles.reduce((total, article) => {
				return total + article.price * article.amount
			}, 0)
			this.totalPrice = priceWithoutDiscount - priceWithoutDiscount * this.$root.$data.user.type.discount
		},
		async confirmOrder() {
			const articles = this.cart.articles.flatMap((article) => article.amount > 0 ? article.name : [])
			const order = {
				id: uuidv4(),
				orderedArticles: articles,
				restaurant: this.cart.articles[0].restaurant,
				orderTime: new Date().format("dd.mm.yyyy. HH:MM:ss"),
				price: this.totalPrice,
				customerName: this.cart.ownerUsername,
				status: 'PROCESSING'
			}
			const orderResponse = await axios.post('rest/order/addOrder', order)
			if (orderResponse.data) {
				this.$root.addOrder(order)
				this.$emit('order-added')
				this.$root.showAlert(`Succesfully ordered from ${order.restaurant}!`)
				this.cart = {
					ownerUsername: this.$root.$data.user.username,
					articles: []
				}
				this.setTotalPrice()
				return
			}
			this.$root.showAlert(`An order with the same ID already exists, try ordering again.`)
		}
	},

	template: `
	<div>
		<button class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
			<i class="fa fa-shopping-cart fa-5x"></i>
		</button>
		<div class="offcanvas offcanvas-end my-canvas" tabindex="-1" id="offcanvasRight" data-bs-scroll="true"  style="width: 50%;" aria-labelledby="offcanvasRightLabel">
			<div class="offcanvas-header">
				<h5 id="offcanvasRightLabel">Shopping cart</h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			</div>
			<div class="offcanvas-body" style="margin-right: -15px; padding-bottom: 16%">
				<div class="row align-items-center" v-for="a in cart?.articles" v-if="a.amount > 0">
					<div class="col-md-5">
						<div class="row justify-content-center">
							<div class="col-md-2 d-flex justify-content-center">
								<button class="btn btn-primary btn-sm" @click="decrementAmount(a)">
									<span class="fa fa-minus"></span>
								</button>
							</div>
							<div class="col-md-4 d-flex justify-content-center">
								<input type="number" min="0" class="article-amount my-number" :value="a.amount"/>
							</div>
							<div class="col-md-2 d-flex justify-content-center">
								<button class="btn btn-primary btn-sm" @click="incrementAmount(a)">
									<span class="fa fa-plus"></span>
								</button>
							</div>
						</div>
					</div>
					<div class="col-md-7">
						<div class="card mb-3" style="max-width: 540px; height: 200px;">
							<div class="row g-0 h-100">
								<div class="col-md-8 align-self-center">
									<div class="card-body">
										<h5 class="card-title">{{a.name}}</h5>
										<p class="card-text">Amount: {{a.amount}}</p>
										<p class="card-text">Price: {{a.amount * a.price}}</p>
									</div>
								</div>
								<div class="col-md-4 h-100">
									<img :src="'data:image/png;base64,' + a.image" class="w-100 h-100" alt="Image">
								</div>
							</div>
						</div>
					</div>
				</div>	
			</div>
			<div class="offcanvas-footer">
				<div class="fixed-bottom row align-items-center my-canvas-footer">
					<div class="col">
						<div class="row">
							<div class="col-md-4">
								<h5 class="align-middle" style="display: inline;">
								Total price: {{totalPrice}} RSD
								</h5>
							</div>
							<div class="col-md-4 d-flex justify-content-center align-items-center">
								<button class="btn btn-secondary btn-lg" :disabled="totalPrice === 0" @click="confirmOrder">Confirm order</button>
							</div>
						</div>
						<div class="row" v-if="$root.$data.user.type.discount > 0">
							<div class="col">
								<h5>Discount: {{$root.$data.user.type.discount * 100}}%</h5>
							</div>
						</div>
					</div>
				</div>
			</div>	
		</div>
	</div>
	`
});