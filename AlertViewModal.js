(function (Marionette, $) {
    "use strict";
    var Controllers = window.Controllers = window.Controllers || {};
    Controllers.AlertViewController = Marionette.Object.extend({

        initialize: function (options) {
            this._debugLog("[AlertViewController] initialize");
        },

        show: function (options) {
            this._debugLog("[AlertViewController] show");
            var handlers = {};
            for(var index in options.optionalButtons){
                var item = options.optionalButtons[index];
                var title = item.title;
                var handler = item.handler;
                if(handler){
                    console.log('Initializing button callback of ['+ title + ']');
                    var eventName = "click [data-event='"+ options.optionalButtons.indexOf(item) +"']";
                    handlers[eventName] = function(){
                        handler();   
                        $("#alert-view-modal").off('hidden.bs.modal');
                        $("#alert-view-modal").modal('hide');
                    };
                }
                else{
                    console.log('No handler provided for [' + title +']');
                }
                console.log(handlers);
            }
            handlers["click [data-event='primary']"] = function() { 
                        options.onClickPrimaryButton(); 
                        $("#alert-view-modal").off('hidden.bs.modal');
                        $("#alert-view-modal").modal('hide');
                    };
            
            options.layoutRegion.show(new Marionette.ItemView({
                template: "#AlertViewModal",
                
                templateHelpers: function(){
                    return {
                        alertTitle: options.title,
                        alertMessage: options.message,
                        secondaryBtnTitle: options.secondaryButtonLabel,
                        primaryBtnTitle: options.primaryButtonLable,
                        collection: options.optionalButtons
                    }
                },
                events:handlers
            }));
            $("#alert-view-modal").on('hidden.bs.modal', function (e) {
                options.onUserCancel();
            })
            $("#alert-view-modal").modal('show');
        },

        _debugLog: function (msg) {
            if (this.options.debug) {
                console.log(msg);
            }
        },
    });

})(window.Marionette, window.jQuery);


/// client code below
console.log($('#AlertViewModal'));

// create a marionette region for AlertViewController to insert its view
var testRegion = new Marionette.Region({
    el:"#static-region"
});

testRegion.show(new Marionette.ItemView({
    template: _.template("Hello World")
}));

var alertView = new window.Controllers.AlertViewController({
    debug: true,
});
alertView.show({
    layoutRegion: testRegion,
    title: "Hello",
    message: "How's going",
    primaryButtonLable: "OK",
    secondaryButtonLabel: "Cancel(optional)",
    onClickPrimaryButton: function() {
        console.log('Good to hear that.');
    },
    onUserCancel: function() {
        console.log('so sorry to hear that');
    },
    optionalButtons:[
        {
            title:"3(optional)",
            handler: function (){
                console.log("3rd button clicked");
            }
        },
                {
            title:"4(optional)",
            handler: function (){
                console.log("4rd button clicked");
            }
        }
    ]
});