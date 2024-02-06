/**
 * Overwrite SXA Search Router in order to add geospatial hash before search is triggered.
 * Search router based on backbone router
 * @module searchRouter
 * @param  {jQuery} $ Instance of jQuery
 * @param  {Document} document dom document object
 * @return {Object} list of methods for working with backbone routing
*/
XA.component.search.router = (function ($, document) {

    "use strict";
    /**
    * This object stores all public api methods
    * @type {Object.<Methods>}
    * @memberOf module:searchRouter
    */
    var api = {},
        queryModel,
        initialized = false,
        lastHashObj,
        Router;
    /**
     * @name module:searchRouter.Router
     * @constructor
     * @augments Backbone.Model
     */
    Router = Backbone.Router.extend(
        /** @lends module:searchRouter.Router.prototype **/
        {
            routes: {
                "*params": "checkUrl"
            },
            fixHash: function (hash) {
                var index;

                hash = hash.replace(/[#]/g, "&");
                index = hash.indexOf("&");
                hash = hash.substr(0, index) + "#" + hash.substr(index + 1);

                return hash;
            },
            /**
             * check url for changes in hash
             * @fires XA.component.search.vent#hashChanged
             * @param {Object} params parameter from url
             */
            checkUrl: function (params) {
                //If there are any maps on the page
                if (XA.component.map.getSignatures().length > 0) {
                    //Add g signature to hash if doesn't already exists
                    var hash = window.location.hash;
                    _.each(XA.component.map.getSignatures(),
                        function(sig) {
                            var signature = sig !== "" ? sig + "_g" : "g";

                            if (!hash.includes(signature)) {
                                hash = hash + "&" + signature + "=true";
                            }
                        });
                    window.location.hash = this.fixHash(hash);
                }

                var hashObj = queryModel.parseHashParameters(window.location.hash);

                XA.component.search.service.getData();

                if (!hashObj) {
                    XA.component.search.facet.data.getInitialFacetData();
                    XA.component.search.vent.trigger("hashChanged", hashObj);
                } else {
                    if (JSON.stringify(hashObj) !== JSON.stringify(lastHashObj)) {
                        XA.component.search.facet.data.filterFacetData(hashObj);
                        lastHashObj = hashObj;
                        XA.component.search.vent.trigger("hashChanged", hashObj);
                    }
                }
            }
        });
    /**
    * Creates instance of Backbone Router and start
    * backbone history
    * @memberOf module:searchRouter
    * @alias module:searchRouter.init
    */
    api.init = function () {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }

        queryModel = XA.component.search.query;

        var router = new Router();

        if (!Backbone.History.started) {
            Backbone.history.start();
        }

        initialized = true;
    };

    return api;

}(jQuery, document));

XA.register('customSearchRouter', XA.component.search.router);
