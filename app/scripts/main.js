console.log('\'Allo \'Allo!');

$(document).ready(function(){
	$('.zoombox').zoombox({
		debug : false,
		onOpenedCallback : function(){
			console.log('opened');
		},
		onClosedCallback : function(){
			console.log('closed');
		}
	});
});
















