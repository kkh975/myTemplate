
/**
 * 버젼별 클래스 추가
 * @return 
 */
function envCheck() {
	var info = window.navigator.userAgent.match(/(?:\bMSIE\b|\bTrident\b)\s(\d{1,2})/);

	if (info) {
		var $_top = document.querySelectorAll('body');
		var cn = $_top[0].className;

		if (cn.indexOf('ie') == -1) {
			$_top[0].className += cn.length == 0 ? 'ie' : ' ie';
			if (info[0].indexOf('MSIE') > -1) 
				$_top[0].className += ' ie'+ info[1];	
		}
	}	
}

function init() {
	envCheck();
}

if (document.attachEvent) {
	document.attachEvent('DOMContentLoaded', init);	
} else {
	document.addEventListener('DOMContentLoaded', init);
}

envCheck();