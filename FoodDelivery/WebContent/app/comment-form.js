Vue.component('commentForm', {
    data(){
        return {
            content: '',
            rating: 0,
        }
    },

    props: {
        orderProp: {
            type: Object, 
            default: null
        }
    },

    mounted(){
        let self = this
        $("#rating").rating({
            showCaption: false
        })
        $("#rating").on('change', function(){
            self.rating = $("#rating").val()
        })
        $('.modal').on('show.bs.modal', async function () {
			let backdrop = await self.getBackdrop()
			backdrop[0]?.parentNode?.removeChild(backdrop[0])
		})
        $('.modal').on('shown.bs.modal', function () {
			$(this).find('[autofocus]').focus()
		})
        $('#commentModal').on('hidden.bs.modal', function () {
            self.content = ''
            self.rating = 0
            $('#rating').rating('update', 0)
        })
    },

    methods: {
        async postComment(){
            const comment = {
                orderId: this.orderProp.id,
                poster: this.orderProp.customerName,
                restaurant: this.orderProp.restaurant,
                content: this.content,
                rating: this.rating,
                approval: 'PROCESSING',
                date: new Date().format('dd.mm.yyyy.')
            }
            this.$root.$data.comments.push(comment)
            $("#commentModal .btn-close").click()
            await axios.post('rest/comment/addComment', comment)
            this.$root.showAlert(`Successfully commented on restaurant ${this.orderProp.restaurant}!`)
        },
        getBackdrop() {
			return new Promise((resolve, reject) => {
				let backdrop = document.getElementsByClassName('modal-backdrop')
				if (backdrop) {
					resolve(backdrop)
				}
				reject('No backdrop yet')
			})

		},
    },

    template: `
        <div>
            <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal"
                data-bs-target="#commentModal">Post a comment</button>
            <div class="modal fade" role="dialog" id="commentModal">
                <div class="modal-dialog modal-dialog-centered" style="width: auto;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h1 style="text-align: center;">Post a comment</h1>
                            <form @submit.prevent="postComment">
                                <div class="row mb-3">
                                    <div class="col">
                                        <div class="form-floating">
                                            <textarea type="text" class="form-control" id="floatingContent" rows="3" v-model="content" required autofocus/>
                                            <label for="floatingContent">Content*</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label for="rating" class="control-label">Rating*</label>
                                        <input id="rating" name="rating" class="rating rating-loading" data-min="0" data-max="5" data-step="1" required>
                                    </div>
                                </div>
                                <div class="row align-content-center">
                                    <div class="col d-flex justify-content-center">
                                        <button type="submit" class="btn btn-dark btn-lg">
                                            Submit
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
})    
