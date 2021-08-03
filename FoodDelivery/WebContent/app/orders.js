const commentForm = { template: '<commentForm></commentForm>' }

Vue.component('orders', {
    data() {
        return {
            orders: [],
            user: this.$root.$data.user,
            restaurantTypes: new Map(),
            typesReady: false,
            undeliveredOrders: false,
            showDelivererOrders: false,
            requestKey: 1000,
            nameSearch: '',
            typeSearch: '',
            statusFilter: '',
            priceRangeMin: 0,
            priceRangeMax: 0,
            dateRangeMin: '',
            dateRangeMax: '',
            sortBy: '',
            ascending: true,
            commentKey: 10000
        }
    },

    props: {
        insideProfile: {
            type: Boolean,
            default: false
        }
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
            console.log(this.insideProfile)
            if (this.insideProfile)
                this.orders = this.$root.$data.orders.filter((order) => order.delivererUsername === this.user.username)
            else
                this.orders = this.$root.$data.orders.filter((order) => order.status === 'AWAITING_PICKUP')
        }
        this.priceRangeMin = this.getMinPrice()
        this.priceRangeMax = this.getMaxPrice()

        this.instantiateDatepickers()

        this.setMinMaxDates()

    },

    methods: {
        async getRestaurantTypes() {
            for (const order of this.$root.$data.orders) {
                const restaurant = await axios.get(`rest/restaurant/getRestaurant/${order.restaurant}`)
                this.restaurantTypes.set(order.restaurant, restaurant.data.type)
            }
            this.typesReady = true
        },
        instantiateDatepickers() {
            var self = this
            $('.input-daterange input').each(function () {
                $(this).datepicker({ format: 'dd.mm.yyyy.' })
            })
            $('#minDate').on('change', function () {
                self.dateRangeMin = $('#minDate').val()
            })
            $('#maxDate').on('change', function () {
                self.dateRangeMax = $('#maxDate').val()
            })
        },
        async updatePoints(order) {
            const pointsSubtracted = (order.price / 1000) * 133 * 4
            let totalPoints = this.$root.$data.user.points - pointsSubtracted
            const updatedCustomerType = await axios.put('rest/user/updatePoints',
                { customerUsername: this.user.username, points: totalPoints })
            if (updatedCustomerType.data == null) return
            this.$root.$data.user.type = updatedCustomerType.data
            if (totalPoints < 0) totalPoints = 0
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
            return request?.status
        },
        getMinPrice() {
            return Math.min(...this.orders.map(o => o.price))
        },
        getMaxPrice() {
            return Math.max(...this.orders.map(o => o.price))
        },
        setMinMaxDates() {
            const dates = this.orders.map(o => moment(o.orderTime, 'DD.MM.YYYY. HH:mm:ss'))
            this.dateRangeMin = moment.min(dates).format('DD.MM.YYYY.')
            $('#minDate').data('datepicker').setStartDate(this.dateRangeMin)
            $('#minDate').data('datepicker').setDate(this.dateRangeMin)
            this.dateRangeMax = moment.max(dates).format('DD.MM.YYYY.')
            $('#maxDate').data('datepicker').setEndDate(this.dateRangeMax)
            $('#maxDate').data('datepicker').setDate(this.dateRangeMax)
        },
        setSortOrder() {
            this.ascending = !this.ascending
        },
        commentExists(orderId) {
            return this.$root.$data.comments.filter(c => c.orderId === orderId).length > 0
        }
    },

    computed: {
        filteredOrders() {
            let tempOrders = this.orders

            if (this.nameSearch != '') {
                tempOrders = tempOrders.filter(o => {
                    return o.restaurant.toLowerCase().includes(this.nameSearch.toLowerCase())
                })
            }

            if (this.typeSearch != '') {
                tempOrders = tempOrders.filter(o => {
                    return this.restaurantTypes.get(o.restaurant).toLowerCase().includes(this.typeSearch.toLowerCase())
                })
            }

            if (this.statusFilter != '' && this.statusFilter !== 'Not delivered') {
                tempOrders = tempOrders.filter(o => {
                    return o.status.toLowerCase().includes(this.statusFilter.toLowerCase())
                })
            }

            if (this.statusFilter === 'Not delivered') {
                tempOrders = tempOrders.filter(o => {
                    return !o.status.toLowerCase().includes('delivered')
                })
            }

            if (this.priceRangeMin <= this.priceRangeMax) {
                tempOrders = tempOrders.filter(o => {
                    return o.price >= this.priceRangeMin && o.price <= this.priceRangeMax
                })
            }

            if (moment(this.dateRangeMin, 'DD.MM.YYYY.').isValid() && moment(this.dateRangeMax, 'DD.MM.YYYY.').isValid())
                if (moment(this.dateRangeMin, 'DD.MM.YYYY.') <= moment(this.dateRangeMax, 'DD.MM.YYYY.')) {
                    tempOrders = tempOrders.filter(o => {
                        return moment(o.orderTime, 'DD.MM.YYYY. HH:mm:ss') >= moment(this.dateRangeMin, 'DD.MM.YYYY.')
                            && moment(o.orderTime, 'DD.MM.YYYY.') <= moment(this.dateRangeMax, 'DD.MM.YYYY.')
                    })
                }

            tempOrders = tempOrders.sort((a, b) => {
                if (this.sortBy == 'Restaurant name') {
                    let result = 0
                    if (a.restaurant < b.restaurant) result = -1
                    if (a.restaurant > b.restaurant) result = 1
                    if (this.ascending) return result
                    return result * -1
                }
                else if (this.sortBy == 'Price') {
                    return this.ascending ? a.price - b.price : b.price - a.price
                }
                else if (this.sortBy == 'Date') {
                    let result = moment(a.orderTime, 'DD.MM.YYYY. HH:mm:ss') - moment(b.orderTime, 'DD.MM.YYYY. HH:mm:ss')
                    return this.ascending ? result : result * -1
                }
            })

            return tempOrders
        }
    },

    filters: {
        formatStatus: function (value) {
            return value.substring(0, 1) + value.substring(1).toLowerCase().replace('_', ' ')
        }
    },

    template: `
    <div :style="[insideProfile ? {} : {'paddingTop': '70px'}]">
        <div class="row mb-3">
            <div class="col d-flex justify-content-center">
                <h2>Orders</h2>
            </div>
        </div>
        <div class="row mb-3 justify-content-center">
            <div class="col-md-2" v-if="user.role !== 'MANAGER'">
                <div class="form-floating">
                    <input type="text" class="form-control" id="restaurantName" v-model="nameSearch">
                    <label for="restaurantName">Restaurant name</label>
                </div>
            </div>
            <div class="col-md-2" v-if="user.role !== 'MANAGER'">
                <div class="form-floating">
                    <input list="types" id="restaurantType" class="form-control" v-model="typeSearch">
                    <datalist id="types" v-for="type in Array.from(restaurantTypes.values())">
                        <option v-for="type in Array.from(restaurantTypes.values())" :value="type">{{type}}</option>
                    </datalist>
                    <label for="restaurantType">Restaurant type</label>
                </div>
            </div>
            <div class="col-md-1">
                <div class="form-floating">
                    <input type="number" class="form-control" id="priceRangeMin" v-model.number="priceRangeMin"
                    :min="getMinPrice()" :max="getMaxPrice()">
                    <label for="priceRangeMin">Min price</label>
                </div>
            </div>
            <div class="col-md-1">
                <div class="form-floating">
                    <input type="number" class="form-control" id="priceRangeMax" v-model.number="priceRangeMax"
                    :min="getMinPrice()" :max="getMaxPrice()">
                    <label for="priceRangeMax">Max price</label>
                </div>
            </div>
            <div class="col-md-4">
                <div class="input-group input-daterange justify-content-center">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="minDate" v-model="dateRangeMin">
                        <label for="minDate">Min date</label>
                    </div>
                    <span class="input-group-text">to</span>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="maxDate" v-model="dateRangeMax">
                        <label for="maxDate">Max date</label>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-floating">
                    <select v-model="statusFilter" class="form-select" id="statusFilter">
                        <option value="">None</option>
                        <option value="Not delivered" v-if="user.role !== 'MANAGER' && insideProfile">Not delivered</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="PREPARING">Preparing</option>									
                        <option value="AWAITING_PICKUP">Awaiting pickup</option>									
                        <option value="DELIVERING">Delivering</option>									
                        <option value="DELIVERED">Delivered</option>									
                    </select>
                    <label for="statusFilter">Status</label>
                </div>
            </div>
        </div>
        <div class="row mb-5 justify-content-center">
            <div class="col-md-2">
                <div class="form-floating">
                    <select v-model="sortBy" class="form-select" id="orderSort">
                        <option value="">None</option>
                        <option value="Restaurant name" v-if="user.role !== 'MANAGER'">Restaurant name</option>
                        <option value="Price">Price</option>
                        <option value="Date">Date</option>									
                    </select>
                    <label for="orderSort">Sort by</label>
                </div>
            </div>
            <div class="col-md-1 align-self-center d-flex justify-content-center">
                <button class="btn btn-primary" @click="setSortOrder">
                    <i :class="[ascending ? 'fa fa-sort-up' : 'fa fa-sort-down']"></i>
                </button>
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
                            <th v-if="user.role !== 'DELIVERER' || insideProfile">Change order status</th>
                            <th v-if="user.role === 'DELIVERER' && !insideProfile">Request delivery</th>
                            <th v-if="user.role === 'CUSTOMER'">Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in filteredOrders">
                            <td v-if="user.role !== 'MANAGER'">{{o.restaurant}}</td>
                            <td v-if="user.role !== 'MANAGER' && typesReady">{{restaurantTypes.get(o.restaurant)}}</td>
                            <td>{{o.price}}</td>
                            <td>{{o.orderTime}}</td>
                            <td>{{o.status | formatStatus}}</td>
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
                            <td class="text-center" v-if="user.role === 'DELIVERER' && !insideProfile" :key="requestKey">
                                <button v-if="!isRequestSent(o)" class="btn btn-primary" 
                                @click="sendRequest(o)">
                                    Request delivery
                                </button>
                                <p v-if="getRequestStatus(o) === 'Sent'">Request sent</p>
                                <p v-if="getRequestStatus(o) === 'Declined'">Request declined</p>
                            </td>
                            <td class="text-center" v-if="user.role === 'DELIVERER' && insideProfile">
                                <button v-if="o.delivererUsername === user.username && o.status === 'DELIVERING'" class="btn btn-primary" 
                                @click="updateOrderStatus(o, 'DELIVERED')">
                                    Delivered
                                </button>
                            </td>
                            <td class="text-center" v-if="user.role === 'CUSTOMER'" >
                                <commentForm v-if="o.status === 'DELIVERED' && !commentExists(o.id)" :order-prop="o"></commentForm>
                                <p v-if="commentExists(o.id)">Already commented</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
})