SafeRoute.RoutesModel = {
    initialize: function(directionsService, directionsDisplay) {
        this.directionsService = directionsService;
        this.directionsDisplay = directionsDisplay;
        this.allRoutes = [];
        this.globalCounter = 0;
    },
    parseData: function(controller, mapsData, crimesData) {
        SafeRoute.RoutesModel.heatMapData = []
        for (var crime = 0; crime < crimesData.features.length; crime++) {
            SafeRoute.RoutesModel.heatMapData.push(new google.maps.LatLng(crimesData.features[crime].geometry.coordinates[1], crimesData.features[crime].geometry.coordinates[0]))
        }
        var start = mapsData[0];
        var end = mapsData[1];
        this.createRoutes(controller, start, end, crimesData);
    },
    createRoutes: function(controller, start, end, data) {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true
        }
        SafeRoute.RoutesModel.directionsService.route(request, function(result, status) {
            SafeRoute.RoutesModel.EVERYTHING = result
            SafeRoute.RoutesModel.crimesSpots = []
            for (var d = 0; d < data.features.length; d++) {
                SafeRoute.RoutesModel.crimesSpots.push([data.features[d].geometry.coordinates])
            }

            for (var newRoute = 0; newRoute < result.routes.length; newRoute++) {

                SafeRoute.RoutesModel.allRoutes.push(SafeRoute.RoutesModel.officialPathEvaluator(result.routes[newRoute]))
            }



            var waypointsArr = SafeRoute.RoutesModel.algorithm(result);
            SafeRoute.RoutesModel.callr(waypointsArr, controller, start, end, data)
        })
    },

    officialPathEvaluator: function(routeObject) {
        var routeCoords = []
        for (var j = 0; j < routeObject.overview_path.length; j++) {
            routeCoords.push([routeObject.overview_path[j].k, routeObject.overview_path[j].B])
        }
        var absoluteCrimeScore = 0
        for (var pathCoord = 0; pathCoord < routeCoords.length; pathCoord++) {
            for (var crime = 0; crime < SafeRoute.RoutesModel.crimesSpots.length; crime++) {
                if (Math.abs(routeCoords[pathCoord][0] - SafeRoute.RoutesModel.crimesSpots[crime][0][1]) < .0005 && Math.abs(routeCoords[pathCoord][1] - SafeRoute.RoutesModel.crimesSpots[crime][0][0]) < .0005) {
                    absoluteCrimeScore += 1
                }
            }
        }
        var scaledCrime = absoluteCrimeScore / routeCoords.length
        routeObject.score = scaledCrime
        return routeObject
    },
    checkRoutes: function(data) {
        var finalRouteObjectArray = []
        var safestScore = 0
        var safestRouteObject = []
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                safestScore = data[i].score
                safestRouteObject = data[i]
            }
            if (data[i].score < safestScore) {
                safestScore = data[i].score
                safestRouteObject = data[i]
            }
        }
        finalRouteObjectArray.push(safestRouteObject)
        var highestScore = 0
        var dangerousRouteObject
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                highestScore = data[i].score
                dangerousRouteObject = data[i]
            }
            if (data[i].score > highestScore) {
                highestScore = data[i].score
                dangerousRouteObject = data[i]
            }
        }
        finalRouteObjectArray.push(dangerousRouteObject)
        var shortestDistance = 0
        var shortestRouteObject
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                shortestDistance = data[i].legs[0].distance.value
                shortestRouteObject = data[i]
            }
            if (data[i].legs[0].distance.value < shortestDistance) {
                shortestDistance = data[i].legs[0].distance.value
                shortestRouteObject = data[i]
            }
        }
        finalRouteObjectArray.push(shortestRouteObject)
        return finalRouteObjectArray
    },
    callr: function(waypointsArr, controller, start, end, data) {
        for (var index = 0; index < waypointsArr.length; index++) {
            var request = {
                origin: start,
                destination: end,
                waypoints: [{
                    location: new google.maps.LatLng(waypointsArr[index][0], waypointsArr[index][1]),
                    stopover: false
                }],
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.WALKING,
                provideRouteAlternatives: false
            }
            this.routesAlgorithm(controller, data, request, this.directionsService, this.directionsDisplay)
        }
    },
    routesAlgorithm: function(controller, data, request, directionsService, directionsDisplay) {
        var self = this
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var waypointRouteObjectOfficial = result.routes[0]
                var waypointRouteObjectOfficialScored = SafeRoute.RoutesModel.officialPathEvaluator(waypointRouteObjectOfficial)
                SafeRoute.RoutesModel.allRoutes.push(waypointRouteObjectOfficialScored);


                SafeRoute.RoutesModel.globalCounter++
                $(document).trigger('testChange', [SafeRoute.RoutesModel.allRoutes])

            }
        })
    },

    algorithm: function(result) {
        var bearings = [.75, .666, .583]
        var waypoints = [];
        var lat1 = result.routes[0].legs[0].start_location.k
        var lon1 = result.routes[0].legs[0].start_location.B
        var lat2 = result.routes[0].legs[0].end_location.k
        var lon2 = result.routes[0].legs[0].end_location.B
        var latte1 = toRad(lat1)
        var latte2 = toRad(lat2)
        var longe1 = toRad(lon1)
        var longe2 = toRad(lon2)
        var changelatte = toRad(lat2 - lat1)
        var changelonge = toRad(lon2 - lon1)
        var R = 6371;

        function toRad(n) {
            return n * Math.PI / 180;
        };

        function toDeg(n) {
            return n * 180 / Math.PI;
        };

        function getDistanceFromLatLonInKm(latte1, longe1, latte2, longe2) {
            var dLat = latte2 - latte1;
            var dLon = longe2 - longe1;
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(latte1) * Math.cos(latte2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }
        var distanceR = getDistanceFromLatLonInKm(latte1, longe1, latte2, longe2);

        function originalBearing(changelonge, latte1, latte2) {
            var y = Math.sin(changelonge) * Math.cos(latte2);
            var x = Math.cos(latte1) * Math.sin(latte2) - Math.sin(latte1) * Math.cos(latte2) * Math.cos(changelonge);
            var brng = (Math.atan2(y, x)) * (180 / Math.PI);
            return brng
        }
        var brng = originalBearing(changelonge, latte1, latte2)
        for (var counter = 0; counter < bearings.length; counter++) {
            var legdistance = distanceR * bearings[counter]
            var adjacent = distanceR / 2
            var oposite = Math.sqrt((Math.pow(legdistance, 2)) - (Math.pow(distanceR, 2) / 4))
            var tangentd = toDeg(Math.atan(oposite / adjacent))

            function waypointbearingfinder(brng, tangentd) {
                if (brng > 0 && brng + tangentd > 180) {
                    var total = tangentd + brng
                    var overflow = total - 180
                    var brngplus = -180 + overflow
                    var brngminus = brng - tangentd
                    return [brngplus, brngminus]
                } else if (brng < 0 && brng - tangentd < -180) {
                    var total = brng - tangentd
                    var overflow = Math.abs(180 + total)
                    var brngminus = 180 - overflow
                    var brngplus = brngplus + tangentd
                    return [brngplus, brngminus]
                } else {
                    var brngplus = brng + tangentd
                    var brngminus = brng - tangentd
                    return [brngplus, brngminus]
                }
            }
            var waypointBearings = waypointbearingfinder(brng, tangentd);

            function Waypoints(d, brng, latte1, longe1) {
                var waypointArray = []
                for (var i = 0; i < brng.length; i++) {
                    var latte2 = Math.asin(Math.sin(latte1) * Math.cos(d / R) + Math.cos(latte1) * Math.sin(d / R) * Math.cos(brng[i]));
                    var longe2 = longe1 + Math.atan2(Math.sin(brng[i]) * Math.sin(d / R) * Math.cos(latte1), Math.cos(d / R) - Math.sin(latte1) * Math.sin(latte2));
                    waypointArray.push([toDeg(latte2), toDeg(longe2)])
                }
                return waypointArray
            }
            var bearingarray = [toRad(waypointBearings[0]), toRad(waypointBearings[1])]
            waypoint = Waypoints(legdistance, bearingarray, latte1, longe1)
            waypoints.push(waypoint[0], waypoint[1])
        }
        return waypoints
    }
}
