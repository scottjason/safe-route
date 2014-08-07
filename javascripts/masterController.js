var SafeRoute = SafeRoute || {}
SafeRoute.MasterController = {
    initialize: function(MapsController, MapsView, CrimesController, CrimesModel, RoutesController, RoutesModel, RoutesView, UsersController, UsersModel, UsersView) {
        this.sanFranGoogleObj = new google.maps.LatLng(37.7583, -122.4367);
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsService = new google.maps.DirectionsService();
        this.MapsController = MapsController;
        this.MapsView = MapsView;
        this.CrimesController = CrimesController;
        this.CrimesModel = CrimesModel;
        this.RoutesController = RoutesController;
        this.RoutesModel = RoutesModel;
        this.RoutesView = RoutesView;
        this.UsersController = UsersController;
        this.UsersModel = UsersModel;
        this.UsersView = UsersView;
        this.MapsController.initialize(this.MapsView);
        this.CrimesController.initialize(this.CrimesModel);
        this.RoutesController.initialize(this.RoutesModel, this.RoutesView);
        this.RoutesModel.initialize(this.directionsService, this.directionsDisplay);
        this.RoutesView.initialize(this.sanFranGoogleObj);
        this.UsersController.initialize(this.UsersModel, this.UsersView);
        this.run();
    },
    run: function() {
        this.subscribe();
        this.MapsView.animate();
        this.MapsView.listen(this.MapsController);
        this.MapsView.render(this.directionsDisplay, this.sanFranGoogleObj);
        this.UsersController.fetch();
        this.UsersView.listen(this.UsersController);
        this.CrimesController.request();
    },
    subscribe: function() {
        $(this.MapsView).on('collectCoords', function(e, mapsData) {
            console.log(mapsData);
            this.RoutesController.collectMapAndCrimeData(mapsData, this.crimesData)
        }.bind(this));
        $(this.CrimesModel).on('collectCrimes', function(e, crimesData) {
            this.crimesData = crimesData;
        }.bind(this));
    }
}
