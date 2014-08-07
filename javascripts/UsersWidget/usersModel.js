SafeRoute.UsersModel = {
    location: function(controller) {
        this.controller = controller
        var self = this
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(self.success, this.controller.notify)
        } else {
            this.controller.notify();
        }
    },
    success: function(position) {
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({
            'latLng': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        }, SafeRoute.UsersModel.status)
    },
    status: function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            SafeRoute.UsersController.collectLocation(results);
        } else {
            this.controller.notify();
      }
    },
    prepareEmail: function() {
        var email = SafeRoute.UsersModel.collectEmail();
        var directionsHTML = this.formatDirections(SafeRoute.UsersModel.collectDirections());
        return {
            'key': "kw7GF1wkNIN7P2ZVseK9JQ",
            'message': {
                'html': directionsHTML,
                'from_email': 'SafeRoute@SafeRoute.com',
                'to': [{
                    'email': email,
                    'name': 'SafeRoute',
                    'type': 'to'
                }],
                'autotext': 'true',
                'subject': 'Your SafeRoute Directions!'
            }
        }
    },
    collectEmail: function() {
        return $(event.target).serializeArray()[0].value
    },
     collectDirections: function() {
        return $('.adp')[0].innerText.split("\n");
    },
    formatDirections: function(directionsText) {
        directionsText.pop()
        directionsText.pop()
        directionsText.shift()
        directionsText[0] = 'Start:' + directionsText[0]
        directionsText[1] = 'Total Time:' + directionsText[1]
        directionsText[directionsText.length - 1] = 'End:' + directionsText[directionsText.length - 1]
        var directionsHTML = '<b>Here are your SafeRoute directions. As always, arrive safely.</b><br /><br />' + directionsText.shift() + '<br /><br/>'
        directionsHTML += directionsText.shift() + '<br /><br/>'
        for (var i = 0; i < directionsText.length - 1; i++) {
            directionsHTML += directionsText[i] + ' (' + directionsText[i + 1] + ')' + '<br/><br />'
            i++
        }
        directionsHTML += directionsText.pop()
        return directionsHTML
  }
}
