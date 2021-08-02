Vue.component('orders', {
    data() {
        return {
            orders: [],
            user: this.$root.$data.user,
            restaurantTypes: new Map(),
            typesReady: false,
            undeliveredOrders: false,
            showDelivererOrders: false,
            requestsSent: new Map(),
            requestKey: 1000,
        }
    },

    props: {
        delivererProfile: false
    },

    async mounted() {
        if (this.user.role === 'MANAGER')
            this.orders = this.$root.$data.orders.filter((order) => order.restaurant === this.user.restaurant.name)

        if (this.user.role === 'CUSTOMER') {
            this.orders = this.$root.$data.orders.filter((order) => order.customerName === this.user.username)
            await this.getRestaurantTypes()
        }

        if (this.user.role === 'DELIVERER') {
            await this.getRestaurantTypes()
            this.showDelivererOrders = this.delivererProfile
            if (this.delivererProfile)
                this.orders = this.$root.$data.orders.filter((order) => order.delivererUsername === this.user.username)
            else {
                for (const order of this.$root.$data.orders) {
                    if (this.$root.$data.requests.some(request => 
                        request.delivererUsername === this.user.username && request.orderId === order.id))
                        this.requestsSent.set(order.id, true)
                    else this.requestsSent.set(order.id, false)
                }
                this.orders = this.$root.$data.orders.filter((order) => order.status === 'AWAITING_PICKUP')
            }

        }

    },

    methods: {
        async getRestaurantTypes() {
            for (const order of this.$root.$data.orders) {
                const restaurant = await axios.get(`rest/restaurant/getRestaurant/${order.restaurant}`)
                this.restaurantTypes.set(order.restaurant, restaurant.data.type)
            }
            this.typesReady = true
        },
        async updatePoints(order) {
            const pointsSubtracted = (order.price / 1000) * 133 * 4
            const totalPoints = this.$root.$data.user.points - pointsSubtracted
            const updatedCustomerType = await axios.put('rest/user/updatePoints',
                { customerUsername: this.user.username, points: totalPoints })
            if (updatedCustomerType.data == null) return
            this.$root.$data.user.type = updatedCustomerType.data
            this.$root.$data.user.points = totalPoints
            this.$root.showAlert(`Successfully cancelled order. You lost ${pointsSubtracted} points.`)
            this.$parent.updateProgress()
        },
        updateOrderStatus(order, newStatus) {
            order.status = newStatus
            if (newStatus === 'CANCELLED') this.updatePoints(order)
            axios.put('rest/order/updateStatus', { orderId: order.id, status: newStatus })
        },
        async sendRequest(o) {
            this.requestsSent.set(o.id, true)
            const request = {
                orderId: o.id,
                requestTime: new Date().format('mm.dd.yyyy. HH:MM:ss'),
                orderPrice: o.price,
                delivererUsername: this.user.username,
                restaurant: o.restaurant,
                status: 'Sent'
            }
            this.$root.$data.requests.push(request)
            this.requestKey += 1
            await axios.post('rest/request/addRequest', request)
        },
        isRequestSent(order) {
            return this.$root.$data.requests.some(request => 
                request.delivererUsername === this.user.username && request.orderId === order.id)
        },
        getRequestStatus(order) {
            const request = this.$root.$data.requests.find(r => r.orderId === order.id && r.delivererUsername === this.user.username)
            //const request = await axios.get(`rest/request/getRequest/${order.id}&&${this.user.username}`)
            return request?.status
        }
    },

    template: `
    <div style="padding-top: 70px;">
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
                            <th v-if="user.role !== 'DELIVERER' || showDelivererOrders">Change order status</th>
                            <th v-if="user.role === 'DELIVERER' && !showDelivererOrders">Request delivery</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orders">
                            <td v-if="user.role !== 'MANAGER'">{{o.restaurant}}</td>
                            <td v-if="user.role !== 'MANAGER' && typesReady">{{restaurantTypes.get(o.restaurant)}}</td>
                            <td>{{o.price}}</td>
                            <td>{{o.orderTime}}</td>
                            <td>{{o.status}}</td>
                            <td class="text-center" v-if="user.role === 'CUSTOMER'">
                                <button v-if="o.status === 'PROCESSING'" class="btn btn-primary" @click="updateOrderStatus(o, 'CANCELLED')">
                                    Cancel order
                                </button>
                            </td>
                            <td class="text-center" v-if="user.role === 'MANAGER'">
                                <button v-if="o.status === 'PROCESSING'" class="btn btn-primary" @click="updateOrderStatus(o, 'PREPARING')">
                                    Started preparing
                                </button>
                                <button v-if="o.status === 'PREPARING'" class="btn btn-primary" @click="updateOrderStatus(o, 'AWAITING_PICKUP')">
                                    Ready for pickup
                                </button>
                            </td>
                            <td class="text-center" v-if="user.role === 'DELIVERER'" :key="requestKey">
                                <button v-if="!isRequestSent(o)" class="btn btn-primary" 
                                @click="sendRequest(o)">
                                    Request delivery
                                </button>
                                <p v-if="getRequestStatus(o) === 'Sent'">Request sent</p>
                                <p v-if="getRequestStatus(o) === 'Declined'">Request declined</p>
                                <button v-if="o.status === 'DELIVERING'" class="btn btn-primary" @click="updateOrderStatus(o, 'DELIVERED')">
                                    Delivered
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