console.log('\'Allo \'Allo!');

$(document).ready(function(){
	$('.zoombox').zoombox({
		debug : false,
		onInit: function(){
			console.log('init');
		},
		beforeOpen: function(element){
			console.log('beforeOpen');
		},
		onOpened : function(element){
			console.log('onOpened');
		},
		beforeClose: function(element) {
			console.log('beforeClose');
		},
		onClosed : function(element){
			console.log('onClosed');
		}
	});
});
















