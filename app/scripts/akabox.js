(function($, window, document) {
    
    'use strict';

    $.fn.akabox = function(options) {
        
        var config = $.extend({
            debug : true,
            top: '10%',
            left:  0,
            width: '60%',
            marginLeft: '20%',
            fadeInSpeed : 200,
            zoomInSpeed : 250,
            fadeOutSpeed : 200,
            zoomOutSpeed : 250,
            autoplay     : true,
            onOpenedCallback : function(){},
            onClosedCallback : function(){}
        }, options);

        var $box = null,
            $target = null,
            $overlay = null,
            $thumbWrap = null,
            $btnClose = null,
            _thumb = null,
            _thumbSrc = null,
            _thumbW = null,
            _thumbH = null,
            _thumbL = null,
            _thumbT = null,

            $videoWrap = null,
            $video = null,
            _videoSrc = null,
            _scrollTop = null;


        // Insert a box to DOM
        function initBox () {
            /*jshint multistr: true */
            var boxHtml = '<div id="akabox">\
                            <div class="akabox-target">\
                                <div class="akabox-inner">\
                                    <span class="akabox-close">close</span>\
                                    <div class="akabox-thumb"></div>\
                                    <div class="akabox-video"></div>\
                                </div>\
                            </div>\
                            <div class="akabox-overlay"></div>\
                        </div>';

            $(boxHtml).appendTo($('body'));

            $box = $('#akabox');
            $overlay = $box.find('.akabox-overlay');
            $target = $box.find('.akabox-target');
            $thumbWrap = $box.find('.akabox-thumb');
            $videoWrap = $box.find('.akabox-video');
            $btnClose = $box.find('.akabox-close');

            $box.hide();

            $overlay.on('click',function(){
                closeBox();
            });
            $btnClose.on('click',function(){
                closeBox();
            });
        }

        function initImages(ele) {

            $thumbWrap.empty();
            $target.attr('style','');

            ele.on('click', function(e){
                e.preventDefault();
                _thumb = $(this);
                getEleSt(_thumb);
                zoomInBox(_thumb);
            });

            $(window).scroll(function(){
                if(_thumb){
                    getEleSt(_thumb);
                }
            });

            $(window).resize(function(){
                if(_thumb){
                    getEleSt(_thumb);
                }
            });
        }

        function getEleSt(ele) {
            
            var self = ele;

            _thumbSrc = self.attr('src');
            _thumbW   = self.width();
            _thumbH   = self.height();
            _thumbL   = self.offset().left;
            _thumbT   = self.offset().top;
            _scrollTop = $(window).scrollTop();
        }

        function zoomInBox(ele) {

            $thumbWrap.html('<img src="'+ _thumbSrc +'" />');

            $target.css('width', _thumbW)
                    .css('height', _thumbH)
                    .css('left', _thumbL)
                    .css('top', _thumbT - _scrollTop);


            $box.fadeIn( config.fadeInSpeed, function() {
                $target.transition({
                    top: config.top,
                    left: config.left,
                    width: config.width,
                    height: 'auto',
                    marginLeft: config.marginLeft
                }, config.zoomInSpeed, function(){

                    if( ele.data('youtube') ){
                        fetchYoutubeVideo(ele.data('youtube'));
                    }

                    config.onOpenedCallback();
                });
            });
        }

        function closeBox () {
            
            
            $thumbWrap.find('img').css('opacity','1');
            $videoWrap.hide();

            $target.transition({
                top: _thumbT - _scrollTop,
                left: _thumbL,
                width: _thumbW,
                height: _thumbH,
                marginLeft : 0

            }, config.fadeOutSpeed, function(){

                $box.fadeOut( config.zoomOutSpeed, function(){
                    $thumbWrap.empty();
                    $videoWrap.empty();
                    $target.attr('style','');
                    config.onClosedCallback();
                });
            });
        }

        function fetchYoutubeVideo(src) {
            $videoWrap.hide();

            var autoplay = 1,
                html     = '';
            
            if(!config.autoplay){
                autoplay = 0;
            }

            html = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/'+src+'?rel=0&autoplay='+autoplay+'" frameborder="0" allowfullscreen></iframe>';
            
            setTimeout(function(){
                $videoWrap.append(html).show();
                $thumbWrap.find('img').css('opacity','0');                
            }, 500);
        }

                
        initBox();
        
        this.filter('img').each(function() {
            initImages($(this));
        });

        return this;
    };
 
}( jQuery, window, document));
