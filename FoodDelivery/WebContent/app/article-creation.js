Vue.component("articleCreation", {

	data: function () {
		return {
			name: '',
			price: 0,
			type: 'FOOD',
			quantity: 0,
			description: '',
			image: '',

			alert: '',
		}
	},

	props: {
		restaurant: {
			type: Object,
		},
	},

	mounted() {
		$('#articleModal').on('hidden.bs.modal', function () {
			$(this).find('form').trigger('reset');
		});
	},

	components: {

	},

	methods: {
		async addArticle() {
			var self = this
			const article = await this.getArticle()
			axios
				.post('rest/restaurant/addArticle', article)
				.then(response => {
					if (response.data) {
						self.alert = "Successfully created article!"
						this.$emit('article-created', article)
						$("#articleModal .btn-close").click()
					}
					else {
						self.alert = "An article with the name " + self.name + " already exists";
					}
					$('#articleCreationAlert').fadeIn(300).delay(5000).fadeOut(300);
				})
		},

		getArticle() {
			return new Promise((resolve, reject) => {
				axios
					.get('rest/restaurant/getLogo')
					.then(response => {
						this.image = response.data
						var article = {
							name: this.name,
							price: this.price,
							type: this.type,
							restaurant: this.restaurant.name,
							quantity: this.quantity,
							description: this.description,
							image: this.image,
						}
						console.log(article)
						resolve(article)
					})
			})
		},

		getImage(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length)
				return;
			var file = files[0];
			var reader = new FileReader();
			reader.onloadend = function () {
				var imgType = file.type.split('/');
				var self = this;
				self.logo = reader.result.replace('data:image/' + imgType[1] + ';base64,', '');

				axios
					.post('rest/restaurant/setLogo', self.logo.replace('+', '%2B'))
			}
			reader.readAsDataURL(file);
		},

	},

	template: `
	<div>
		<button type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal"
			data-bs-target="#articleModal">Add article</button>
		<div class="modal fade" role="dialog" id="articleModal">
			<div class="modal-dialog modal-dialog-centered" style="width: auto;">
				<div class="modal-content">
					<div class="modal-header" style="background-color: #f72585;">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body" style="background-color: #b23cfd;">
						<h1 style="color: white; text-align: center;">Add article</h1>
						<form @submit.prevent="addArticle">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingNameArticle" v-model="name"
											required>
										<label for="floatingNameArticle">Article name*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="number" class="form-control" id="floatingPrice" step="0.01" min="0" v-model="price"
											required>
										<label for="floatingPrice">Price*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<select class="form-select" id="typeSelect" v-model="type">
											<option value="FOOD" selected>Food</option>
											<option value="DRINK">Drink</option>
										</select>
										<label for="typeSelect">Type*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<label for="imageFile" style="color: white;" class="form-label">Image*</label>
									<input class="form-control" type="file" id="imageFile" v-on:change="getImage"
										accept="image/*">
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<textarea type="text" class="form-control" id="floatingDescription" rows="3" v-model="description"/>
										<label for="floatingDescription">Description (Optional)</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col md-9">
									<div class="form-floating">
										<input type="number" class="form-control" id="floatingQuantity" min="0" v-model="quantity">
										<label for="floatingQuantity">Quantity (Optional)</label>
									</div>
								</div>
								<div class="col md-3 align-self-center">
									<label v-if="type === 'FOOD'" style="color: white;">grams</label>
									<label v-if="type === 'DRINK'" style="color: white;">milliliters</label>
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-primary btn-lg" style="background-color: #f72585 !important;">
										Add
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			id="articleCreationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});