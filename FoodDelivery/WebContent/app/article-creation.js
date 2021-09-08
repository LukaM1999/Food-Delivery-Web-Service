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

	methods: {
		async addArticle() {
			var fileInput = document.getElementById('imageFile')
			if (fileInput.files.length === 0 ) return
			const filename = fileInput.files[0].name;
			const article = {
				name: this.name,
				price: this.price,
				type: this.type,
				restaurant: this.restaurant.name,
				quantity: this.quantity,
				description: this.description,
				image: filename,
			}
			const response = await axios.post('rest/restaurant/addArticle', article)
			if (response.data) {
				this.$root.showAlert("Successfully created article!")
				this.$emit('article-created', article)
				$("#articleModal .btn-close").click()
			}
			else 
				this.$root.showAlert("An article with the name " + this.name + " already exists")
		},
	},

	template: `
	<div>
		<button type="button" class="btn btn-dark btn-lg" data-bs-toggle="modal"
			data-bs-target="#articleModal">Add article</button>
		<div class="modal fade" role="dialog" id="articleModal">
			<div class="modal-dialog modal-dialog-centered" style="width: auto;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<h1 style="text-align: center;">Add article</h1>
						<form @submit.prevent="addArticle">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingNameArticle" v-model="name"
											required autofocus>
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
									<label for="imageFile" class="form-label">Image*</label>
									<input class="form-control" type="file" id="imageFile" required accept="image/*">
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
									<label v-if="type === 'FOOD'" >grams</label>
									<label v-if="type === 'DRINK'" >milliliters</label>
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-dark btn-lg">
										Add
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});