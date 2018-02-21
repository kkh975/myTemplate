function hasCssProperty() {	
}

/*
 * @TODO
 */
function autoPrefixer(target, pickProperty) {
	var NAMES = ['-webkit-', '-moz', '-ms-'];

	var Property = ['keyframes', 'animation', 'transition', 'transform', ]

	var styles = Array.prototype.slice.apply(document.styleSheets);

	while(style = styles.shift()) {
		try {
			rules = Array.prototype.slice.apply(style.cssRules || style.rules);	
		} catch (err) {
			continue;
		}

		while(rule = rules.shift()) {
		}
	}
}

/*
 * @param: {String} [Required]
 * @param: {String|Json} [Required]
 * @param: {DOM|jQuery} [Optional] 
 */
function installCssAnimate(name, rules, target) {
	var NAMES = ['@keyframes', '@-webkit-keyframes'];
	var sheet;

	if (!target) {
		var $_doc = document.createElement('style');

		document.body.appendChild($_doc);
		sheet = $_doc.sheet;
	} else {
		if (target instanceof jQuery) {
			target = target.toArray()
		} else {
			target = Array.prototype.slice.apply(target)
		}

		// Node-Sheets 매칭
		for (var i = styles.length - 1, tmpStyles = []; i >= 0; i--) {
			for (var j = target.length - 1; j >= 0; j--) {
				if (styles[ i ].ownerNode == target[ j ]) {
					tmpStyles.push( styles[ i ] )
					break;
				}
			}
		}

		styles = tmpStyles;
	}

	if (typeof rules == 'string') {
		for (var i = NAMES.length - 1; i >= 0; i--) {
			var new_rule = NAMES[i] + ' ' + name + '{' + rules + '}';
			target.insertRule(new_rule, target.rules.length);
		}
	} else {
		// JSON > CSS Rule 형태로 변경
		var new_rules = '';

		for (var speed in rules) {
			new_rules += (speed + '{'); // 시작

			// 각 개별룰 적용
			for (var inrule in rules[ speed ]) {
				new_rules += (inrule + ':' + rules[ speed ][ inrule ] + ';')
			}

			new_rules += '}'; // 종료
		}

		// 내용 적용
		for (var i = NAMES.length - 1; i >= 0; i--) {
			var new_rule = NAMES[i] + ' ' + name + '{' + new_rules + '}';
			sheet.insertRule(new_rule, sheet.rules.length);
		}
	}
}

/*
 * @param: {Function} [Required]
 * @param: {String-Array} [Optional] 타이틀 이름
 * @param: {String-Array} [Optional] 

 * @TODO: IE8 Array.prototype 오류
 * @TODO: 삼중 루프 개선안 찾기
 * @TODO: 제외 목록 및 포함 목록 적용
 */
function convertStylePxToElse(engine, targetStyleSheets, speicalSelector) {
	var styles = []
	var style_idx = 0, rule_idx = 0;
	var style, rules, rule;

	if (!speicalSelector){
		speicalSelector = [];
	}

	// style 모으기
	styles = Array.prototype.slice.apply(document.styleSheets)

	if (targetStyleSheets) {
		if (targetStyleSheets instanceof jQuery) {
			targetStyleSheets = targetStyleSheets.toArray()
		} else {
			targetStyleSheets = Array.prototype.slice.apply(targetStyleSheets)
		}

		// Node-Sheets 매칭
		for (var i = styles.length - 1, tmpStyles = []; i >= 0; i--) {
			for (var j = targetStyleSheets.length - 1; j >= 0; j--) {
				if (styles[ i ].ownerNode == targetStyleSheets[ j ]) {
					tmpStyles.push( styles[ i ] )
					break;
				}
			}
		}

		styles = tmpStyles;
	}

	while(style = styles.shift()) {
		try {
			rules = Array.prototype.slice.apply(style.cssRules || style.rules);	
		} catch (err) {
			continue;
		}

		// 스타일 내 rule 돌기
		while(rule = rules.shift()) {
			// TODO: rule 일치/비일치 여부
			if (!speicalSelector.has(rule.selectorText)) {
				continue;
			}

			for (var styleKey in rule.style) {
				var value = rule.style[styleKey];

				if (typeof value == 'string') {
					var revalue = value.replace(/(\d*px)/gi, function(match){
						return engine(parseInt(match.substring(-2,2), 10));
					});

					rule.style[styleKey] = revalue;
				}
			}

			rule_idx++;
		}

		style_idx++;
		rule_idx = 0;
	}
}

/*
 * @param: {Number} [Required] 
 * @param: {Number} [Required]
 * @param: {DOM|jQuery} [Optional]
 * @param: {String-Array} [Optional] 
 */
function convertStylePxToRem(perpective, base, targetStyleSheets, speicalSelector) {
	convertStylePxToElse( function( pxNum ){
		return ((pxNum / perpective) / base).toFixed(2) + 'rem'
	}, targetStyleSheets, speicalSelector)
}


/*
 * TODO... working
 * @param: {Number} [Required] 
 * @param: {Number} [Required]
 * @param: {Dom|jQuery} [Optional] 
 * @param: {String-Array} [Optional] 
 * 
 * @TODO: 미작성
 * @TODO: 효율화 방안 찾기
 */
function convertStylePxToPercent(perpective, base, target, rules) {	
	var styles = [], style, rules, rule;
	var style_idx = 0, rule_idx = 0;

	if (!rules){
		rules = [];
	}

	// style 모으기
	if (target) {
		if (target instanceof jQuery) {
			target = target.toArray()
		} else {
			target = Array.prototype.slice.apply(target)
		}

		// Node-Sheets 매칭
		for (var i = styles.length - 1, tmpStyles = []; i >= 0; i--) {
			for (var j = target.length - 1; j >= 0; j--) {
				if (styles[ i ].ownerNode == target[ j ]) {
					tmpStyles.push( styles[ i ] )
					break;
				}
			}
		}

		styles = tmpStyles;
	}

	// child중 계산 대상 찾기
	while(style = styles.shift()) {
		if (style.cssRules || style.rules) {
			rules = Array.prototype.slice.apply(style.cssRules || style.rules);

			// 스타일 내 rule 돌기
			while(rule = rules.shift()) {
				// rule 일치/비일치 여부
				if (rule.cssText.indexOf(/(position\s+:\s+[absolute]|[top|bottom|left|right|width|height]+\n+px)/gi) > -1) {
					basket.push(rule.selector)
				} 

				rule_idx++;
			}
		}

		style_idx++
	}

	// 계산 대상의 부모 찾기
	while(rule = basket.shift()) {
		var $this = $(rule.cssRules),
			$parents = $this.parents();

		switch($parents().css('position')) {
			case 'relative':
				break;
			case 'absolute':
				break;
			case 'fixed':
				break;
			case '': // TODO, body or html 태그가 최종
				break;
			default: 
				break;
		}


	}
}
