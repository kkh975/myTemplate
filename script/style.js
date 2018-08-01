

/**
 * 설계를 어떻게 가지고 갈것인가?
 *
 * 많이 쓰는 것은?
 * 
 */


/**
 * 스타일 객체 제어
 * @param  {[type]} style    [description]
 * @param  {[type]} selector [description]
 * @param  {[type]} rule     [description]
 * @return {[type]}          [description]
 */
var styleCtr = function(style, selector, rule) {
	if (style && Object.prototype.toString.call(style, null) != "[object HTMLStyleElement]") throw ReferenceError('첫번쨰 파라미터는 style 객체이어야 합니다.');
	if (!style) {
		style = document.createElement("style");
		document.getElmentsByTagName("head")[0].appendChild(style);
	}

	this.sheet = style.styleSheet || style.sheet;
	this.ruleset = sheet.cssRules || sheet.rules;


	var prefix, prefixTarget;

	// 브라우저 감지를 통한 prefix 확정, 감지는 알아서들 구현=.=;
	prefix = detect == "ie" ? 'ms' : detect == "firefox" ? 'Moz' : detect == "wekit" ? 'webkit' : '';

	prefixTarget = {
		transform:1,transform-origin:1,transform-style:1,
		transition:1,transition-property:1,transition-duration:1,
		transition-timing-function:1,transition-delay:1,
		animation-name:1,animation-duration:1,animation-timing-function:1,
		animation-iteration-count:1,
		animation-direction:1,animation-play-state:1,animation-delay:1,
		text-shadow:1,box-shadow:1,box-sizing:1,
		border-radius:1,border-top-left-radius:1,border-top-right-radius:1,
		border-bottom-left-radius:1,border-bottom-right-radius:1,
		border-image:1,border-image-source:1,border-image-slice:1,
		border-image-width:1,border-image-outset:1,border-image-repeat:1
	};
};

/**
 * rule에 정의된 인덱스 가지고오기
 * @param  {DOM} $_sel 선택자
 * @return {Number} 없으면 -1
 */
styleCtr.prototype.getIndexRule = function( $_sel ){
	if (Object.prototype.toString.call($_sel, null) != "[object HTMLDivElement]") throw ReferenceError("첫번쨰 파라미터는 DOM 객체이어야 합니다.")
	
	// 앞에서 검색, 뒤에서 검색
	for (var k, i=0, len=this.ruleset.length; i<len; i++)
		if (this.ruleset[k = i].selectorText.toLowerCase() == $_sel || 
				this.ruleset[k = len - i - 1].selectorText.toLowerCase() == $_sel) return k;
	
	return -1;
};

/**
 * [addRule description]
 * @param {[type]} $_sel [description]
 */
styleCtr.prototype.addRule = function( $_sel ) {
	if (this.sheet.insertRule) this.sheet.insertRule($);
	else this.sheet.addRule( );
};

/**
 * [removeRule description]
 * @param  {[type]} $_sel [description]
 */
styleCtr.prototype.removeRule = function( $_sel ) {
	var idx = this.getIndexRule($_sel);

	if (idx > -1) {
		if (this.sheet.deleteRule) this.sheet.deleteRule(idx);
		else this.sheet.removeRule(idx);
	}
};

styleCtr.prototype.set = function( props, val ) {
	if (props == 'opacity' && IE) {
		if (isNaN(val)) throw ReferenceError('opacity 설정시 두번째 파라미터는 숫자이어야 합니다.')
		return this.style['filter'] = "alpha(opacity=" + parseInt( val * 100 ) + ")";
	}

	if (prefixTarget[props]) props = prefix + props.charAt(0).toUppperCase() + props.substr(1);

	this.style[props] = val;
};