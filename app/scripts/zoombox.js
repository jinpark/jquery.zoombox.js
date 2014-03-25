(function($, window, document) {
    
    'use strict';

    $.fn.zoombox = function( options ) {
        
        var config = $.extend({
            // These are the defaults.
            debug : true,
            top: '10%',
            left:  0,
            width: '60%',
            marginLeft: '20%',
            oncomplete : function () {

            }
        }, options );

        var _box = null,
            _overlay = null,
            _content = null,
            _target = null,
            _img = null,
            _imgSrc = null,
            _imgW = null,
            _imgH = null,
            _imgL = null,
            _imgT = null,
            _scrollTop = null;


        // Insert a box to DOM
        function injectTheBox () {
            /*jshint multistr: true */
            var boxHtml = '<div id="zb-container">\
                            <div class="zb-target">\
                                <div class="inner">\
                                    <span class="zb-close">close</span>\
                                    <div class="zb-content"></div>\
                                </div>\
                            </div>\
                            <div class="zb-overlay"></div>\
                        </div>';

            $(boxHtml).appendTo($('body'));

            _box = $('#zb-container');
            _overlay = _box.find('.zb-overlay');
            _content = _box.find('.zb-content');
            _target = _box.find('.zb-target');
            _box.hide();
        }

        function initialize(ele) {

            _content.empty();
            _target.attr('style','');

            ele.on('click', function(e){
                e.preventDefault();

                _img = $(this);
                getEleSt(_img);
                zoomInBox(_img);
            });

            _overlay.on('click',function(){
                closeBox();
            });
            

            $(window).scroll(function(){
                if(_img){
                    getEleSt(_img);    
                }
            });

            $(window).resize(function(){
                if(_img){
                    getEleSt(_img);    
                }
            });
        }

        function getEleSt(ele) {

            var self = ele;

            _imgSrc = self.attr('src');
            _imgW   = self.width();
            _imgH   = self.height();
            _imgL   = self.offset().left;
            _imgT   = self.offset().top;
            _scrollTop = $(window).scrollTop();
        }

        function zoomInBox(ele) {
            var self = ele;

            _content.html('<img src="'+ _imgSrc +'" />');

            _target.css('width', _imgW)
                    .css('height', _imgH)
                    .css('left', _imgL)
                    .css('top', _imgT - _scrollTop);

            _box.fadeIn( 200, function() {
                _target.transition({
                    top: config.top,
                    left: config.left,
                    width: config.width,
                    height: 'auto',
                    marginLeft: config.marginLeft
                }, 250);
            });
        }

        function closeBox () {
            
            _target.transition({
                top: _imgT - _scrollTop,
                left: _imgL,
                width: _imgW,
                height: _imgH,
                marginLeft : 0

            }, 250, function(){

                _box.fadeOut(250, function(){
                    _content.empty();
                    _target.attr('style','');
                });
            });
        }
        
        // initialize every element
        injectTheBox();
        
        this.filter('img').each(function() {
            initialize($(this));
        });

        return this;
    };
 
}( jQuery, window, document));