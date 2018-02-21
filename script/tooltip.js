'use strict';

/*
 * tooltip
 *
 * NOTE!!
 * - 
 * TODO: event 종류 (string, array)
 * TODO: 위치 (auto, top, bottom, left, right, 부모로부터 사용자 지정(object{of: '', top: '', 'left', 'right', 'bottom'}))
 * TODO: 크기 ([min|max]width, [min|max]height)
 */
(function ( $ ) {
	// TODO, 
	function myTooltip( element, _option ){
		var $this = $( element );

		var option = $.extend({
			isForce: false,
			activeClassName: 'my_tooltip_active',
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
				.on('focus.myTooltip', function( e ){
					if ($this.val() == initTxt) {
						$this.val('');
					}
					$this.removeClass( option.activeClassName )
				})
				.on('blur.myTooltip', function( e ){
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
			$this.off('focus.myTooltip')
			$this.off('blur.myTooltip')
			$this.removeClass( option.activeClassName )
		}

		// 관련 모두 제거
		function destroy() {
			$.removeData($this.get(0));
			disable()
		}

		// 강제 설정이 아닌경우, 브라우저 체크 후 패스
		if ((!option.isForce && isSupportBrower)) {
			return
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

	$.fn.myTooltip = function( _option ){
		var DATA_NAME = 'myTooltip';

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
				$.data(this, DATA_NAME, new myTooltip(this, _option));
			}
		})
	}
})( jQuery, window, document );