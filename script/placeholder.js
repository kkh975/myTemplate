'use strict';

/*
 * placeholder
 *
 * NOTE!!
 * - 시스템과 동일 기능 하고 싶으나, focus시 커서 위치가 마지막으로 향해서, 할 수 없음
 * - focus시 placeholder 텍스트 제거하고 blur시 placeholder 다시 살리는 방향으로 작성
 */
(function ( $ ) {
	var isSupportBrower = (function(){
		var test = document.createElement('input');
		return 'placeholder' in test
	})()

	function myPlaceholder( element, _option ){
		var $this = $( element ),
			initTxt = $this.attr('placeholder');

		var option = $.extend({
			isForce: false,
			activeClassName: 'my_placeholder_active',
			installCallback: null,
			activeCallback: null
		}, _option)

		// 활성 여부 체크(주요 기능)
		function activeCheck() {
			if ($this.val().length == 0) {
				$this.val( initTxt )
				$this.addClass( option.activeClassName )
			} else {
				$this.removeClass( option.activeClassName )
			}
		}

		// 이벤트 설치
		function enable() {
			$this
				.on('focus.myPlaceholder', function( e ){
					if ($this.val() == initTxt) {
						$this.val('');
					}
					$this.removeClass( option.activeClassName )
				})
				.on('blur.myPlaceholder', function( e ){
					activeCheck()

					// 작동 후 콜백
					if (typeof(option.activeCallback) == 'function') {
						option.activeCallback()
					}
				})

			activeCheck()
		}

		// 이벤트 제거
		function disable() {
			$this.off('focus.myPlaceholder')
			$this.off('blur.myPlaceholder')
			$this.removeClass( option.activeClassName )
		}

		// 관련 모두 제거
		function destroy() {
			$.removeData($this.get(0));
			disable()
		}

		// check option
		(function() {
			if (typeof option.isForce != 'boolean') {
				throw 'check option value';
			}
			if (typeof option.activeClassName != 'string') {
				throw 'check option value';
			}
			if (option.installCallback == null || typeof option.installCallback != 'function') {
				throw 'check option value';
			}
			if (option.activeCallback == null || typeof option.activeCallback != 'function') {
				throw 'check option value';
			}
		})()

		// 강제 설정이 아닌경우, 브라우저 체크 후 패스
		if ((!option.isForce && isSupportBrower)) {
			return false;
		}

		// 시작
		enable()

		// 강제화 할 경우, 기본 기능 필요없으므로 기능 삭제하기
		$this.attr('placeholder', '');

		// 설치 후 콜백
		if (typeof(option.installCallback) == 'function') {
			option.installCallback()
		}

		return {
			enable: enable,
			disable: disable,
			destroy: destroy
		}
	}

	$.fn.myPlaceholder = function( _option ){
		var DATA_NAME = 'myPlaceholder';

		return this.each( function(){
			if ( typeof(_option) == 'string' && $.data(this, DATA_NAME) ){
				switch( _option ){
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
			} else if ( !$.data(this, DATA_NAME) ){
				var inst = new myPlaceholder(this, _option);

				if (inst) {
					$.data(this, DATA_NAME, inst);
				}
			}
		})
	}
})( jQuery, window, document );