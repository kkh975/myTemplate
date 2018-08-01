if ( window == undefined ) throw ReferenceError('browser 환경에서 실행되어야 합니다.');
// if ( $ == undefined || $ instanceof jQuery ) throw ReferenceError('jQuery가 먼저 선언되어야 합니다.');

var DATEPICKER_BASE_OPT = {
    monthNamesShort : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNamesMin: ['일','월','화','수','목','금','토'],
    dateFormat:'yyyy.mm.dd',
    changeMonth: true,
    changeYear: true,
    buttonImageOnly: false,
    showButtonPanel : true,
    closeText : '닫기',
    currentText : '오늘',
    nextText : '>',
    prevText: '<',
    yearRange: '1900:2100'
};

/**
 * input 달력 공통
 */
function datepickerUiSet() {
    $('.input.datepicker')
        .datepicker(DATEPICKER_BASE_OPT)
        .next('.to_datepicker').on('click', function(e) {
            $(this).prev().datepicker('open');
        });
}

/**
 * 브라우저 환경 설정 - javascript용
 * @return {String} ie11 이하는 'ie ie+N', ie11 이상은 'ie'
 */
function getEnvAndUiSet() {
	return (function(){
		var info = window.navigator.userAgent.match(/(?:\bMSIE\b|\bTrident\b)\s(\d{1,2})/);

		if (info) {
			var $_top = document.querySelectorAll('body');
			var cn = $_top[0].className;

			if (cn.indexOf('ie') == -1) {
				$_top[0].className += cn.length == 0 ? 'ie' : ' ie';
				if (info[0].indexOf('MSIE') > -1) {
					$_top[0].className += ' ie'+ info[1];
					return 'ie'+ info[1];
				}

				return 'ie';
			}
		}

		return '';
	})();
}

/**
 * 브라우저 환경 설정
 * @return {String} ie11 이하는 'ie+N', ie11 이상은 'ie'
 */
function getEnv() {
    return (function(){
		var info = window.navigator.userAgent.match(/(?:\bMSIE\b|\bTrident\b)\s(\d{1,2})/);

		if (info) return info[0].indexOf('MSIE') > -1 ? 'ie ie'+ info[1] : 'ie';
		return '';
    })();
}

/**
 * body에 현재 실행환경 셋팅
 */
function envUiSet() {
    $('body').addClass(envCheck());
}

function init() {
	envUiSet();
	datepickerUiSet();
}

if (document.attachEvent) {
	document.attachEvent('DOMContentLoaded', init);	
} else {
	document.addEventListener('DOMContentLoaded', init);
}

envCheck();