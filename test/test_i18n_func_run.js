var expect = require('expect.js');

describe('#i18n_func_run', function()
{
	describe('#full', function()
	{
		var I18N = require('./files/i18n_handler_example');

		describe('#lan:en-US', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'en-US';
			});

			it('#no msg', function()
			{
				expect(I18N()).to.be('undefined');
			});

			it('#number', function()
			{
				expect(I18N(11)).to.be('11');
			});

			it('#not match', function()
			{
				expect(I18N('not match')).to.be('not match');
			});

			it('#match default', function()
			{
				expect(I18N('简体')).to.be('simplified');
			});

			it('#match empty', function()
			{
				expect(I18N('空白')).to.be('');
				expect(I18N('无')).to.be('无');
			});

			it('#match subtype', function()
			{
				expect(I18N('简体', 'subtype')).to.be('simplified subtype');
			});

			it('#no has subtype', function()
			{
				expect(I18N('简体', 'not existed subtype')).to.be('simplified');
			});
		});


		describe('#lan:zh-CN', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'zh-CN';
			});

			it('#match default', function()
			{
				expect(I18N('简体')).to.be('简体');
			});

			it('#match subtype', function()
			{
				expect(I18N('简体', 'subtype')).to.be('简体');
			});
		});


		describe('#lan:zh-CN,en-US', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'zh-CN,en-US';
			});

			it('#match default', function()
			{
				expect(I18N('简体')).to.be('simplified');
			});

			it('#match subtype', function()
			{
				expect(I18N('简体', 'subtype')).to.be('simplified subtype');
			});
		});

		describe('#lan:zh-TW,en-US', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'zh-TW,en-US';
			});

			it('#match default', function()
			{
				expect(I18N('简体')).to.be('簡體');
			});

			it('#match subtype', function()
			{
				expect(I18N('简体', 'subtype')).to.be('simplified subtype');
			});
		});

		describe('#tpldata', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'en-US';
			});

			it('#key %s', function()
			{
				expect(I18N('美好%s生活', [1])).to.be('美好1生活');
				expect(I18N('美好%s生活', [1,2])).to.be('美好1生活');
				expect(I18N('%s美好%s生活', [1,2])).to.be('1good2 life');
				expect(I18N('%s美好%s生活', [1])).to.be('1good life');
			});

			it('#key %{}', function()
			{
				expect(I18N('%{中文}词典', ['English'])).to.be('English dictionary');
				expect(I18N('%{{中文}}词典', [1])).to.be('1}词典');
			});

		});
	});



	describe('#simple', function()
	{
		var I18N = require('./files/i18n_handler_simple_example');

		describe('#lan:en-US', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'en-US';
			});

			it('#no msg', function()
			{
				expect(I18N()).to.be('undefined');
			});

			it('#number', function()
			{
				expect(I18N(11)).to.be('11');
			});

			it('#not match', function()
			{
				expect(I18N('not match')).to.be('not match');
			});

			it('#match default', function()
			{
				expect(I18N('简体')).to.be('简体');
			});

			it('#match empty', function()
			{
				expect(I18N('空白')).to.be('空白');
				expect(I18N('无')).to.be('无');
			});

			it('#match subtype', function()
			{
				expect(I18N('简体', 'subtype')).to.be('简体');
			});

			it('#no has subtype', function()
			{
				expect(I18N('简体', 'not existed subtype')).to.be('简体');
			});
		});

		describe('#tpldata', function()
		{
			beforeEach(function()
			{
				global.__i18n_lan__ = 'en-US';
			});

			it('#key %s', function()
			{
				expect(I18N('美好%s生活', [1])).to.be('美好1生活');
				expect(I18N('美好%s生活', [1,2])).to.be('美好1生活');
				expect(I18N('%s美好%s生活', [1,2])).to.be('1美好2生活');
				expect(I18N('%s美好%s生活', [1])).to.be('1美好生活');
			});

			it('#key %{}', function()
			{
				expect(I18N('%{中文}词典', ['English'])).to.be('English词典');
				expect(I18N('%{{中文}}词典', [1])).to.be('1}词典');
			});

		});
	});

});