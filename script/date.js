
/**
 * 다른 타입에서 날짜 얻기
 * @param  {String|Number} dO 
 * @return {Date}
 */
function dateGet(dO) {
	var i, tmp, h, m, s, ms;

	switch( typeof(dO) ) {
		case 'string':
			h = m = s = ms = 0;

			dO = dO.split('-');

			// 별도 시간 설정 있음(00 00:00:00 000)
			if (dO[2].indexOf(' ') > -1) {
				tmp = dO[2].split(' ');
				dO[2] = tmp[0]; // 날짜 설정

				// ms가 있는 경우
				if (tmp.length == 3) ms = Math.min(999, parseInt(tmp[2], 10));

				// 시분초 설정
				tmp = tmp[1].split(':');
				h = parseInt(tmp[0], 10);
				m = parseInt(tmp[1], 10);
				s = parseInt(tmp[2], 10);
			}

			return new Date(parseInt(dO[0], 10), parseInt(dO[1], 10)-1, parseInt(dO[2], 10), h, m, s, ms);

			break;

		case 'number':
			return new Date(dO);

		default:
			if (dO.constructor == Date) return dO;
			else new Date();
	}
}

/**
 * datePart 표준함수
 * @param  {String|Number|Date} part 날짜 표현식 대응되는 문자기호
 * @param  {Date} dO 
 * @return {String}
 */
function datePart(part, dO) {
	var date = dateGet(dO);

	switch(part) {
		case 'Y': return date.getYear() + '';
		case 'y': return datePart( 'Y', date ).substr( -2 );

		case 'n': return ( date.getMonth() + 1 ) + '';
		case 'm': return ( '0' + datePart( 'n', date ) ).substr( -2 );

		case 'j': return date.getDate() + '';
		case 'd': return ( '0' + datePart( 'j', date ) ).substr( -2 );

		case 'G': return date.getHours() + '';
		case 'H': return ( '0' + datePart( 'G', date ) ).substr( -2 );

		case 'g':
			i = ( parseInt( date.getHours() ) % 12 ) + '';
			return i ? i : '0';
		case 'h': return ( '0' + datePart( 'g', date ) ).substr( -2 );

		case 'i': return ( '0' + date.getMinutes() ).substr( -2 );
		case 's': return ( '0' + date.getSeconds() ).substr( -2 );

		case 'u': return date.getMilliseconds() + '';

		case 'w':
			switch( date.getDay() ){
				case 0: return '일';
				case 1: return '월';
				case 2: return '화';
				case 3: return '수';
				case 4: return '목';
				case 5: return '금';
				case 6: return '토';
			}

		default: return part;
	}	
}

/**
 * 날짜 포맷팅
 * @param  {String} part 날짜 표현식 대응되는 문자기호
 * @param  {Date} dO
 * @return {String}
 */
function dateFormat(part, dO) {
	var date = dateGet(dO), result = '';

	for (var i=0, j=part.length; i<j;) result += datePart(part.charAt(i++), date)

	return result;
}

/**
 * 날짜 추가
 * @param  {String} interval
 * @param  {Number} number  
 * @param  {Date} dO      
 * @return {Date}         
 */
function dateAdd(part, number, dO) {
	var date = dateGet(dO);

	if (!(typeof(part) == 'string' && part.length == 1)) throw ReferenceError('');
	if (isNaN(number)) throw ReferenceError('');

	switch(part.toLowerCase()) {
		case 'y': // year
			date.setFullYear(date.getFullYear() + number);
		case'm': //month
			date.setMonth(date.getMonth() + number);
			break;
		case'd': //day
			date.setDate(date.getDate() + number);
			break;
		case'h': //hour
			date.setHours(date.getHours() + number);
			break;
		case'i': //minute
			date.setMinutes(date.getMinutes() + number);
			break;
		case's': //second
			date.setSeconds(date.getSeconds() + number);
			break;
		case'ms': //msecond
			date.setMilliseconds(date.getMilliseconds() + number);
			break;
	}

	return date;
}

/**
 * 날짜 차이
 * @param  {String} part
 * @param  {Date} dO1 
 * @param  {Date} dO2 
 * @return {Number}     
 */
function dateDiff(part, dO1, dO2) {
	var date1 = dateGet(dO1);
	var date2 = dateGet(dO2);

	if (!(typeof(part) == 'string' && part.length == 1)) throw ReferenceError('');

	switch(part.toLowerCase()) {
		case 'y': // year
			return date2.getFullYear() - date1.getFullYear();
		case'm': //month
			return dateDiff('y', date1, date2) * 12 + date2.getMonth() - date1.getMonth();
		case'h': //hour
			return parseInt((date2.getHours() - date1.getHours()) / 60*60*1000);
		case'i': //minute
			return parseInt((date2.getMinutes() - date1.getMinutes()) / 60*1000);
		case's': //second
			return parseInt((date2.getSeconds() - date1.getSeconds()) / 1000);
		case'ms': //msecond
			return date2.getTime() - date1.getTime();
		case'd': //day
			var d1_year = date1.getFullYear();
			var d1_month = date1.getMonth();
			var d1_date = date1.getDate();
			 
			var d2_year = date2.getFullYear();
			var d2_month = date2.getMonth();
			var d2_date = date2.getDate();
 			
 			var result = 0;

 			if (d2_year - d1_year > 0) {
 				result += dateDiff('d', dateGet(date1), dateGet(dl_year + '-12-31'));
 				result += dateDiff('d', dateGet(d2_year + '-1-1'), dateGet(date2));
 				for (var i = d1_year+2; i<d2_year; i++) result += 365+(isLeapYear(i) ? 1 : 0);
 			} else {
	 			var temp = [31,28,31,30,31,30,31,31,30,31,30,31];
				if (isLeapYear( d1_year )) temp[1]++;

				if (d2_month - d1_month > 0) {
					result += temp[dl_month] - d1_date + 1;

					result += d2_date - 1;

					for (var i = dl_month+1; i < d2_month; i++) result += temp[i];

				} else result += d2_month - d1_month;
 			}

			return result;
	}
}

/**
 * 윤년확인
 * @param  {[type]}  year
 * @return {Boolean}     
 */
function isLeapYear(year) {
	if (isNaN(year) || year.toString().length != 4) throw new ReferenceError();

	return (year%4 == 0 && year%100 != 0) || year%400 == 0;
}