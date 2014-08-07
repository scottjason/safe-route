SafeRoute.UsersController = {
  initialize: function(model, view) {
    this.model = model;
    this.view = view;
  },
  fetch: function() {
    this.model.location(this);
  },
  collectLocation: function(results) {
    this.view.render(results);
  },
  notify: function(){
    SafeRoute.UsersView.failure();
  },
  collectEmail: function() {
    event.preventDefault();
    var emailData = SafeRoute.UsersModel.prepareEmail(SafeRoute.UsersController);
    $.ajax({
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      type: 'POST',
      dataType: "json",
      data: emailData
    }).done(function(data) {
      $('#emailDiv').fadeIn(2000, function(){
        $(this).fadeOut(2000);
      });
    })
  }
}
