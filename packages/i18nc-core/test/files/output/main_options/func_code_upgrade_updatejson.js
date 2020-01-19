module.exports = function I18N(msg, tpldata, subkey) {
	if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

	var self = I18N,
		data = self.$ || (self.$ = {}),
		translateJSON,
		replace_index = 0,
		options = {},
		lanIndexArr,
		i,
		lanIndex,
		msgResult,
		translateValues;

	if (!tpldata || !tpldata.join) {
		subkey = tpldata;
		tpldata = [];
	}

	if (subkey && typeof subkey == 'object') {
		options = subkey;
		subkey = options.subkey;
	}

	var LAN = options.language || (function(){return global.__i18n_lan__})(data);

	if (LAN && LAN.split) {
		if (self.L != LAN) {
			self.K = 'i18n_handler_example';
			self.V = 'Kf';
			self.D = {
				"$": [
					"en-US",
					"zh-TW"
				],
				"*": {
					"简体": [
						"simplified",
						"簡體"
					],
					"空白": [
						[]
					],
					"无": [
						"",
						"無"
					],
					"%s美好%s生活": [
						"%sgood%s life"
					],
					"%{中文}词典": [
						"%{Chinese} dictionary"
					]
				},
				"subkey": {
					"简体": [
						"simplified subkey"
					]
				}
			};
			translateJSON = self.D;

			var dblans = translateJSON.$ || [],
				dblansMap = {},
				lanKeys = LAN.split(',');
			lanIndexArr = self.M = [];

			for (i = dblans.length; i--; ) dblansMap[dblans[i]] = i;

			for (i = lanKeys.length; i--; ) {
				lanIndex = dblansMap[lanKeys[i]];
				if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
			}
			self.L = LAN;
		}

		lanIndexArr = self.M;
		translateJSON = self.D;
		var _getVaule = function(subkey) {
			translateValues =
				translateJSON[subkey] && translateJSON[subkey][msg];
			if (translateValues) {
				msgResult = translateValues[lanIndex];
				if (typeof msgResult == 'number')
					msgResult = translateValues[msgResult];
			}
		};
		for (i = lanIndexArr.length; !msgResult && i--; ) {
			lanIndex = lanIndexArr[i];
			if (subkey) _getVaule(subkey);
			if (!msgResult) _getVaule('*');
		}

		if (msgResult) msg = msgResult;
	}

	msg += '';
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg
		.replace(/%\{(\d+)\}/g, function(all, index) {
			var newVal = tpldata[+index];
			return newVal === undefined ? '' : newVal;
		})
		.replace(/%s|%p|%\{.+?\}/g, function() {
			var newVal = tpldata[replace_index++];
			return newVal === undefined ? '' : newVal;
		});
}
