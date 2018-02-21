'use strict';

/*
 * swipescroll
 *
 * NOTE!!
 * - DOM 구조 동일 (div.wrap > ul.list > li.item)
 * 
 * TODO
 * - 스크롤 양에 따라서 스무스하게 가기
 */
(function ( $ ) {
	function mySwipeScroll( element, _option ){
		var TRANSITION_MS = 200;

		var $this = $( element ),
			$list = $this.children(),
			$items = $list.children(),
			isPossible = false,
			wids = [],
			nowPos = 0,
			viewWid = 0,
			totalWid = 0;

		var touchData = {
			startX: 0,
			startY: 0,
			dragDist: 0,
			scrollDist: 0,
			startTime: 0,
			startPos: 0,
		}

		var option = $.extend({
			isSnap: false,
			isCssAllInline: true,
			isSideEffect: false,
			initIndex: 0,
			installCallback: null,
			beforeCallback: null,
			activeCallback: null,
		}, _option)

		// idx의 위치 알아오기
		function getIdxPosition( idx ){
			for (var i = 0, pos = 0; i < idx; i++) {
				pos -= wids[i++];
			}

			return pos;
		}

		function checkLimitPosition( pos ){
			if (pos > 0) {
				pos = 0;
			}
			if (pos + totalWid < viewWid) {
				pos = (totalWid - viewWid) * -1;
			}

			return pos;
		}

		function checkOffset() {
			viewWid = $this.outerWidth();
			
			$items.each(function() {
				var wid = $(this).outerWidth();

				wids.push(wid)
				totalWid += wid
			});

			isPossible = viewWid < totalWid;
		}

		function installStyle() {
			nowPos = getIdxPosition(isNaN(option.initIndex) ? 0 : option.initIndex)

			$list.css({
				'transition-duration': '0ms',
				'transition-property': '-webkit-transform',
				'transition-timing-function': 'cubic-bezier(0.18, 0.35, 0.56, 1)',
				'transform': 'translate('+ nowPos +'px, 0px)'
			});

			if (option.isCssAllInline) {
				$this.css({
					'position': 'relative',
					'overflow': 'hidden',
				});
				$list.css({
					'width': totalWid +'px',
					'position': 'absolute',
					'top': '0',
					'left': '0',
				});
				$items.css({
					'float': 'left'
				});
			}
		}

		// 이벤트 설치
		function enable() {
			$this.on('touchstart.mySwipeScroll', touchStart)
		}

		// 이벤트 제거
		function disable() {
			$this.off('touchstart.mySwipeScroll', touchStart)
			$this.off('touchmove.mySwipeScroll', touchMove)
			$this.off('touchend.mySwipeScroll', touchEnd)
			$this.off('touchcancel.mySwipeScroll', touchEnd)
		}

		// 관련 모두 제거
		function destroy() {
			$.removeData($this.get(0));
			disable()
		}

		function touchStart( e ) {
			if (isPossible && e.type === 'touchstart' && e.originalEvent.touches.length === 1){
				touchData.startX = e.originalEvent.touches[0].pageX
				touchData.startY = e.originalEvent.touches[0].pageY
				touchData.startTime = Date.now();

				$this.on('touchmove.mySwipeScroll', touchMove)
				$this.on('touchend.mySwipeScroll', touchEnd)
				$this.on('touchcancel.mySwipeScroll', touchEnd)

				$list.css({'transition' : '0s'});

				if (typeof(option.beforeCallback) == 'function') {
					option.beforeCallback()
				}
			}
		}

		function touchMove( e ) {
			var x, y, pos;

			if (isPossible && e.type === 'touchmove' && e.originalEvent.touches.length === 1) {
				x = e.originalEvent.touches[0].pageX;
				y = e.originalEvent.touches[0].pageY;

				touchData.dragDist = touchData.startX - x;
				touchData.scrollDist = touchData.startY - y;

				var isDrag = Math.abs(touchData.dragDist) > Math.abs(touchData.scrollDist)
				var isRightMove = touchData.dragDist < 0;

				if ( isDrag ){
					e.preventDefault();

					touchData.startPos = nowPos - touchData.dragDist;

					if (!option.isSideEffect) {
						touchData.startPos = isRightMove ? Math.min(touchData.startPos, 0) : Math.max(touchData.startPos, (totalWid - viewWid) * -1);	
					}

					$list.css({'transform': 'translate('+ touchData.startPos +'px, 0px)'})
					e.preventDefault();
				}
			}
		}

		function touchEnd( e ) {
			var endPos;
			var endTime;

			if (isPossible && e.type === 'touchend' || e.type === 'touchcancel') {
				var endTime = Date.now();

				$this.off('touchmove.mySwipeScroll', touchMove)
				$this.off('touchend.mySwipeScroll', touchEnd)
				$this.off('touchcancel.mySwipeScroll', touchEnd)

				// TODO
				var v = Math.abs(touchData.scrollDist / (endTime - touchData.startTime));

				console.log(v)
				
				// touchData.startPos

				// 스냅 기능
				if (option.isSnap) {
					touchData.startPos = (function( startPos ){
						startPos = Math.abs(startPos); // 계산하기 쉽게 하기 위해

						for (var i = 0, nextPos = 0, nextPosHalf = 0, sum = 0, len = wids.length; i < len; i++) {
							nextPos = sum + wids[ i ];
							nextPosHalf = sum + wids[ i ] /2;

							// 정확한 위치에 있으면 종료
							if (wids[i] == startPos){
								return startPos * -1;
							}

							// 절반보다 작은쪽에 위치에 있으면 종로
							if (startPos > sum && startPos < nextPosHalf){
								return sum * -1;
							}
							// 절반보다 큰쪽에 위치에 있으면 종로
							if (startPos >= nextPosHalf && startPos < sum + wids[ i ]){
								return nextPos * -1;
							}

							sum += wids[ i ];
						}

						return 0;
					})( touchData.startPos )
				}
					
				// 	$list.css({
				// 		'transition' : v + 's',
				// 		'transform': 'translate('+ touchData.startPos +'px, 0px)'
				// 	})

				// 최종위치 저장
				nowPos = checkLimitPosition( touchData.startPos );

				$list.css({
					'transform': 'translate('+ nowPos +'px, 0px)',
					'transition' : TRANSITION_MS +'ms',
				})

				if (typeof(option.activeCallback) == 'function') {
					option.activeCallback()
				}
			}
		}

		function move( idx, time ) {
			if (isNaN(idx) || idx > wids.length-1) {
				return;
			}

			nowPos = getIdxPosition(idx)
			nowPos = checkLimitPosition( nowPos );

			$list.css({
				'transition' : (!isNaN(time) ? time : TRANSITION_MS) +'ms',
				'transform': 'translate('+ nowPos +'px, 0px)'
			});

			if (typeof(option.activeCallback) == 'function') {
				option.activeCallback()
			}
		}

		// check option
		(function() {
			if (typeof option.isSnap != 'boolean') {
				throw 'check option value';
			}
			if (typeof option.isCssAllInline != 'boolean') {
				throw 'check option value';
			}
			if (typeof option.isSideEffect != 'boolean') {
				throw 'check option value';
			}
			if (typeof option.initIndex != 'number') {
				throw 'check option value';
			}
			if (option.installCallback != null && typeof option.installCallback != 'function') {
				throw 'check option value';
			}
			if (option.beforeCallback != null && typeof option.beforeCallback != 'function') {
				throw 'check option value';
			}
			if (option.activeCallback != null && typeof option.activeCallback != 'function') {
				throw 'check option value';
			}
		})()

		// 시작
		checkOffset();
		installStyle();
		enable();

		// 설치 후 콜백
		if (typeof(option.installCallback) == 'function') {
			option.installCallback()
		}

		return {
			move: move,
			enable: enable,
			disable: disable,
			destroy: destroy
		}
	}

	$.fn.mySwipeScroll = function( _option ){
		var DATA_NAME = 'mySwipeScroll';
		var args = Array.prototype.slice.call(arguments, 1)

		return this.each( function(){
			if ( typeof(_option) == 'string' && $.data(this, DATA_NAME) ){
				switch( _option ){
					case 'move':
						$.data(this, DATA_NAME).move.apply(null, args);
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
				var inst = new mySwipeScroll(this, _option);

				if (inst) {
					$.data(this, DATA_NAME, inst);
				}
			}
		})
	}
})( jQuery, window, document );