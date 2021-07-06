Vue.component("users", {

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
		//this.$router.push({ name: 'users'});
	},

	methods: {
		addManager(manager){
			this.managers.push(manager)
			//this.$refs.restaurantCreation.$data.managers.push(manager)
		},
		addDeliverer(deliverer){
			this.deliverers.push(deliverer)
		}
	},

	template: `
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
	`
});