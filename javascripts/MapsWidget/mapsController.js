SafeRoute.MapsController = {
    initialize: function(view) {
        this.view = view;
    },
    fetch: function() {
        var start = $(event.target).serializeArray()[0].value
        var end = $(event.target).serializeArray()[1].value
        this.view.reveal(this, start, end, event)
    }
}