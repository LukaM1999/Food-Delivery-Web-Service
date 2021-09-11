Vue.component("users", {

	data: function () {
		return {
			admin: this.$root.$data.user,
			alert: '',
			customers: this.$parent.$data.customers,
			deliverers: this.$parent.deliverers,
			managers: this.$parent.managers,
			admins: this.$parent.admins,
			tableKey: 0,
			searchFilters: '',
			sortBy: '',
			ascending: true,
			roles: ['Admin', 'Manager', 'Customer', 'Deliverer'],
			roleFilters: [false, false, false, false],
			types: ['Bronze', 'Silver', 'Gold'],
			typeFilters: [false, false, false],
		}
	},


	mounted() {
		axios
			.get('rest/user/getAllCustomers')
			.then(response => {
				this.customers = response.data
			});
		axios
			.get('rest/user/getAllDeliverers')
			.then(response => {
				this.deliverers = response.data
			});
		axios
			.get('rest/user/getAllManagers')
			.then(response => {
				this.managers = response.data
			});
		axios
			.get('rest/user/getAllAdmins')
			.then(response => {
				this.admins = response.data
			});
		this.initializeFilterDropdown()
	},

	computed: {
		filteredUsers() {
			let tempAdmins = this.admins
			let tempDeliverers = this.deliverers
			let tempManagers = this.managers
			let tempCustomers = this.customers

			this.transformUsers(tempAdmins)
			this.transformUsers(tempDeliverers)
			this.transformUsers(tempManagers)

			let users = []
			Array.prototype.push.apply(users, tempAdmins)
			Array.prototype.push.apply(users, tempDeliverers)
			Array.prototype.push.apply(users, tempManagers)
			Array.prototype.push.apply(users, tempCustomers)


			let filteredUsers = []
			if (this.roleFilters.filter(role => role === true).length > 0) {
				const roles = this.roles.filter((role, index) => this.roleFilters[index] === true)
				for (let i = 0; i < roles.length; i++) {
					filteredUsers.push(...users.filter((u) => {
						return u.role.toLowerCase().includes(roles[i].toLowerCase())
					}))
				}
				users = filteredUsers
			}

			filteredUsers = []
			if (this.typeFilters.filter(type => type === true).length > 0) {
				const types = this.types.filter((type, index) => this.typeFilters[index] === true)
				for (let i = 0; i < types.length; i++) {
					filteredUsers.push(...users.filter((u) => {
						return u.type.typeName.toLowerCase().includes(types[i].toLowerCase())
					}))
				}
				users = filteredUsers
			}

			if (this.searchFilters != '') {
				users = users.filter((u) => {
					return u.name.toLowerCase().includes(this.searchFilters.toLowerCase())
						|| u.surname.toLowerCase().includes(this.searchFilters.toLowerCase())
						|| u.username.toLowerCase().includes(this.searchFilters.toLowerCase())
				})
			}

			users = users.sort((a, b) => {
				if (this.sortBy == 'Name') {
					var result = 0
					if (a.name < b.name) result = -1
					if (a.name > b.name) result = 1
					if (this.ascending) return result
					return result * -1
				}
				else if (this.sortBy == 'Surname') {
					var result = 0
					if (a.surname < b.surname) result = -1
					if (a.surname > b.surname) result = 1
					if (this.ascending) return result
					return result * -1
				}
				else if (this.sortBy == 'Username') {
					var result = 0
					if (a.username < b.username) result = -1
					if (a.username > b.username) result = 1
					if (this.ascending) return result
					return result * -1
				}
				else if (this.sortBy == 'Points received') {
					if (this.ascending) return a - b
					return b - a
				}
			})

			return users
		},

	},

	methods: {
		addManager(manager) {
			this.managers.push(manager)
		},
		addDeliverer(deliverer) {
			this.deliverers.push(deliverer)
		},
		setSortOrder() {
			this.ascending = !this.ascending
		},
		transformUsers(list) {
			list.forEach(element => {
				element.points = 0
				element.type = {
					typeName: '',
					discount: 0,
					pointsRequired: 0
				}
			})
		},
		initializeFilterDropdown() {
			$(".checkbox-menu").on("change", "input[type='checkbox']", function () {
				$(this).closest("li").toggleClass("active", this.checked)
			})
			$('.dropdown-menu.keep-open').on({
				"click": function (e) {
					e.stopPropagation()
					this.closable = false
				}
			})
		},
		removeUser(user) {
			const { points, type, restaurant, orders, cart, ...u } = user
			switch (user.role) {
				case 'CUSTOMER':
					axios.delete('rest/user/removeUser', { data: u })
					this.customers = this.customers.filter((u) => u.username !== user.username)
					break
				case 'DELIVERER':
					axios.delete(`rest/request/removeRequests/${user.username}`)
					axios.delete('rest/user/removeUser', { data: u })
					this.deliverers = this.deliverers.filter((u) => u.username !== user.username)
					break
				case 'MANAGER':
					if (user.restaurant)
						axios.delete(`rest/restaurant/removeRestaurant/${user.restaurant.name}`)
					axios.delete('rest/user/removeUser', { data: u })
					this.managers = this.managers.filter((u) => u.username !== user.username)
					this.$emit('manager-removed', u)
					break
				default:
					break
			}
		},
		blockUser(user) {
			user.status = 'BLOCKED'
			axios.put('rest/user/setStatus', {
				username: user.username, role: user.role, status: 'BLOCKED'
		   })
		   if (user.role === 'MANAGER') this.$emit('manager-blocked', user)
		},
	},

	filters: {
		roleFormat(role) {
			return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
		},
	},

	template: `
	<div>
		<h1 class="text-center" style="color:white; padding-top:5%;">Users</h1>
		<div class="row mb-5 mt-5 justify-content-center">
			<div class="col-md-4">
				<div class="form-floating">
					<input type="text" class="form-control" id="userSearch" v-model="searchFilters">
					<label for="userSearch">Username, name, surname</label>
				</div>
			</div>
			<div class="col-md-2">
				<div class="form-floating">
					<select v-model="sortBy" class="form-select" id="usersSort">
						<option value="">None</option>
						<option value="Name">Name</option>
						<option value="Surname" selected>Surname</option>
						<option value="Username">Username</option>									
						<option value="Points received">Points received</option>									
					</select>
					<label for="usersSort">Sort by</label>
				</div>
			</div>
			<div class="col-md-1 align-self-center d-flex justify-content-center">
				<button class="btn btn-primary" @click="setSortOrder">
      				<i :class="[ascending ? 'fa fa-sort-up' : 'fa fa-sort-down']"></i>
    			</button>
			</div>
			<div class="col-md-2 d-flex justify-content-center">
				<button class="btn btn-lg btn-primary dropdown-toggle" type="button" 
				id="roleMenu" data-bs-toggle="dropdown" 
				aria-haspopup="true" aria-expanded="true">
					Select roles
				</button>
				<ul class="dropdown-menu checkbox-menu allow-focus keep-open" aria-labelledby="roleMenu">
					<li v-for="(role, i) in roles">
						<label>
							<input type="checkbox" v-model="roleFilters[i]">
							{{role}}
						</label>
					</li>
				</ul>
			</div>
			<div class="col-md-2 d-flex justify-content-center">
				<button class="btn btn-lg btn-primary dropdown-toggle" type="button" 
				id="typeMenu" data-bs-toggle="dropdown" 
				aria-haspopup="true" aria-expanded="true">
					Select types
				</button>
				<ul class="dropdown-menu checkbox-menu allow-focus keep-open" aria-labelledby="typeMenu">
					<li v-for="(type, i) in types">
						<label>
							<input type="checkbox" v-model="typeFilters[i]">
							{{type}}
						</label>
					</li>
				</ul>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<table class="table table-bordered table-hover" style="background: antiquewhite;">
					<thead style="background: navajowhite;">
						<tr class="text-center">
							<th>
								Username
							</th>
							<th>
								Name
							</th>
							<th>
								Surname
							</th>
							<th>
								Points received
							</th>
							<th>
								Role
							</th>
							<th>
								Customer type
							</th>
							<th>
								Manage account
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="u in filteredUsers" 
						:style="[u.status === 'BLACKLISTED' ? {'background': 'darkgray'} : u.status === 'BLOCKED' ? {'background': 'indianred', 'color': 'white'} : {}]"
						:title="u.status | roleFormat">
							<td>{{u.username}}</td>
							<td>{{u.name}}</td>
							<td>{{u.surname}}</td>
							<td>{{u.points.toFixed(2)}}</td>
							<td>{{u.role | roleFormat}}</td>
							<td>{{u.type.typeName}}</td>
							<td>
								<div class="d-flex justify-content-center" v-if="u.role !== 'ADMIN'" style="display:inline;">
									<button v-if="u.status !== 'BLOCKED'" class="btn btn-warning" style="margin-right: 5%;" @click="blockUser(u)">Block</button>
									<button class="btn btn-danger" @click="removeUser(u)">Delete</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	`
});