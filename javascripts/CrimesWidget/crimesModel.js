SafeRoute.CrimesModel = {
    requestCrimes: function(controller) {
        $('#loading').addClass('animated zoomIn');
        $.ajax({
            url: 'http://sanfrancisco.crimespotting.org/crime-data?format=json&dstart=2006-01-01&count=3500&type=AA,Mu,Ro,SA,Al,Th',
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
            $('#loading').addClass('animated zoomOut');
            $('.directions1').fadeIn(800);
            $( "#loading" ).fadeOut(400, function(){
                $('#locations').addClass('flex')
            })
            $('#loadingImage').fadeOut(400);
            $(this).trigger('collectCrimes', [data])
        }.bind(this))
    }
}
