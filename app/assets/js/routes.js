(function () {

	var routes = {};
	var defaultRoute = "landing";

	routes['landing'] = {
		url: '#/',
		templateUrl: 'modules/landing/landing.html'
	};

	routes['dashboard'] = {
		url: '#/dashboard',
		templateUrl: 'modules/dashboard/dashboard.html'
	}

	routes['domains'] = {
		url: '#/domains',
		templateUrl: 'modules/domains/domains.html'
	}

	$.router.setData(routes).setDefault(defaultRoute);

	$.when($.ready).then(function() {
		$.router.run('.main-content');
	})

	$.router.onRouteBeforeChange(function(e, route, params){

        firebase.auth().onAuthStateChanged(function(user){
            if(!user && route.protected) {
                $.router.go('landing', {});
            }
        });

        var x = route.url.replace('#/', '');
        var count = x.replace(/[^/]/g, "").length;
        if(count > 0) {
            var location = x.substr(0, x.indexOf('/'));
        } else {
            var location = x;
        }
        $("script[moduleLoader]").remove();
        var scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        if(location) {
            scriptTag.src = 'modules/'+location+'/'+location+'.js';
        } else {
            scriptTag.src = '';
        }
        document.body.appendChild(scriptTag);
        $(scriptTag).attr('moduleLoader', '');

        e.stopImmediatePropagation();

    });

	$.router.onViewChange(function(e, viewRoute, route, params){
		$(".location").html(capitalize(route.name));
	})

	function capitalize(string) {
		return string.toLowerCase().replace(/\b[a-z]/g, function(letter){
			return letter.toUpperCase();
		});
	}

}());