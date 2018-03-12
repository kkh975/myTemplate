
$(document).ready( function(){
	var $worklistForm = $('.worklist_form input');
	var $worklistList = $('.worklist_list');
	var $worklistListTits = $worklistList.find('li > button, li > strong');
	var $worklistListLinks = $worklistList.find('a');
	var $worklistListTitSiblings = $worklistListTits.siblings();

	// 링크 select 선택시
	$('.worklist_top select').on('change', function(e){
		var link = e.target.value;
		
		if ( link ) {
			window.open(link)
		}
	});

	// 검색어 입력 시
	$worklistForm.on('keyup change', function(e){
		if ( e.keyCode == 13 ) {
			var val = $worklistForm.val();
			var $hasSelected = $();

			// 초기화
			$worklistListTitSiblings.removeClass('on');
			
			// 각 리스트별로 검사
			$worklistListLinks.each( function() {
				var $this = $( this );
				var $parent = $this.parents('ul').not( $worklistList.find('> ul') ); // 최상위 ul은 제외
				var $selected = $parent.siblings('button, strong').siblings();

				// 부모 노드가 한번이라도 담긴 적이 있고
				// 부모 노드 활성화 된 것과 기존에 부모 노드 활성화 된것이 같다면 검사하지 않음
				// => 계속 펼쳐져 있어야 함으로 
				if ( $hasSelected.length > 0 && $hasSelected.filter('.on').length == $selected.filter('.on').length ) {
					return true; // = continue
				}

				// 검색어 존재하면, 
				// 부모 노드 'on' 추가 
				// 추후 이미 부모 노드 존재여부에 따라 분기하기 위해 저장
				if ( $this.text().indexOf( val ) > -1 ) {
					$selected.addClass('on');
					$.merge( $hasSelected, $selected ); 
				}
			});
		}
	});

	// 목록 모두 보기 클릭 시,
	// 'on' 클래스 있으면 모두 감추기
	// 'on' 클래스 없으면 모두 보이기
	$('#listItemsToggle').on('click', function(e){
		e.preventDefault();

		if ($worklistListTitSiblings.hasClass('on')) {
			$worklistListTitSiblings.removeClass('on');	
		} else {
			$worklistListTitSiblings.addClass('on');	
		}
	});

	// 타이틀 클릭시
	// 주변 DOM toggle
	$worklistListTits.on('click', function(e){
		e.preventDefault();

		$(this)
			.siblings()
			.toggleClass('on')
	});

	// 캐쉬 refrash 기능을 위해 date 파라미터 추가
	$worklistListLinks.on('click', function(e){
		var $this = $( this );
		var link = $this.attr('href');
		var newParam = '?date=' + Date.now();

		$this.attr('href', /\?date\=\d+/.test(link) ? link.replace(/\?date\=\d+/, newParam) : link + newParam);
		$this.attr('target', '_blank')
	});

	// 각 링크에 경로 표현하기
	$worklistListLinks.each( function(){
		var $this = $( this );

		$this.append( '<span class="script_txt">'+ $this.attr('href') +'</span>' )
	});

	// 목록 모두 보기
	$worklistListTitSiblings.addClass('on');
});