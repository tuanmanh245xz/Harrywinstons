XA.component.search.router=function(n){"use strict";var t={},i,r=!1,u,f;return f=Backbone.Router.extend({routes:{"*params":"checkUrl"},fixHash:function(n){var t;return n=n.replace(/[#]/g,"&"),t=n.indexOf("&"),n.substr(0,t)+"#"+n.substr(t+1)},checkUrl:function(){var t,n;XA.component.map.getSignatures().length>0&&(t=window.location.hash,_.each(XA.component.map.getSignatures(),function(n){var i=n!==""?n+"_g":"g";t.includes(i)||(t=t+"&"+i+"=true")}),window.location.hash=this.fixHash(t));n=i.parseHashParameters(window.location.hash);XA.component.search.service.getData();n?JSON.stringify(n)!==JSON.stringify(u)&&(XA.component.search.facet.data.filterFacetData(n),u=n,XA.component.search.vent.trigger("hashChanged",n)):(XA.component.search.facet.data.getInitialFacetData(),XA.component.search.vent.trigger("hashChanged",n))}}),t.init=function(){if(!n("body").hasClass("on-page-editor")&&!r){i=XA.component.search.query;var t=new f;Backbone.History.started||Backbone.history.start();r=!0}},t}(jQuery,document);XA.register("customSearchRouter",XA.component.search.router)