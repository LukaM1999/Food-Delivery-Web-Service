Vue.component("articleEdit", {

	data: function () {
		return {
			oldArticle: {},
			article: {},
			hasListeners: false,
		}
	},

	props: {
		articleProp: {
			type: Object,
		},
	},

	mounted() {
		this.oldArticle = Object.assign({}, this.articleProp)
		this.article = Object.assign({}, this.articleProp)
	},

	filters: {
		trimWhitespaces: function (value) {
			return value?.replace(/\s/g, "").toLowerCase()
		}
	},

	methods: {
		addListeners() {
			let self = this
			let selector = self.articleProp.name.replace(/\s/g, "")
			let articleModal = document.getElementById(selector.toLowerCase())
			articleModal.addEventListener('hidden.bs.modal', function (event) {
				self.article = Object.assign({}, self.oldArticle)
			})
			this.hasListeners = true
		},

		async editArticle() {
			if(!this.$root.testRegex(this.$root.$data.usernamePattern, this.article.name, `${this.article.name} is not a valid article name!`)) return
			var fileInput = document.getElementById(`${this.oldArticle.name}-image`)
			if (fileInput.files.length === 0 && this.oldArticle.image == '') return
			this.article.image = fileInput.files[0]?.name || this.oldArticle.image
			const {amount, ...editedArticle} = this.article
			const response = await axios.put('rest/restaurant/editArticle', { article: editedArticle, oldName: this.oldArticle.name })
			if (response.data) {
				let selector = "#" + this.oldArticle.name.replace(/\s/g, "").toLowerCase()
				$(selector + " .btn-close").click()
				this.$emit('article-updated', { article: this.article, oldName: this.oldArticle.name })
				this.oldArticle = response.data
			}
			else
				this.$root.showAlert(`An article with the name ${this.article.name} already exists.`)
		},
	},

	template: `
	<div>
        <button v-if="oldArticle" type="button" style="z-index: 10;" title="Edit article" 
        class="btn btn-primary position-absolute top-0 start-100 translate-middle"
        data-bs-toggle="modal" :data-bs-target="'#' + oldArticle.name | trimWhitespaces" 
		@mouseover="hasListeners ? '' : addListeners()">
            <i class="fa fa-edit fa-2x"></i>
        </button>
		<div v-if="oldArticle" class="modal fade" role="dialog" :id="oldArticle.name | trimWhitespaces">
			<div class="modal-dialog modal-dialog-centered" style="width: auto;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<h1 text-align: center;">Edit {{oldArticle.name}}</h1>
						<form @submit.prevent="editArticle">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingNameArticle" v-model="article.name"
											required
											:pattern="$root.$data.usernamePattern"
											title= "1. At least 3 characters\n2. No leading or trailing dots">
										<label for="floatingNameArticle">Article name*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="number" class="form-control" id="floatingPrice" step="0.01" min="0" v-model="article.price"
											required>
										<label for="floatingPrice">Price*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<select class="form-select" id="typeSelect" v-model="article.type">
											<option value="FOOD" selected>Food</option>
											<option value="DRINK">Drink</option>
										</select>
										<label for="typeSelect">Type*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<label :for="oldArticle.name + '-image'" class="form-label">New image</label>
									<input class="form-control" type="file" :required="article.image === ''" :id="oldArticle.name + '-image'" accept="image/*">
									<label :for="oldArticle.name + '-image'">Old image: {{oldArticle.image}}</label>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<textarea type="text" class="form-control" id="floatingDescription" rows="3" v-model="article.description"/>
										<label for="floatingDescription">Description (Optional)</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col md-9">
									<div class="form-floating">
										<input type="number" class="form-control" id="floatingQuantity" min="0" v-model="article.quantity">
										<label for="floatingQuantity">Quantity (Optional)</label>
									</div>
								</div>
								<div class="col md-3 align-self-center">
									<label v-if="article.type === 'FOOD'">grams</label>
									<label v-if="article.type === 'DRINK'">milliliters</label>
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-dark" style="margin-top: 10%;">
										Save
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