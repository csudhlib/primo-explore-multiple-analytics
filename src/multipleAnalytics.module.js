angular.module('multipleAnalytics', []);
angular.module('multipleAnalytics').run(function ($rootScope, $interval, analyticsOptions) {
	if(analyticsOptions.hasOwnProperty("enabled") && analyticsOptions.enabled) {
		if(analyticsOptions.hasOwnProperty("siteSource") && analyticsOptions.hasOwnProperty("siteId") && analyticsOptions.siteId != '') {
			if(analyticsOptions.siteSource === 'ga') {
				if(typeof ga === 'undefined') {
					(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
					(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
					m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
					})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

					ga('create', analyticsOptions.siteId, {'alwaysSendReferrer': true});
					ga('set', 'anonymizeIp', true);
				}
			} else if(analyticsOptions.siteSource === 'matomo') {
				if(analyticsOptions.hasOwnProperty("siteUrl") && analyticsOptions.siteUrl != '') {
					if(typeof _paq === 'undefined') {
						window['_paq'] = [];
						_paq.push(["setDomains", ["*.csudh-primo.hosted.exlibrisgroup.com/"]]);
						_paq.push(["setDoNotTrack", true]);
						(function() {
							_paq.push(['setTrackerUrl', analyticsOptions.siteUrl+'piwik.php']);
							_paq.push(['setSiteId', analyticsOptions.siteId]);
							var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
							g.type='text/javascript'; g.async=true; g.defer=true; g.src=analyticsOptions.siteUrl+'piwik.js'; s.parentNode.insertBefore(g,s);
						})();
					}
				}
			}
		}
		$rootScope.$on('$locationChangeSuccess', function (event, toState, fromState) {
			if(analyticsOptions.hasOwnProperty("siteSource") && analyticsOptions.hasOwnProperty("defaultTitle")) {
				var documentTitle = analyticsOptions.defaultTitle;
				var timerStart = Date.now();
				var interval = $interval(function () {
					if(document.title !== '') documentTitle = document.title;
					if (window.location.pathname.indexOf('openurl') !== -1 || window.location.pathname.indexOf('fulldisplay') !== -1)
						if (angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).length === 0) return;
						else documentTitle = angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).text();
					
					if(analyticsOptions.siteSource === 'ga') {
						if(typeof ga !== 'undefined') {
							if(fromState != toState) ga('set', 'referrer', fromState);
							ga('set', 'location', toState);
							ga('set', 'title', documentTitle);
							ga('send', 'pageview');
						}
					} else if(analyticsOptions.siteSource === 'matomo') {
						if(typeof _paq !== 'undefined') {
							if(fromState != toState) _paq.push(['setReferrerUrl', fromState]);
							_paq.push(['setCustomUrl', toState]);
							_paq.push(['setDocumentTitle', documentTitle]);
							_paq.push(['setGenerationTimeMs', Date.now()-timerStart]);
							_paq.push(['enableLinkTracking']);
							_paq.push(['enableHeartBeatTimer']);
							_paq.push(['trackPageView']);
						}
					}
					$interval.cancel(interval);
				}, 0);
			}
		});
	}
});
angular.module('multipleAnalytics').value('analyticsOptions', {
	enabled: true,
	siteSource: '',
	siteId: '',
	siteUrl: '',
	defaultTitle: ''
});