console.log('\'Allo \'Allo!');

$(document).ready(function(){
	$('.zoombox').zoombox({
		debug : false,
		onOpenedCallback : function(element){
			console.log(element);
		},
		onClosedCallback : function(){
			console.log('closed');
		}
	});
});
















