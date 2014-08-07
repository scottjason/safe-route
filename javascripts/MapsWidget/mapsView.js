SafeRoute.MapsView = {
    set: function(sanFranGoogleObj) {
        var mapOptions = {
            zoom: 15,
            center: sanFranGoogleObj,
            styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#1fa856"}]},{"featureType":"poi","stylers":[{"color":"#1fa856"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#1fa856"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#1fa856"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#1fa856"},{"lightness":-8}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#1fa856"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#1fa856"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}],
            streetViewControl: false,
            disableDefaultUI: true
        }
        return mapOptions
    },
    reveal: function(controller, start, end, event) {
        var mapsData = [start, end];
        event.preventDefault();
        $('#locations').hide();
        $('.directions1').fadeOut(300, function(){
        $('.directions2').fadeIn(1000);
        });
        $('#contact').addClass('inlineContact');
        $('#directionsPanel').show();
        $(this).trigger('collectCoords', [mapsData]).bind(this);
    },
    collect: function(sanFranGoogleObj) {
        return new google.maps.Map(document.getElementById("map-canvas"), this.set(sanFranGoogleObj));
    },
    animate: function(){
        $('.bounceOutLeft').addClass('animated fadeInRightBig');
        $('.pleaseWait').addClass('animated fadeIn');
        $('.slogan').addClass('animated fadeIn');
    },
    listen: function(controller){
        $('#locations').on('submit', function(event){
            controller.fetch(event);
        })
    },
    render: function(directionsDisplay, sanFranGoogleObj) {
        directionsDisplay.setMap(this.collect(sanFranGoogleObj));
    }
}
