module.exports = I18N;
function I18N(g,f,i){
	var a=I18N;if(!a.data)a.data={};var d=(function(){return global.__i18n_lan__})(a.data);if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='i18n_handler_example';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
		"en-US": {
			"DEFAULTS": {
				"简体": "simplified",
				"空白": [],
				"无": "",
				"%s美好%s生活": "%sgood%s life",
				"%{中文}词典": "%{Chinese} dictionary"
			},
			"SUBKEYS": {
				"subkey": {
					"简体": "simplified subkey"
				}
			}
		},
		"zh-TW": {
			"DEFAULTS": {
				"简体": "簡體",
				"无": "無"
			}
		}
	};
	var o=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,h=j.length;b<h;b++){var c=o[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,h=e.length;b<h;b++){var c=e[b];var m=i&&c.SUBKEYS&&c.SUBKEYS[i];l=m&&m[g];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[g]}var n=l||k;if(n)g=n}if(!f.length)return''+g;var p=0;return(''+g).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[p++];return a===undefined||a===null?b:a})
}
