'use strict';

/*
 * placeholder
 *
 * NOTE!!
 * - 시스템과 동일 기능 하고 싶으나, focus시 커서 위치가 마지막으로 향해서, 할 수 없음
 * - focus시 placeholder 텍스트 제거하고 blur시 placeholder 다시 살리는 방향으로 작성
 *
 * OPTION
 * - isForce: {boolean} 강제설정 여부, default:false
 * - activeClassName: {string} 기능 작동시 default:'my_placeholder_active'
 * - installCallback: {null|function} 설치 후 콜백
 * - activeCallback: {null|function} 기능 후 콜백
 */
(function( $, w, d ){
	var DATA_NAME = 'myPlaceholder';

	// 지원여부
	var isSupportBrower = (function(){
		var $_d = d.createElement('input');
		return 'placeholder' in $_d
	})();

	function myPlaceholder( elem, _opt ){
		var $this = $( elem ),
			initTxt = $this.attr('placeholder');

		var opt = $.extend({
			isForce: false,
			activeClassName: 'my_placeholder_active',
			installCallback: null,
			activeCallback: null
		}, _opt)

		// 비지니스 로직
		// 활성 여부 체크
		function activeCheck( e ) {
			if (e && e.type == 'focus') {
				// default 글자와 같다면 빈 값 셋팅
				if ($this.val() == initTxt) {
					$this.val('');
					$this.addClass( opt.activeClassName );
				} else {
					$this.removeClass( opt.activeClassName );
				}
			} else {
				// 길이가 0이면 default 글자 사용
				if ($this.val().length == 0) {
					$this.val( initTxt );
					$this.addClass( opt.activeClassName );
				} else {
					$this.removeClass( opt.activeClassName );
				}
			}

			// 작동 후 콜백
			if (typeof(opt.activeCallback) == 'function') {
				opt.activeCallback();
			}
		}

		// 이벤트 설치
		function enable() {
			$this
				.on('focus.'+ DATA_NAME, activeCheck)
				.on('blur.'+ DATA_NAME, activeCheck)

			activeCheck();
		}

		// 이벤트 제거
		function disable() {
			$this.off('focus.'+ DATA_NAME);
			$this.off('blur.'+ DATA_NAME);
			$this.removeClass( opt.activeClassName );
		}

		// 관련 모두 제거
		function destroy() {
			$.removeData($this.get(0));
			disable();
		}

		// check opt
		if (typeof opt.isForce != 'boolean') throw Error('isForce은 boolean형이어야 합니다.');
		if (typeof opt.activeClassName != 'string') throw Error('activeClassName은 string형이어야 합니다.');
		if (opt.installCallback != null && typeof opt.installCallback != 'function') throw Error('installCallback은 null이거나 함수이어야 합니다.');
		if (opt.activeCallback != null && typeof opt.activeCallback != 'function') throw Error('activeCallback은 null이거나 함수이어야 합니다.');

		// 강제 설정이 아닌경우, 브라우저 체크 후 패스
		// NOTE, 관점의 차이 있음.
		// 비강제시에도 콜백은 실행하게 해야하나?
		if ((!opt.isForce && isSupportBrower)) return false;

		// 시작
		enable();

		// 강제화 할 경우, 기본 기능 필요없으므로 기능 삭제하기
		$this.attr('placeholder', '');

		// 설치 후 콜백
		if (typeof(opt.installCallback) == 'function') {
			opt.installCallback();
		}

		return {
			enable: enable,
			disable: disable,
			destroy: destroy
		}
	}

	// 의존성 확인
	if ($ !== jQuery) throw Error('jQuery 플러그인이 반드시 설치되어야 합니다.');

	$.fn.myPlaceholder = function( _opt ){
		return this.each( function(){
			// 미설치시
			if ( !$.data(this, DATA_NAME) ){
				var inst = new myPlaceholder(this, _opt);

				if (inst) {
					$.data(this, DATA_NAME, inst);
				}
			}

			// 옵션 설정시
			if ( typeof(_opt) == 'string' && $.data(this, DATA_NAME) ){
				switch( _opt ){
					case 'enable':
						$.data(this, DATA_NAME).enable();
						break;
					case 'disable':
						$.data(this, DATA_NAME).disable();
						break;
					case 'destroy':
						$.data(this, DATA_NAME).destroy();
						break;
				}
			}
		});
	};
})( jQuery, window, document );