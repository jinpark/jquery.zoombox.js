console.log('\'Allo \'Allo!');

$(document).ready(function(){

	$('.zoombox').on('click',function(e){
		e.preventDefault();
		console.log($(this).offset());

		var ele = $(this),
			src = ele.attr('src'),
			w 	= ele.width(),
			h	= ele.height(),
			l 	= ele.offset().left,
			t 	= ele.offset().top,
			st 	= $(window).scrollTop();

		var html = '<img src="' + src + '" />';

		$(".zb-target")
			.css('width', w)
			.css('height', h)
			.css('left', l)
			.css('top', t - st);

		$('.zb-content').html(html);

		$('#zb-container').fadeIn(200,function(){

			$(".zb-target").transition({
				top: '5%',
				left: 0,
				width: '60%',
				//height: '80%',
				marginLeft: '20%'
			}, 250)
		});


	});


});