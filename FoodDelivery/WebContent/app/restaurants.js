Vue.component("restaurants", {

	data: function () {
		return {
			restaurants: [],
		}
	},

	template: `
		<div class="row">
			<div class="col-md-12">
				<div class="menu-box">
					<div class="container">
						<div class="row">
							<div class="col-lg-12">
								<div class="heading-title text-center">
									<h2>Restorani</h2>
								</div>
							</div>
						</div>
						<a href="#" id="back-to-top" title="Back to top" style="display: none;"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></a>
						<div class="row inner-menu-box">
							<div class="col-20">
								<div class="tab-content" id="v-pills-tabContent">
									<div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid drinks">
												<div class="gallery-single fix">
													<img src="images/img-01.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Drinks 1</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $7.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid drinks">
												<div class="gallery-single fix">
													<img src="images/img-02.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Drinks 2</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $9.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid drinks">
												<div class="gallery-single fix">
													<img src="images/img-03.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Drinks 3</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $10.79</h5>
													</div>
												</div>
											</div>			
											
											<div class="col-lg-4 col-md-6 special-grid lunch">
												<div class="gallery-single fix">
													<img src="images/img-04.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Lunch 1</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $15.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid lunch">
												<div class="gallery-single fix">
													<img src="images/img-05.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Lunch 2</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $18.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid lunch">
												<div class="gallery-single fix">
													<img src="images/img-06.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Lunch 3</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $20.79</h5>
													</div>
												</div>
											</div>			

											<div class="col-lg-4 col-md-6 special-grid dinner">
												<div class="gallery-single fix">
													<img src="images/img-07.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Dinner 1</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $25.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid dinner">
												<div class="gallery-single fix">
													<img src="images/img-08.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Dinner 2</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $22.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid dinner">
												<div class="gallery-single fix">
													<img src="images/img-09.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Dinner 3</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $24.79</h5>
													</div>
												</div>
											</div>
										</div>
										
									</div>
									<div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid drinks">
												<div class="gallery-single fix">
													<img src="images/img-01.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Drinks 1</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $7.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid drinks">
												<div class="gallery-single fix">
													<img src="images/img-02.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Drinks 2</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $9.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid drinks">
												<div class="gallery-single fix">
													<img src="images/img-03.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Drinks 3</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $10.79</h5>
													</div>
												</div>
											</div>
										</div>
										
									</div>
									<div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid lunch">
												<div class="gallery-single fix">
													<img src="images/img-04.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Lunch 1</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $15.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid lunch">
												<div class="gallery-single fix">
													<img src="images/img-05.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Lunch 2</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $18.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid lunch">
												<div class="gallery-single fix">
													<img src="images/img-06.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Lunch 3</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $20.79</h5>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid dinner">
												<div class="gallery-single fix">
													<img src="images/img-07.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Dinner 1</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $25.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid dinner">
												<div class="gallery-single fix">
													<img src="images/img-08.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Dinner 2</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $22.79</h5>
													</div>
												</div>
											</div>
											
											<div class="col-lg-4 col-md-6 special-grid dinner">
												<div class="gallery-single fix">
													<img src="images/img-09.jpg" class="img-fluid" alt="Image">
													<div class="why-text">
														<h4>Special Dinner 3</h4>
														<p>Sed id magna vitae eros sagittis euismod.</p>
														<h5> $24.79</h5>
													</div>
												</div>
											</div>
										</div>
									</div>
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