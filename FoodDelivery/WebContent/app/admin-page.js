Vue.component("adminPage", {

	data: function () {
		return {
			admin: this.$root.$data.user,
			alert: '',
			customers: [],
			deliverers: [],
			managers: [],
			admins: [],
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

	methods: {
		addManager(manager){
			this.managers.push(manager)
			this.$refs.restaurantCreation.$data.managers.push(manager)
		},
	},

	template: `
	<div class="container-fluid">
	<div class="row">
		<div class="col-md-12">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
					<span class="navbar-toggler-icon"></span>
				</button> <a class="navbar-brand" href="http://localhost:8080/FoodDelivery/"><img src="images/quotations-button.png" width="80" height="80"></a>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="navbar-nav">
						<li class="nav-item active" style="padding: 5px;">
							 <admin-registration :is-manager-assigning="false" @manager-added="addManager"></admin-registration>
						</li>						
						<li class="nav-item active" style="padding: 5px;">
							<restaurantCreation ref="restaurantCreation"></restaurantCreation>
						</li>						
					</ul>
				</div>
			</nav>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>
							Korisnicko ime
						</th>
						<th>
							Ime
						</th>
						<th>
							Prezime
						</th>
						<th>
							Sakupljeni bodovi
						</th>
						<th>
							Uloga
						</th>
						<th>
							Tip korisnika
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="c in customers">
						<td>{{c.username}}</td>
						<td>{{c.name}}</td>
						<td>{{c.surname}}</td>
						<td>{{c.points}}</td>
						<td>Kupac</td>
						<td v-if="c.type.typeName === 'Bronze'">Bronzani</td>
						<td v-if="c.type.typeName === 'Silver'">Srebrni</td>
						<td v-if="c.type.typeName === 'Gold'">Zlatni</td>
					</tr>
					<tr v-for="(d, i) in deliverers">
						<td>{{d.username}}</td>
						<td>{{d.name}}</td>
						<td>{{d.surname}}</td>
						<td>0</td>
						<td>Dostavljac</td>
						<td></td>
					</tr>
					<tr v-for="m in managers">
						<td>{{m.username}}</td>
						<td>{{m.name}}</td>
						<td>{{m.surname}}</td>
						<td>0</td>
						<td>Menadzer</td>
						<td></td>
					</tr>
					<tr v-for="a in admins">
						<td>{{a.username}}</td>
						<td>{{a.name}}</td>
						<td>{{a.surname}}</td>
						<td>0</td>
						<td>Administrator</td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
	`
});