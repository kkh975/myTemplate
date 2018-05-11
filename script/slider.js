'use strict';

/*
 * slider
 * 
 * NOTE!!
 * - bxSlider 사용시, 연속 클릭시 갑작스런 작동 중지 및 UI 표현 오류
 *
 * FUNC
 * - 좌우버튼 클릭 이동
 * - 특정인덱스 바로가기
 * - 제거
 * - 슬라이드 시작
 * - 슬라이드 정지
 * 
 * OPTION
 * - activeClassName: {string} 기능 작동시 default:'my_placeholder_active'
 * - installCallback: {null|function} 설치 후 콜백
 * - activeCallback: {null|function} 기능 후 콜백
 *
 * TODO
 * - mode 전락 함수
 * - mouseover / focus시 정지 여부
 */
(function($, w, d){
	var DATA_NAME = 'mySlider';

	// 지원여부
	var isSupportBrower = (function(){
		var $_d = d.createElement('div');
		var style = $_d.style;
		var prefixes = ['Moz', 'Webkit', 'Ms'];
		var checkProps = 'transform';

		// 표준 지원
		if (typeof style[ checkProps ] == 'string') return true;

		// 브라우저 벤더 지원
		var propName = checkProps.charAt(0).toUpperCase() + checkProps.slice(1);
		for (var j = prefixes.length-1; j >= 0; j--) {
			propName = prefixes[j] + propName;
			if (typeof style[ propName ] == 'string') {
				return true;
			}	
		}

		return false;
	})();
	
	function mySlider( elem, _opt ){
		var itemLen = 0;
		var nowIdx = 0;
		var isMove = false;
		var timer = null;
		var $this = $( elem );

		var opt = $.extend({
			isLoop: true,
			sliderTime: 4000,
			moveTime: 250,
			$items: $this.find('> li'),
			$next: null,
			$prev: null,
			$start: null,
			$stop: null,
			$pages: null,
			activeClassName: 'my_slider_active',
			installCallback: null,
			activeCallback: null,
			isStopOnMouse: true, // TODO
			isStopOnFocus: true, // TODO
		}, _opt);

		function installDraw() {
			$this.css({
				'overflow': 'hidden',
				'position': 'relative'
			});

			updateViewSize();
			
			opt.$items.css({
				'position': 'absolute',
				'top': '0'
			});
			opt.$items.eq( nowIdx )
				.attr('tab-index', 0)
				.css('left','0');
			opt.$items.not(':eq('+ nowIdx +')')
				.attr('tab-index', -1)
				.css('left', '-100%');
		}

		function draw(thisIdx, afterIdx, direct, callback) {
			var afterCurrPos = direct == 'left' ? 100 : -100;
			var thisMovePos = direct == 'left' ? -100 : 100;

			$this.addClass( opt.activeClassName );

			if (isSupportBrower) {
				opt.$items.eq( thisIdx ).css({
					'left': 0 +'%',
					'transition': 'transform '+ opt.moveTime+'ms',
					'transform': 'translateX('+ thisMovePos +'%)'
				});
				opt.$items.eq( afterIdx ).css({
					'left': afterCurrPos +'%',
					'transition': 'transform '+ opt.moveTime +'ms',
					'transform': 'translateX('+ thisMovePos +'%)'
				});
				opt.$items.eq( afterIdx ).on('transitionend.'+ DATA_NAME +' webkitTransitionEnd.'+ DATA_NAME, function(){
					opt.$items.eq( afterIdx ).off('transitionend.'+ DATA_NAME +' webkitTransitionEnd.'+ DATA_NAME);
					opt.$items.eq( thisIdx )
						.attr('tab-index', -1)
						.css({
							'left': afterCurrPos + '%',
							'transition': '',
							'transform': ''
						});
					opt.$items.eq( afterIdx )
						.attr('tab-index', 0)
						.css({
							'left': '0%',
							'transition': '',
							'transform': ''
						});

					$this.removeClass( opt.activeClassName );
					callback();
				});
			} else {
				opt.$items.eq( thisIdx )
					.css({ 'left': 0 +'%' })
					.animate({ 'left': thisMovePos +'%' }, opt.moveTime);
				opt.$items.eq( afterIdx )
					.css({ 'left': afterCurrPos +'%' })
					.animate({ 'left': 0 +'%' }, opt.moveTime, function(){
						$this.removeClass( opt.activeClassName );
						callback();	
					});
			}
		}

		function enable() {
			if (opt.$prev) opt.$prev.on('click.'+ DATA_NAME, prev);	
			if (opt.$next) opt.$next.on('click.'+ DATA_NAME, next);
			if (opt.$start) opt.$start.on('click.'+ DATA_NAME, start);
			if (opt.$stop) opt.$stop.on('click.'+ DATA_NAME, stop);
			if (opt.$pages) opt.$pages.on('click.'+ DATA_NAME, function(){
				toIdx( opt.$pages.index() );
			});

			if (opt.isStopOnFocus) opt.$items.on('focus.'+ DATA_NAME, stop);
			if (opt.isStopOnMouse) opt.$items.on('mouseover.'+ DATA_NAME, stop);
		}

		function disable() {
			if (opt.$prev) opt.$prev.off('click.'+ DATA_NAME);
			if (opt.$next) opt.$next.off('click.'+ DATA_NAME);
			if (opt.$start) opt.$start.off('click.'+ DATA_NAME);
			if (opt.$stop) opt.$stop.off('click.'+ DATA_NAME);
			if (opt.$pages) opt.$pages.off('click.'+ DATA_NAME);

			if (opt.isStopOnFocus) opt.$items.off('focus.'+ DATA_NAME);
			if (opt.isStopOnMouse) opt.$items.off('mouseover.'+ DATA_NAME);

			$this.removeClass( opt.activeClassName );
		}

		function prev() {
			var afterIdx;

			if (opt.isLoop) {
				afterIdx = nowIdx-1 < 0 ? itemLen-1 : nowIdx-1;
			} else {
				afterIdx = Math.max(0, nowIdx-1);
			}

			toIdx(afterIdx, 'right');
		}

		function next() {
			var afterIdx;

			if (opt.isLoop) {
				afterIdx = nowIdx+1 > itemLen-1 ? 0 : nowIdx+1;
			} else {
				afterIdx = Math.min(itemLen-1, nowIdx+1);
			}

			toIdx(afterIdx, 'left');
		}

		function toIdx( afterIdx, forceDirect ) {
			if (isNaN(afterIdx)) throw Error('숫자를 넘겨주어야 합니다.');
			if (afterIdx < 0 && afterIdx > itemLen-1) throw Error('숫자 범위가 길이보다 크거나 작습니다.');

			if (nowIdx == afterIdx) return;
			if (isMove) return;

			var direct = forceDirect || (nowIdx - afterIdx > 0 ? 'right' : 'left');

			stop();
			isMove = true;
			draw(nowIdx, nowIdx = afterIdx, direct, function(){
				isMove = false;
				start();
				
				// 작동 후 콜백
				if (typeof(opt.activeCallback) == 'function') {
					opt.activeCallback();
				}
			});
		}

		function start() {
			if (opt.sliderTime && timer == null) timer = setInterval(next, opt.sliderTime);
		}

		function stop() {
			if (timer != null) {
				clearInterval(timer);
				timer = null;
			}
		}

		function update() {
			itemLen = opt.$items.length;

			if (itemLen-1 < nowIdx) nowIdx = itemLen-1;
		}

		function updateViewSize() {
			$this.css({
				'width': opt.$items.eq( nowIdx ).width(),
				'height': opt.$items.eq( nowIdx ).height()
			});
		}

		function destroy() {
			$.removeData($this.get(0));
			disable();
		}

		// check opt
		if (typeof opt.isLoop != 'boolean') throw Error('isLoop은 boolean형이어야 합니다.');
		if (opt.isLoop !== false && isNaN(opt.sliderTime)) throw Error('sliderTime은 false이거나 숫자형이어야 합니다.');
		if (isNaN(opt.moveTime)) throw Error('moveTime은 숫자형이어야 합니다.');
		if (!isNaN(opt.sliderTime) && opt.sliderTime <= 0) throw Error('sliderTime은 0상이어야 합니다.');
		if (!isNaN(opt.moveTime) && opt.moveTime <= 0) throw Error('moveTime은 0상이어야 합니다.');
		if (!isNaN(opt.sliderTime) && opt.sliderTime <= opt.moveTime) throw Error('sliderTime은 moveTime 커야 합니다.');
		if (!opt.$items || (opt.$items && opt.$items.length < 2)) throw Error('$items이 정의되지 않았거나, 길이가 한개 이상이어야 합니다.');
		if (typeof opt.activeClassName != 'string') throw Error('activeClassName은 string형이어야 합니다.');
		if (opt.installCallback != null && typeof opt.installCallback != 'function') throw Error('installCallback은 null이거나 함수이어야 합니다.');
		if (opt.activeCallback != null && typeof opt.activeCallback != 'function') throw Error('activeCallback은 null이거나 함수이어야 합니다.');

		// 시작
		update();
		installDraw();
		enable();
		start();

		// 설치 후 콜백
		if (typeof(opt.installCallback) == 'function') {
			opt.installCallback();
		}

		return {
			prev: prev,
			next: next,
			toIdx: toIdx,
			start: start,
			stop: stop,
			update: update,
			updateViewSize: updateViewSize,
			destroy: destroy
		}
	}
	// 의존성 확인
	if ($ !== jQuery) throw Error('jQuery 플러그인이 반드시 설치되어야 합니다.');

	$.fn.mySlider = function( _opt ){
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each( function(){
			// 미설치시
			if ( !$.data(this, DATA_NAME) ){
				$.data(this, DATA_NAME, new mySlider(this, _opt));
			}

			// 옵션 설정시
			if ( typeof(_opt) == 'string' && $.data(this, DATA_NAME) ){
				switch( _opt ){
					case 'prev':
						$.data(this, DATA_NAME).prev();
						break;
					case 'next':
						$.data(this, DATA_NAME).next();
						break;
					case 'toIdx':
						$.data(this, DATA_NAME).toIdx.apply(null, args);
						break;
					case 'start':
						$.data(this, DATA_NAME).start();
						break;
					case 'stop':
						$.data(this, DATA_NAME).stop();
						break;
					case 'update':
						$.data(this, DATA_NAME).update();
						break;
					case 'updateViewSize':
						$.data(this, DATA_NAME).updateViewSize();
						break;
					case 'destroy':
						$.data(this, DATA_NAME).destroy();
						break;
				}
			}
		});
	};
})(jQuery, window, document);