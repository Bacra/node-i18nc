module.exports = function code()
{


	/* eslint-disable */
	function oldI18N(msg, tpldata, subtype)
	{
		var self = oldI18N;
		var data = self.$ || (self.$ = {});
		var LAN = (function(cache)
		{
			if (!cache.global)
			{
				cache.global = (typeof window == 'object' && window)
					|| (typeof global == 'object' && global)
					|| {};
			}
	
			return cache.global.__i18n_lan__;
		})(data);
		if (!tpldata || !tpldata.join)
		{
			subtype = tpldata;
			tpldata = [];
		}

		if (LAN && LAN.split)
		{
			var lanArr, i, len, lanItem;
			if (self.L != LAN)
			{
			
			
			
				self.K = '*';
				self.V = 'b';
				self.D = {
					'en-US': {
						'DEFAULTS': {
							// '中':
							'<e.g.> translate word': null
						}
					}
				};
			
			

				var __TRANSLATE_JSON__ = self.D;
				var lanKeys = LAN.split(',');
				lanArr = self.M = [];
				for(i = 0, len = lanKeys.length; i < len; i++)
				{
					lanItem = __TRANSLATE_JSON__[lanKeys[i]];
					if (lanItem) lanArr.push(lanItem);
				}
			
				self.L = LAN;
			}

			lanArr = self.M;
			var resultDefault, resultSubject, allsubtypes, alldefaults, subtypeJSON;
			for(i = 0, len = lanArr.length; i < len; i++)
			{
				lanItem = lanArr[i];
				if (subtype)
				{
					allsubtypes = lanItem.SUBTYPES;
					subtypeJSON = allsubtypes && allsubtypes[subtype];
					resultSubject = subtypeJSON && subtypeJSON[msg];
					if (resultSubject) break;
				}
			
				if (!resultDefault)
				{
					alldefaults = lanItem.DEFAULTS;
					resultDefault = alldefaults && alldefaults[msg];
				}
			}

			if (resultSubject) msg = resultSubject;
			else if (resultDefault) msg = resultDefault;
		}

	
		if (!tpldata.length) return ''+msg;

		var replace_index = 0;
		return (''+msg).replace(/(%s)|(%\{(.+?)\})/g, function(all)
		{
			var newVal = tpldata[replace_index++];
			return newVal === undefined || newVal === null ? all : newVal;
		});
	}
	/* eslint-enable */



	var word = oldI18N('中') + '文';
	consol.log(word, oldI18N('中') + '文2');
}