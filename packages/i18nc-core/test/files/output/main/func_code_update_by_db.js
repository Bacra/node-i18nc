module.exports = function code() {
				println(I18N('简体'), I18N);
				function I18N() {
					const self = I18N;
					self.__FILE_KEY__ = 'default_file_key';
					self.__FUNCTION_VERSION__ = 'L';
					self.__TRANSLATE_JSON__ = {
						'$': ['zh-TW'],
						'*': { '简体': ['簡體'] }
					};
				}
			}
