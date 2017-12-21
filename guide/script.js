

/*
 * howto 표현하기
 */
function function_name() {
	// body...
}

/*
 * Guide LNB
 */
function guideLnb() {
	$('.guide_lnb a').on('click', function(e){
		var $this = $(this)

		if ($this.attr('target') != '_blank') {
			e.preventDefault();

			$('.guide_window').attr('src', $this.attr('href'));	
		}
	})
}

function guideViewSize() {
	var $win = $( window );
	var $body = $('.guide_body');

	$body.height( $win.height() )

	$win.on('resize', function(){
		$body.height( $win.height() )
	})
}


$(document).ready( function(){
	guideLnb();
	guideViewSize();
});