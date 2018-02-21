'use strict';

/*
 * modal
 *
 * NOTE!!
 * - 
 *
 * TODO: DOM 구조가 항상 동일해야 함 (div.wrap > div.bg + div.body) - Multi modal시 bg가 중복되서 처리될 수 있음
 */
(function ( $ ) {
	function myModal( element, _option ){
		var $win = $( window ),
			$trigger = $( element ),
			$target = $( $trigger.attr('href') ),
			$focusable = $target.find('a, button, input, textarea'),
			$focusableFirst = $focusable.first(),
			$focusableLast = $focusable.last(),
			$bg, $body, $closeBtn;

		var option = $.extend({
			isCssAllInline: true,
			isCssBgInline: true,
			isBgClickClose: true,
			activeClassName: 'my_tab_active',
			$links: null,
			$body: null,
			$closeBtn: null,
			installCallback: null,
			openCallback: null,
			closeCallback: null
		}, _option);

		// 이벤트 설치
		function enable() {
			$trigger.on('click.myModal', function( e ){
				open( e );

				// 열린 후 콜백
				if (typeof(option.openCallback) == 'function') {
					option.openCallback()
				}	
			})
		}

		// 이벤트 제거
		function disable() {
		}

		// 관련 모두 제거
		function destroy() {
			$.removeData($trigger.get(0));
			disable()
		}

		// 시작
		enable()

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

	$.fn.myModal = function( _option ){
		var DATA_NAME = 'myModal';

		return this.each( function(){
			if ( typeof(_option) == 'string' && $.data(this, DATA_NAME) ){
				switch( _option ){
					case 'open':
						$.data(this, DATA_NAME).open();
						break;
					case 'hide':
						$.data(this, DATA_NAME).hide();
						break;
					case 'draw':
						$.data(this, DATA_NAME).draw();
						break;
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
				$.data(this, DATA_NAME, new myModal( this, _option ));
			}
		})
	}
})( jQuery, window, document );