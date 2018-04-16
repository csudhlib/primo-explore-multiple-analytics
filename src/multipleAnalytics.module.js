angular.module('multipleAnalytics', []);
angular.module('multipleAnalytics').run(function ($rootScope, $interval, analyticsOptions, analyticsOptionsDefault) {
    this.enabled = analyticsOptions.hasOwnProperty("enabled") ? analyticsOptions.enabled : analyticsOptionsDefault.enabled;
    this.siteSource = analyticsOptions.hasOwnProperty("siteSource") ? analyticsOptions.siteSource : analyticsOptionsDefault.siteSource;
    this.siteId = analyticsOptions.hasOwnProperty("siteId") ? analyticsOptions.siteId : analyticsOptionsDefault.siteId;
    this.siteUrl = analyticsOptions.hasOwnProperty("siteUrl") ? analyticsOptions.siteUrl : analyticsOptionsDefault.siteUrl;
    this.defaultTitle = analyticsOptions.hasOwnProperty("defaultTitle") ? analyticsOptions.defaultTitle : analyticsOptionsDefault.defaultTitle;
	if(this.enabled) {
		if(this.siteId != '') {
			if(this.siteSource === 'ga') {
				if(typeof ga === 'undefined') {
					(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
					(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
					m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
					})(window,document,'script',this.siteUrl,'ga');

					ga('create', this.siteId, {'alwaysSendReferrer': true});
					ga('set', 'anonymizeIp', true);
				}
			} else if(this.siteSource === 'matomo') {
				if(this.siteUrl != '') {
					if(typeof _paq === 'undefined') {
						window['_paq'] = [];
						_paq.push(["setDomains", ["*.csudh-primo.hosted.exlibrisgroup.com/"]]);
						_paq.push(["setDoNotTrack", true]);
						(function() {
							_paq.push(['setTrackerUrl', this.siteUrl+'piwik.php']);
							_paq.push(['setSiteId', this.siteId]);
							var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
							g.type='text/javascript'; g.async=true; g.defer=true; g.src=this.siteUrl+'piwik.js'; s.parentNode.insertBefore(g,s);
						})();
					}
				}
			}
		}
		$rootScope.$on('$locationChangeSuccess', function (event, toState, fromState) {
			if(this.siteSource != '') {
				var documentTitle = this.defaultTitle;
				var timerStart = Date.now();
				var interval = $interval(function () {
					if(document.title !== '') documentTitle = document.title;
					if (window.location.pathname.indexOf('openurl') !== -1 || window.location.pathname.indexOf('fulldisplay') !== -1)
						if (angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).length === 0) return;
						else documentTitle = angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).text();
					
					if(this.siteSource === 'ga') {
						if(typeof ga !== 'undefined') {
							if(fromState != toState) ga('set', 'referrer', fromState);
							ga('set', 'location', toState);
							ga('set', 'title', documentTitle);
							ga('send', 'pageview');
						}
					} else if(this.siteSource === 'matomo') {
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
angular.module('multipleAnalytics').value('analyticsOptions', {}).value('analyticsOptionsDefault', {
	enabled: false,
	siteSource: '',
	siteId: '',
	siteUrl: 'https://www.google-analytics.com/analytics.js',
	defaultTitle: 'Discovery Search'
});