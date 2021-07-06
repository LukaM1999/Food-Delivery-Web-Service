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
			roleFilter: '',
			typeFilter: '',
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
	},

	computed: {
		filteredUsers() {
			let tempAdmins = this.admins
			let tempDeliverers = this.deliverers
			let tempManagers = this.managers
			let tempCustomers = this.customers

			tempAdmins.forEach(element => {
				element.points = 0
				element.type = {
					typeName: '',
					discount: 0,
					pointsRequired: 0
				}
			});

			tempDeliverers.forEach(element => {
				element.points = 0
				element.type = {
					typeName: '',
					discount: 0,
					pointsRequired: 0
				}
			});

			tempManagers.forEach(element => {
				element.points = 0
				element.type = {
					typeName: '',
					discount: 0,
					pointsRequired: 0
				}
			});

			let users = []
			Array.prototype.push.apply(users, tempAdmins)
			Array.prototype.push.apply(users, tempDeliverers)
			Array.prototype.push.apply(users, tempManagers)
			Array.prototype.push.apply(users, tempCustomers)


			if (this.searchFilters != '') {
				users = users.filter((r) => {
					return r.name.toLowerCase().includes(this.searchFilters.toLowerCase())
						|| r.surname.toLowerCase().includes(this.searchFilters.toLowerCase())
						|| r.username.toLowerCase().includes(this.searchFilters.toLowerCase())
				})
			}

			if (this.roleFilter != '') {
				users = users.filter((r) => {
					return r.role.toLowerCase().includes(this.roleFilter.toLowerCase())
				})
			}

			if (this.typeFilter != '') {
				users = users.filter((r) => {
					return r.type.typeName.toLowerCase().includes(this.typeFilter.toLowerCase())
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
		}
	},

	filters: {
		roleFormat(role){
			return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
		}
	},

	template: `
	<div>
		<div class="row mb-5 mt-5">
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
			<div class="col-md-2">
				<div class="form-floating">
					<select v-model="roleFilter" class="form-select" id="roleFilter">
						<option value="">Any</option>
						<option value="Customer">Customer</option>
						<option value="Deliverer">Deliverer</option>
						<option value="Manager">Manager</option>									
						<option value="Admin">Admin</option>									
					</select>
					<label for="roleFilter">Role</label>
				</div>
			</div>
			<div class="col-md-2">
				<div class="form-floating">
					<select v-model="typeFilter" class="form-select" id="typeFilter">
						<option value="">Any</option>
						<option value="Bronze">Bronze</option>
						<option value="Silver">Silver</option>
						<option value="Gold">Gold</option>									
					</select>
					<label for="typeFilter">Customer type</label>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
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
					</tr>
				</thead>
				<tbody>
					<tr v-for="u in filteredUsers">
						<td>{{u.username}}</td>
						<td>{{u.name}}</td>
						<td>{{u.surname}}</td>
						<td>{{u.points}}</td>
						<td>{{u.role | roleFormat}}</td>
						<td>{{u.type.typeName}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	`
});