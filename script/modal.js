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
		var KEYCODE_TAB = 9;
		var KEYCODE_ESC = 27;
		var DEFAULT_POSITIONS = [
			'top-left',
			'top-center',
			'top-right',
			'center-left',
			'center',
			'center-right',
			'bottom-left',
			'bottom-center',
			'bottom-right'
		];

		var $win = $( window ),
			$trigger = $( element ),
			$target = $( $trigger.attr('href') ),
			$focusable = $target.find('a, button, input, textarea'),
			$focusableFirst = $focusable.first(),
			$focusableLast = $focusable.last(),
			$bg, $body, $closeBtn;

		var option = $.extend({
			isCssAllInline: true,	// inline css 설정
			isCssBgInline: true,	// bg에만 inline css 설정
			isCssBodyInline: true,	// body에만 inline css 설정
			isBgClickClose: true,	// bg 클릭시 닫기 여부 활성화
			isEscKeyClose: true,	// esc 키 클릭시 닫기 여부 활성화
			isClassControl: false, 	// clsss 방식으로 할것인지 아닌지
			positionType: 'fixed', 	// 띄울시  position의 속성 여부 'fixed'|'absolute'
			position: 'center', 	// false|DEFAULT_POSITIONS
			bgClassName: 'my_modal_bg',
			bodyClassName: 'my_modal_body',
			closeBtnClassName: 'my_modal_close',
			activeClassName: 'my_modal_active',
			$bg: null,	
			$body: null,
			$closeBtn: null,
			installCallback: null,
			openCallback: null,
			closeCallback: null
		}, _option);

		// 열기
		function open( e ){
			// focus 제어, 처음 요소 에서 백탭키 누르면 마지막 요소로 이동
			$focusableFirst.on('keydown.myModal', function(e){
				if (e.keyCode == KEYCODE_TAB && e.shiftKey) {
					e.preventDefault();
					$focusableLast.focus();
				}
			});

			// focus 제어, 마지막 요소 에서 탭키 누르면 처음 요소로 이동
			$focusableLast.on('keydown.myModal', function(e){
				if (e.keyCode == KEYCODE_TAB && !e.shiftKey) {
					e.preventDefault();
					$focusableFirst.focus();
				}
			});

			if (option.isBgClickClose) {
				$bg.on('click.myModal', close)
			}

			if (option.isEscKeyClose) {
				$win.on('keydow.myModal', close)
			}

			if (option.isCssAllInline) {
				switch ($target.positionType) {
					case 'absolute':
						$target.css({position: 'absolute', top:0, left: 0, width: '100%', height: $win.height()})
						$win.on('scroll.myModal', function( e ){
							// TODO
							$modal.css('marginTop', $modal.css('marginTop') + e.scrollTop() )
						})
						break;
					default:
						$target.css('position', 'fixed')
						break;
				}

				if (option.isCssBgInline) {
					$bg.css({position: 'absolute', top:0, left: 0, width: '100%', height: '100%', background: '#000'})	
				}

				if ( typeof(option.position) == 'string' ) {
					$modal.css('position': 'absolute')

					// 상하
					if (option.position.indexOf('top') > -1) {
						$modal.css('top', '0%')
					} else if (option.position.indexOf('bottom') > -1) {
						$modal.css('bottom', '0%')
					} else {
						$modal.css('top', '50%', marginTop: -$modal.height()/2)
					}

					// 좌우
					if (option.position.indexOf('left') > -1) {
						$modal.css('left', '0%')
					} else if (option.position.indexOf('right') > -1) {
						$modal.css('right', '0%')
					} else {
						$modal.css('left', '50%', marginLeft: -$modal.width()/2)
					}
				} else {
					$modal.css(option.position)
				}
			}

			if (!option.isClassControl) {
				$target.show();	
			}
			
			$closeBtn.on('click.myModal', close);

			$target.addClass( option.activeClassName )
			$target.attr("tabindex", -1).focus();
		}

		// 닫기
		function close( e ) {
			if (e != null) {
				e.preventDefault();
			}

			if (option.isBgClickClose) {
				$bg.off('click.myModal')
			}

			if (option.isEscKeyClose) {
				$win.off('keydow.myModal', close)
			}

			if (option.isCssAllInline && $target.positionType == 'absolute') {
				$win.off('scroll.myModal')
			}

			if (!option.isClassControl) {
				$target.hide();	
			}

			$focusableFirst.off('keydown.myModal')
			$focusableLast.off('keydown.myModal')
			$closeBtn.off('click.myModal', close)

			$target.attr("tabindex", "");
			$target.removeClass( option.activeClassName )
			$trigger.focus();
			
			// 닫은 후 콜백
			if (typeof(option.closeCallback) == 'function') {
				option.closeCallback()
			}
		}

		// TODO, 다시 그리기
		function draw() {
		}

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
			close()
			$trigger.off('click.myModal')
			$trigger.removeClass( option.activeClassName )
			$bg.off('click.myModal')
			$win.off('keydown.myModal')
		}

		// 관련 모두 제거
		function destroy() {
			$.removeData($trigger.get(0));
			disable()
		}

		$bg = $target.find('.'+ option.bgClassName) || option.$bg;
		$body = $target.find('.'+ option.bodyClassName) || option.$body;
		$closeBtn = $target.find('.'+ option.closeClassName) || option.$closeBtn;

		// 사용자 오류 막기 위해 기본값 체크
		option.isBgClickClose = option.isBgClickClose && $bg.length > 0;
		option.positionType = option.positionType != 'absolute' ? 'fixed' : 'absolute';

		// 사용자 오류 막기 위해, 전체가 true면 하위도 모두 true
		// false 이면 부분 제어 가능
		if (option.isCssAllInline) {
			option.isCssBgInline = true;
			option.isCssBodyInline = true;
		}

		// 사용자 오류 막기 위해, 목록 중 존재하는지 확인
		// TODO, array.some??
		if ( typeof(option.position) == 'string' ){
			(function(){
				var isCheck = false;

				for (var i = DEFAULT_POSITIONS.length - 1; i >= 0; i--) {
					if (DEFAULT_POSITIONS[i] == option.position) {
						isCheck = true;
						break;
					}
				}

				if (!isCheck) {
					option.position = 'center';
				}
			})( DEFAULT_POSITIONS );	
		}

		// 시작
		enable()
		close()

		// 설치 후 콜백
		if (typeof(option.installCallback) == 'function') {
			option.installCallback()
		}

		return {
			open: open,
			hide: hide,
			draw: draw,
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
				var inst = new myModal(this, _option);

				if (inst) {
					$.data(this, DATA_NAME, inst);
				}
			}
		})
	}
})( jQuery, window, document );