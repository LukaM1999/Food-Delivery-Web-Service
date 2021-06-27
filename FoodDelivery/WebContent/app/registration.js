Vue.component("registration", {
	
	data: function(){
		return {
			username: '',
			password: '',
			name: '',
			surname: '',
			gender: '',
			dateOfBirth: Date.now,
			role: 'CUSTOMER',
		}
	},

	methods: {
		registerCustomer: function(){
			var customer = {
				username: this.username,
				password: this.password,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				dateOfBirth: new Date(this.dateOfBirth).format("dd.mm.yyyy."),
				role: this.role
			}
			axios
			.post('rest/food/register', customer)
			.then(response => {
				if (response.data) (toast(this.name + " " + this.surname + " uspesno registrovan!"))
				else (toast("Vec postoji korisnik sa korisnickim imenom: " + this.username))
			})
		},
	},

	template: `
	<div>
		<h1 style="color: blue; text-align: center;">Pocetna stranica</h1>
		<form @submit.prevent="registerCustomer">
			<table align="center">
				<tr>
					<td style="font-weight: bold;">Korisnicko ime</td>
					<td><input type="text" name="username" v-model="username" required></td>
				</tr>
				<tr>
					<td style="font-weight: bold;">Lozinka</td>
					<td><input type="text" name="password" v-model="password" required></td>
				</tr>
				<tr>
					<td style="font-weight: bold;">Ime</td>
					<td><input type="text" name="name" v-model="name" required></td>
				</tr>
				<tr>
					<td style="font-weight: bold;">Prezime</td>
					<td><input type="text" name="surname" v-model="surname" required></td>
				</tr>
				<tr>
					<td style="font-weight: bold;">Pol</td>
					<td>
						<select name="pol" v-model="gender">
							<option value="MALE">Musko</option>
							<option value="FEMALE">Zensko</option>
							<option value="OTHER">Ostalo</option>
						</select>
					</td>
				</tr>
				<tr>
					<td style="font-weight: bold;">Datum rodjenja</td>
					<td><input type="date" name="dateOfBirth" v-model="dateOfBirth" required="required"></td>
				</tr>
				<tr>
					<td colspan="2" align="center">
						<button type="submit" style="margin-top: 10%;" id="register">
							Registruj se
						</button>
					</td>
				</tr>
			</table>
		</form>
	</div>
	`
});