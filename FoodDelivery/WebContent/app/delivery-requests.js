Vue.component('deliveryRequests', {

    data() {
        return {
            requests: this.$root.$data.requests,
            manager: this.$root.$data.user,
        }
    },

    mounted() {
        this.requests = this.$root.$data.requests
            .filter(request => request.restaurant === this.manager.restaurant.name && request.status !== 'Declined')
    },

    methods: {
        acceptRequest(request) {
            const order = this.$root.$data.orders.find(order => order.id === request.orderId)
            order.delivererUsername = request.delivererUsername
            order.status = 'DELIVERING'
            this.requests = this.requests.filter(request => request.orderId !== order.id)
            axios.put('rest/order/updateDelivery', { orderId: order.id, delivererUsername: request.delivererUsername })
            axios.put('rest/request/updateRequests', this.requests)
            this.$root.showAlert('Successfully accepted delivery request!' +
                ' All requests for the selected order have been removed.')
        },
        declineRequest(request) {
            axios.put('rest/request/updateStatus', request)
            this.requests = this.requests
                .filter(r => r.orderId !== request.orderId || r.delivererUsername !== request.delivererUsername)
        },

    },

    template: `
    <div>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <h2>Delivery requests</h2>
            </div>
        </div>
        <div v-if="requests.length > 0" class="row">
            <div class="col">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center">
                            <th>Order ID</th>
                            <th>Request time</th>
                            <th>Price</th>
                            <th>Deliverer</th>
                            <th>Accept or decline</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in requests">
                            <td>{{r.orderId}}</td>
                            <td>{{r.requestTime}}</td>
                            <td>{{r.orderPrice}}</td>
                            <td>{{r.delivererUsername}}</td>
                            <td class="text-center">
                                <button class="btn btn-warning" style="margin-right: 5%;" @click="acceptRequest(r)">
                                    Accept
                                </button>
                                <button class="btn btn-danger" @click="declineRequest(r)">
                                    Decline
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