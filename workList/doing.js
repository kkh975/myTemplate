
$(document).ready( function(){
	var $worklistForm = $('.worklist_form input');
	var $worklistList = $('.worklist_list');
	var $worklistListTits = $worklistList.find('[class^="min_tit"]');
	var $worklistListLinks = $worklistList.find('a');

	$worklistForm.on('change', function(e){
		$worklistListTits.each( function() {
			var $this = $( this );

			if ( $this.text().indexOf( $worklistForm.val() ) > -1) {
				$this.parents('ul').addClass('on');
				$this.next('ul').addClass('on');
			}
		});
		$worklistListLinks.each( function() {
			var $this = $( this );

			if ( $this.text().indexOf( $worklistForm.val() ) > -1) {
				$this.parents('ul').addClass('on');
			}
		});
	});

	$worklistListTits.on('click', function(e){
		e.preventDefault();

		$(this).next('ul').toggleClass('on')
	});

	// 캐쉬 삭제 기능을 위해 date 파라미터 추가
	$worklistListLinks.on('click', function(e){
		var $this = $( this );
		var link = $this.attr('href');
		var newParam = '?date=' + Date.now();

		$this.attr('href', /\?date\=\d+/.test(link) ? link.replace(/\?date\=\d+/, newParam) : link + newParam)
	});

	// 목록 모두 보기
	$('#listItemsShow').on('click', function(e){
		e.preventDefault();
		$worklistListTits.next('ul').addClass('on')
	});

	// 목록 모두 닫기
	$('#listItemsHide').on('click', function(e){
		e.preventDefault();
		$worklistListTits.next('ul').removeClass('on')
	});
});