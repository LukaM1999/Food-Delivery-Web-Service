Vue.component("comments", {

	data: function () {
		return {
			comments: [],
		}
	},

	props: {
		singleRestaurant: {
			type: String,
		}
	},

	mounted() {
		if (this.singleRestaurant) this.getRestaurantComments()
	},

	methods: {
		getRestaurantComments() {
			if(this.$root.$data.user?.role === 'CUSTOMER' || this.$root.$data.user?.role === 'DELIVERER' || this.$root.$data.user === null)
				this.comments = this.$root.$data.comments.filter(c => c.approval === 'APPROVED' && c.restaurant === this.singleRestaurant)
			else	
				this.comments = this.$root.$data.comments.filter(c => c.restaurant === this.singleRestaurant)

		},
		setCommentApproval(comment, approval){
			comment.approval = approval
			axios.put('rest/comment/setCommentApproval', comment)
			if(approval === 'APPROVED') this.$root.showAlert('Successfully approved comment!')
			if(approval === 'REJECTED') this.$root.showAlert('Successfully rejected comment!')
		}
	},

	template: `
		<div class="row" style="padding-top:15px; padding-left:15px;">
			<div class="col">
				<h1 class="text-center">Comments</h1>
				<div class="menu-box">
					<div class="container">
						<div class="row">
							<div v-for="c in comments" class="col-md-4 mb-4">
								<div class="card text-center h-100 my-shadow" style="width: 20rem;">
									<i v-if="c.approval === 'APPROVED' && ($root.$data.user?.role === 'MANAGER' || $root.$data.user?.role === 'ADMIN')" 
										class="fa fa-3x fa-check position-absolute top-0 start-100 translate-middle" style="z-index: 10; color:lightgreen;"></i>
									<i v-if="c.approval === 'REJECTED' && ($root.$data.user?.role === 'MANAGER' || $root.$data.user?.role === 'ADMIN')" 
										class="fa fa-3x fa-times position-absolute top-0 start-100 translate-middle" style="z-index: 10; color:red;"></i>  
									<div class="card-body">
										<h3 class="card-title">{{c.poster}}</h3>
										<h5 class="card-subtitle mb-2 text-muted">{{c.date}}</h5>
										<p class="card-text">{{c.content}}</p>
										<div class="container">
											<label for="c.orderId" class="control-label">Rating</label>
                                        	<input id="c.orderId" class="rating rating-loading" :value="c.rating" data-min="0" data-max="5" data-step="1">
										</div>	
									</div>
									<div class="card-footer" v-if="c.approval === 'PROCESSING' && $root.$data.user?.role === 'MANAGER'" style="display:inline;">
										<button class="btn btn-primary" @click="setCommentApproval(c, 'APPROVED')"><i class="fa fa-2x fa-check"></i></button>
										<button class="btn btn-danger" @click="setCommentApproval(c, 'REJECTED')"><i class="fa fa-2x fa-times"></i></button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
});