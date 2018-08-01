/**
 * Object 복사
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
	(function(){Object.assign = function (target) {'use strict';
	if (target === undefined || target === null) throw new TypeError('Cannot convert undefined or null to object');
	var output = Object(target);
	for (var index = 1; index < arguments.length; index++) {
	var source = arguments[index];
	if (source !== undefined && source !== null) for (var nextKey in source) if (source.hasOwnProperty(nextKey)) output[nextKey] = source[nextKey];
	} return output;};})();
}


// 환경 확인
if ( window == undefined ) throw ReferenceError('browser 환경에서 실행되어야 합니다.');
if ( $ == undefined || $ instanceof jQuery ) throw ReferenceError('jQuery가 먼저 선언되어야 합니다.');


// 의존성을 위한 플래그
window.happylife_condo_status = true;


/**
 * 날짜 알아오기
 * @param {number} 대상 년도
 * @param {number} 대상 월
 * @return {object} 대상 월의 정보
 */
function getCurrentMonth( nowYY, nowMM ) {
	var todayDate = new Date();
	var nowDate   = new Date(nowYY, nowMM-1);

	var today = todayDate.getFullYear() != nowYY || todayDate.getMonth() != nowMM-1 ? 15 : todayDate.getDate();
	var nowSdd = nowDate.getDate();
	var nowSday = nowDate.getDay();

	nowDate.setMonth( nowMM );
	nowDate.setDate( 0 );

	var nowEdd = nowDate.getDate();
	var nowEday = nowDate.getDay();

	return {
		mm    : nowMM,
		today : today,
		sdd   : nowSdd,
		edd   : nowEdd,
		sday  : nowSday,
		eday  : nowEday
	}
}

/**
 * 달력 일별 그리기(li 태그)
 * 		
 * @param {number} 대상 월
 * @param {number} 대상 년도
 * @param {Object} 옵션 설정, 함수 내 DEFAULT_OPTION 확인
 */
function installMonthDOM( nowYY, nowMM, option ) {
	// javascript 기본 정의값! - 수정하지 말것!!
	var SUNDAY = 0;
	var MONDAY = 1;
	var TUEDAY = 2;
	var WEDDAY = 3;
	var THRDAY = 4;
	var FRIDAY = 5;
	var SATDAY = 6;

	// 요일 한글 표현 정의
	var DAY = ['일', '월', '화', '수', '목', '금', '토'];

	// 요일 이름 정의
	var DAY_NAMES = ['sun', 'mon', 'the', 'wed', 'thr', 'fri', 'sat'];

	// 옵션
	var DEFAULT_OPTION = {
		calendarDOM: $('.cal'), // 달력 보여질 parents DOM
		dayTagName: 'li',		// 각 일별 구분 태그 이름
		dayAltTagName: 'p',		// 각 일별 표현 태그 이름
		isShowMonth: true,		// 각 일별 달 표시 여부
		isShowDay: true,		// 각 일별 요일 표시 여부
		startDay: '일',			// 시작 요일(일 or 월)

		// 일별 표현 데이터
		dayData: {		
			// 평일
			weekday: {
				classTxt: 'weekday',	// 일별 구분 태그에 들어갈 클래스 이름
				contentHtmlTxt: '', 	// 일별 구분 태그내 들어갈 DOM 내용, 없으면 '' 처리
			},
			// 주말
			weekend: {
				classTxt: 'weekend',	// 일별 구분 태그에 들어갈 클래스 이름
				contentHtmlTxt: '', 	// 일별 구분 태그내 들어갈 DOM 내용, 없으면 '' 처리
			}
		},

		/*
		 * 사용자 표현 데이터
		 * testData 내에 아래와 같이 정의
		 * 
			attend: {
				data: [2, 3, 4],					// 테스트 지정 날짜
				classTxt: 'win',					// 표현할 클래스
				contentHtmlTxt: '<p>출석</p>',		// 일별 구분 태그내 들어갈 DOM 내용, 없으면 '' 처리
			},
		*/
		testData: { }
	};


	var mmInfo;


	/**
	 * 이전달 그리기
	 * @return {String} html 텍스트
	 */
	function prevMonthDraw() {
		var htmlTxt = '';
		var isStartDaySunday = option.startDay.indexOf('월') > -1;
		var startDay = isStartDaySunday ? MONDAY : SUNDAY;
		var startThisDay = mmInfo.sday;

		// 월요일이 시작요일인 경우, 
		// javascript 기본 정의가 일요일이 0이므로 일요일 시작인 경우 표현이 어려움
		// 이번달(대상달)의 시작요일이 일요일인 경우 요일의 마지막인 7로 변경
		if (isStartDaySunday && startThisDay == SUNDAY) {
			startThisDay = 7
		}

		// 빈칸으로 채우기
		for (; startDay < startThisDay; startDay++) {
			htmlTxt += '<'+ option.dayTagName +'></'+ option.dayTagName +'>';
		}

		return htmlTxt;
	}

	/**
	 * 이번달 그리기
	 * @return {String} html 텍스트
	 */
	function currMonthDraw() {
		var htmlTxt = '';

		for (var i = 1; i <= mmInfo.edd; i++) {
			var day = mmInfo.sday + (i-1);
			var isWeekend = day%7 == (SUNDAY || SATDAY);
			var classTxt = '';
			var contentHtmlTxt = '';

			// 사용자(출석부) 특이표시 날짜에 표시할 HTML, 클래스 찾기
			// TODO: loop 영역 성능개선 or 코드 개선 여부 고민해볼 것!
			(function( date ){
				for (var key in option.testData) {
					for (var i = 0, len = option.testData[ key ].data.length; i < len; i++) {
						if (date == option.testData[ key ].data[ i ]) {
							option.testData[ key ].classTxt && (classTxt = option.testData[ key ].classTxt);
							option.testData[ key ].contentHtmlTxt && (contentHtmlTxt = option.testData[ key ].contentHtmlTxt);
							break;
						}
					}
				}
			})(i);

			// 주말,평일 구분 class 추가
			classTxt += ' ' + option.dayData[isWeekend ? 'weekend' : 'weekday'].classTxt;
			classTxt += ' ' + DAY_NAMES[day%7];

			// 날 시작
			htmlTxt += '<'+ option.dayTagName +' class="'+ classTxt +'">';

			// 날짜 표시
			htmlTxt +=  '	<'+ option.dayAltTagName +' class="alt">'+ 
								(option.isShowMonth ? mmInfo.mm +'/' : '') + i + 
								(option.isShowDay ? '('+ (DAY[ day%7 ]) +')' : '') + 
						'	</'+ option.dayAltTagName +'>';

			// 주말,평일 관려 관련 HTML 표시
			htmlTxt += option.dayData[isWeekend ? 'weekend' : 'weekday'].contentHtmlTxt;

			// 사용자(출석부) 표시 날짜에 표시할 HTML 표시
			htmlTxt += contentHtmlTxt;

			// 날 종료(닫기)
			htmlTxt += '</'+ option.dayTagName +'>';
		}

		return htmlTxt;
	}

	/**
	 * 다음달 그리기
	 * @return {String} html 텍스트
	 */
	function nextMonthDraw() {
		var htmlTxt = '';
		var isStartDaySunday = option.startDay.indexOf('일') > -1;
		var startThisDay = (isStartDaySunday ? 6 : 7) - mmInfo.eday;

		// 월요일이 시작요일이고 전달이 끝이 일요일이면 추가할 필요 없음.
		if (!isStartDaySunday && mmInfo.eday == 0) return '';

		// 빈칸으로 채우기
		while (startThisDay-- > 0) htmlTxt += '<'+ option.dayTagName +'></'+ option.dayTagName +'>';

		return htmlTxt;
	}

	/**
	 * 달력 그리기
	 * @param  {jQuery} 
	 * @return {String} html 텍스트
	 */
	function calendarDraw( $target ) {
		var htmlTxt = '', txt;
		var txts = [prevMonthDraw(), currMonthDraw(), nextMonthDraw()];

		while(txt = txts.shift(), typeof(txt) == 'string') htmlTxt += txt;

		$target.html( htmlTxt ); 
	}

	// 인자값 체크
	if (isNaN(nowYY) || isNaN(nowMM) ) throw '년도와 월은 숫자로 입력해주세요.'
	if ( nowYY < 1970 ) throw '년도는 1970년 이후로 입력해주세요.'
	if ( nowMM < 1 || nowMM > 12 ) throw '월을 1~12 사이로 입력해주세요.'

	// 현재달에 대한 정보
	mmInfo = getCurrentMonth(nowYY, nowMM);

	// 옵션값 복사
	option = Object.assign(DEFAULT_OPTION, option);

	// 옵션내 값 체크
	try {
		for (var key in option.testData) {
			for (var i = 0, len = option.testData[ key ].data.length; i < len; i++) {
				if (isNaN(option.testData[ key ].data[ i ])) throw '사용자 표현 내 data 값은 Array<Number> 입니다.';
			}
		}	
	} catch (err) {
		console.error(err)
		console.error('사용자 표현 데이터의 Data을 확인해주세요.');
	}

	// 달력 DOM 생성
	option.calendarDOM.each( function( _, $_each ){
		calendarDraw( $( $_each ) )
	});
}