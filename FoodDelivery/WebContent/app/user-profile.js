Vue.component("userProfile", {

    data: function () {
        return {
            oldArticle: {},
            article: {},
			user: this.$root.$data.user,


            alert: '',
        }
    },

    props: {
        articleProp: {
            type: Object,
        },
    },

    mounted() {
        let self = this
        let selector = "#" + self.articleProp.name.replace(/\s/g, "")
        console.log(selector)
        $(selector).on('hidden.bs.modal', function () {
			self.article = Object.assign({}, self.oldArticle)
		});

        this.oldArticle = Object.assign({}, this.articleProp)
        this.article = Object.assign({}, this.articleProp)
    },

    filters: {
    },

    methods: {
        async editArticle() {
            axios
                .put('rest/user/editProfile', { article: this.article, oldUsername: this.oldArticle.name })
                .then(response => {
                    let oldArticleName = this.oldArticle.name
                    if (response.data) {
                        let selector = "#" + self.oldArticle.name.replace(/\s/g, "")
                        $(selector + " .btn-close").click()
                        this.$emit('article-updated', {article: this.article, oldName: this.oldArticle.name})
                        this.oldArticle = response.data
                    }
                    else {
                        self.alert = "An error has occured.";
                        $('#alert' + oldArticleName).fadeIn(300).delay(5000).fadeOut(300);
                    }
                })
        },

    },

    template: `
	<div>
        <button v-if="oldArticle" type="button" title="Profile"class="btn btn-secondary"
        data-bs-toggle="modal" :data-bs-target="#profileModal">
            <i class="fa fa-user-circle fa-4x"></i>
        </button>
		<div v-if="oldArticle" class="modal fade" role="dialog" id="profileModal">
			<div class="modal-dialog modal-dialog-centered" style="width: auto;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Edit {{oldArticle.name}}</h1>
						<form @submit.prevent="editArticle">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingNameArticle" v-model="article.name"
											required>
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
									<label for="imageFile" class="form-label">Image</label>
									<input class="form-control" type="file" :required="article.image === ''" id="imageFile" v-on:change="getImage"
										accept="image/*">
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
									<button type="submit" class="btn btn-primary" style="margin-top: 10%;">
										Save
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			:id="'#alert' + oldArticle.name">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});