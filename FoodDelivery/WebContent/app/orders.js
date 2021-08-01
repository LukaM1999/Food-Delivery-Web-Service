Vue.component('orders', {
    data() {
        return {
            orders: [],
            user: this.$root.$data.user,
            restaurantTypes: new Map(),
            typesReady: false
        }
    },

    async mounted() {
        if (this.user.role === 'MANAGER')
            this.orders = this.orders.filter((order) => order.restaurant === this.user.restaurant.name)

        if (this.user.role === 'CUSTOMER') {
            this.orders = this.$root.$data.orders.filter((order) => order.customerName === this.user.username)
            await this.getRestaurantTypes()
            this.typesReady = true
        }

    },

    methods: {
        async getRestaurantTypes() {
            for (const order of this.$root.$data.orders) {
                const restaurant = await axios.get(`rest/restaurant/getRestaurant/${order.restaurant}`)
                this.restaurantTypes.set(order.restaurant, restaurant.data.type)
            }
        },
        async updatePoints(order){
			const pointsSubtracted = (order.price/1000) * 133 * 4
			const totalPoints = this.$root.$data.user.points - pointsSubtracted
			const updatedCustomerType = await axios.put('rest/user/updatePoints', 
			{ customerUsername: this.user.username, points: totalPoints })
			if (updatedCustomerType.data == null) return
			this.$root.$data.user.type = updatedCustomerType.data
			this.$root.$data.user.points = totalPoints
            this.$root.showAlert(`Successfully cancelled order. You lost ${pointsSubtracted} points.`)
            this.$parent.updateProgress()
		},
        updateOrderStatus(order, newStatus){
            order.status = newStatus
            if (newStatus === 'CANCELLED') this.updatePoints(order)
            axios.put('rest/order/updateStatus', { orderId: order.id, status: newStatus })
        },
    },

    template: `
    <div>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <h2>Orders</h2>
            </div>
        </div>
        <div v-if="orders.length > 0" class="row">
            <div class="col">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center">
                            <th v-if="user.role !== 'MANAGER'">Restaurant</th>
                            <th v-if="user.role !== 'MANAGER'">Restaurant type</th>
                            <th>Price (RSD)</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th v-if="user.role === 'CUSTOMER'">Cancel order</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orders">
                            <td v-if="user.role !== 'MANAGER'">{{o.restaurant}}</td>
                            <td v-if="user.role !== 'MANAGER' && typesReady">{{restaurantTypes.get(o.restaurant)}}</td>
                            <td>{{o.price}}</td>
                            <td>{{o.orderTime}}</td>
                            <td>{{o.status}}</td>
                            <td  class="text-center" v-if="user.role === 'CUSTOMER'">
                                <button v-if="o.status === 'PROCESSING'" class="btn btn-primary" @click="updateOrderStatus(o, 'CANCELLED')">
                                    Cancel order
                                </button>
                            </td>
                        </tr>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
})