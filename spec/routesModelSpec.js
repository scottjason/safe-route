describe("SafeRoute.RoutesModel", function(){
    var rModel = SafeRoute.RoutesModel;
    var directionsService = { getDirections: function() {}}
    var directionsDisplay = {}

  beforeEach(function() {
    rModel.initialize(directionsService, directionsDisplay)
  })

  describe("parseData", function() {
    it("should call createRoutes", function(){
        var mapsData = {mapsData: ['one', 'two']};
        var crimesData;
        spyOn(rModel, 'createRoutes');
        rModel.parseData(SafeRoute.RoutesController, mapsData, crimesData)
        expect(rModel.createRoutes).toHaveBeenCalled()
    })
  })

  // describe("routesAlgorithm", function(){
  //   context("google api returns OK status", function(){

  //     it("returns")

  //     it("")

  //     it("")


  //   })
  // })

  beforeEach(function(){
    this.result = {
      routes: [{overview_path:
                [
                  {k: 42.3, B: 13.7},
                  {k: 38.1, B: 52.9}
                ]}
              ]}
  })
  describe("addPathToRoute", function(){

    it("returns a route with the points in overview_path", function() {
      var answer = [[42.3, 13.7],[38.1, 52.9]]
      var route = []
      rModel.addPathToRoute(this.result, 0, route)
      expect(route).toEqual(answer)
    })
  })

  describe("collectAllRoutes", function(){
    it("simplifies the route structure", function(){
      var routes = []
      var answer = [ [ [ 42.3, 13.7 ], [ 38.1, 52.9 ] ] ]
//                 | | [ coordinate ], [ coordinate ] | |
//                 | [              route             ] |
//                 [                routes              ]
      // spyOn(rModel, "addPathToRoute").and.returnValue([[42.3, 13.7],[38.1, 52.9]])
      rModel.collectAllRoutes(rModel, this.result, routes)
      expect(routes).toEqual(answer)
    })
  })

  describe("populateCrimeSpots", function(){
    it("returns an array of crime coordinates", function(){
      var crimeSpots = []
      var data = {features: [{geometry: {coordinates: [23.4, 45.6] }}]}
      rModel.populateCrimeSpots(crimeSpots, data)
      expect(crimeSpots).toEqual([[[23.4, 45.6]]])
    })

  })

  describe("closeCrimeFinder", function(){
    it("returns true or false depending on how close google coordinates and crime Coordinates are",function(){
      var lat = 2
      var lon = 3
      var crimeCoord = [4, 5]
      expect(rModel.closeCrimeFinder(lat, lon, crimeCoord)).toBeFalsy();
    })
  })

  describe("checkForLocalCrimes", function(){
    it("tests coordianates of direction and crime data and add a point to absoluteCrimeScore if they are close enough",function(){
      var absoluteCrimeScore = 0;
      var routes = [ [ [ 42.3333, 13.4447 ] ] ]
      var crimeSpots = [ [ [ 13.4446, 42.3337 ] ] ]
      rModel.checkForLocalCrimes(absoluteCrimeScore, routes, 0, crimeSpots, rModel, 0)
      expect(absoluteCrimeScore).toEqual(1)
    })
  })

})

// describe("some test", function() {
//   it("should do something", function() {
//   expect(true).toBeTruthy()

//   })
// })