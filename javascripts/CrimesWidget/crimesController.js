SafeRoute.CrimesController = {
  initialize: function(model){
    this.model = model;
  },
  request: function(){
    this.model.requestCrimes(this)
  }
}