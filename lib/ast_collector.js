var _ = require('lodash');
var optionsUtils = require('./options');

exports.ASTCollector = ASTCollector;

function ASTCollector(options)
{
	this.options = optionsUtils.extend(options);
}

_.extend(ASTCollector.prototype,
{
	collect: function(ast)
	{
		var collect =
		{
			defineFunctionArgAst: [],
			i18nHanlderAst: [],
			i18nArgs: []
		};

		collect.translateWordAsts = this.scan(collect, ast) || [];

		return collect;
	},

	warpTxt2caller: function(txt)
	{
		return {
			__skip_property__: true,
			"type": "CallExpression",
			"callee":
			{
				"type": "Identifier",
				"name": this.options.handlerName
			},
			"arguments": [this.warpTxt(txt)]
		};
	},

	warpTxt: function(txt)
	{
		return {
			__skip_property__: true,
			"type": "Literal",
			"value": txt
		};
	},

	// 将文本结构体整理成ast的数组
	txtarr: function(arr)
	{
		if (!arr || !arr.length) return;

		var firstValue;
		var isFirstTranslateWord;
		var nextValue;
		var endIndex = -1;

		arr.some(function(item, index)
		{
			if (!item || !item.value) return;

			if (!firstValue)
			{
				firstValue = item.value;
				isFirstTranslateWord = item.translateWord;
			}
			else if (!nextValue)
			{
				if (item.translateWord == isFirstTranslateWord)
				{
					firstValue += item.value;
				}
				else
				{
					nextValue = item.value;
				}
			}
			else
			{
				if (item.translateWord == isFirstTranslateWord)
				{
					endIndex = index;
					return true;
				}
				else
				{
					nextValue += item.value;
				}
			}
		});

		if (!firstValue) return;

		var result = [];
		result.push(isFirstTranslateWord ? this.warpTxt2caller(firstValue) : this.warpTxt(firstValue));
		if (!nextValue) return result;

		result.push(isFirstTranslateWord ? this.warpTxt(nextValue) : this.warpTxt2caller(nextValue));

		var children = endIndex != -1 && this.txtarr(arr.slice(endIndex));
		if (children) result = result.concat(children);

		return result;
	},

	// 将Txtarr结果，加上“+”运算
	wrapTxtarr: function(arr)
	{
		if (!arr || !arr.length) return;
		if (arr.length == 1) return arr[0];


		// var result = arr.pop();
		// for(var i = arr.length; i--;)
		// {
		//     result =
		//     {
		//         "type": "BinaryExpression",
		//         "operator": "+",
		//         "left": arr[i],
		//         "right": result
		//     }
		// }

		var result = arr.shift();
		arr.forEach(function(item)
		{
			result =
			{
				__skip_property__: true,
				"type": "BinaryExpression",
				"operator": "+",
				"left": result,
				"right": item
			}
		});

		return result;
	},

	scan: function(collect, ast, parent, itemName)
	{
		if (!ast || ast.__skip_property__) return;
		var self = this;


		// 定义I18N
		if (ast.type == 'FunctionDeclaration'
			&& ast.id && ast.id.name == self.options.handlerName)
		{
			collect.i18nHanlderAst.push(ast);
			return;
		}

		// 如果发现define函数，就留心一下，可能要插入I18N函数
		if (ast.type == 'CallExpression'
			&& ast.callee && ast.callee.name == 'define')
		{
			ast.arguments.some(function(item)
			{
				if (item.type == 'FunctionExpression')
				{
					collect.defineFunctionArgAst.push(item);
					return true;
				}
			});
		}

		// 调用I18N
		if (ast.type == 'CallExpression'
			&& ast.callee.name == self.options.handlerName)
		{
			collect.i18nArgs.push(ast.arguments);
			return;
		}

		if (ast.type == 'Literal')
		{
			var ret = self.dealLiteral(ast, parent, itemName);
			return ret && [ret];
		}


		var result = [];
		_.each(ast, function(item, ast_key)
		{
			if (Array.isArray(item))
			{
				var isObjectProperty = ast.type == 'ObjectExpression' && ast_key == 'properties';
				var result2 = item.map(function(ast2, index)
					{
						var ret = self.scan(collect, ast2, item, index);
						if (isObjectProperty && ast2.key.__i18n_replace_info__)
						{
							throw new Error("[I18N Func Replacer] Object property can't use i18n. <e.g.> obj={'中文':'cn'}");
						}
						return ret;
					})
					.filter(function(v, index){return v});

				if (result2.length) result = result.concat.apply(result, result2);
			}
			else if (typeof item == 'object')
			{
				var result2 = self.scan(collect, item, ast, ast_key);
				if (result2) result = result.concat(result2);
			}
		});

		if (result.length) return result;
	},

	dealLiteral: function(ast, parent, itemName)
	{
		var value = ast.value;
		// case 有可能不是string
		if (!value || typeof value != 'string') return;

		// 正则说明
		// 必须要有非accii之外的祝福（当作是中文）
		// 同时包含非html标签的其他字符
		var splitTranslateWordArr = value.split(this.options.cutWordReg);
		if (splitTranslateWordArr.length < 2) return;


		var translateWords = value.match(this.options.cutWordReg);
		var dealArr = [];
		// translateWords 必然比splitTranslateWordArr少一个
		translateWords.forEach(function(val, index)
		{
			dealArr.push(
				{translateWord: false, value: splitTranslateWordArr[index]},
				{translateWord: true, value: val}
			);
		});

		dealArr.push({translateWord: false, value: splitTranslateWordArr.pop()});

		var result = this.wrapTxtarr(this.txtarr(dealArr));
		if (result)
		{
			ast.__i18n_replace_info__ =
			{
				parent			: parent,
				itemName		: itemName,
				newAst			: result,
				translateWords	: translateWords
			};

			return ast;
		}
	}
});