(function($, window, document) {
    
    'use strict';

    $.fn.zoombox = function( options ) {
        
        var config = $.extend({
            // These are the defaults.
            debug : true,
            videoSrc : null,
            top: '10%',
            left:  0,
            width: '60%',
            marginLeft: '20%',
            onOpenedCallback : function(){},
            onClosedCallback : function(){}
        }, options);

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
            _overlay.on('click',function(){
                closeBox();
            });
        }

        function init(ele) {

            _content.empty();
            _target.attr('style','');

            ele.on('click', function(e){
                e.preventDefault();
                _img = $(this);
                getEleSt(_img);
                zoomInBox(_img);
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
                }, 250, function(){
                    config.onOpenedCallback();
                });
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
                    config.onClosedCallback();
                });
            });
        }

        // initialize every element
        injectTheBox();
        
        this.filter('img').each(function() {
            init($(this));
        });

        return this;
    };
 
}( jQuery, window, document));


(function($, window, document) {

    var Akabox = {

        init: function(options, ele){

            var base = this,
                $ele  = $(ele);

            base.$box     = $('#akabox');
            base.$overlay = base.$box.find('.akabox-overlay');
            base.$target  = base.$box.find('.akabox-target');
            base.$image   = base.$box.find('.akabox-image');
            base.$video   = base.$box.find('.akabox-video');

            $ele.on('click', function(evt){
                evt.preventDefault();
                base.onClicked(options, $(this));
            });
        },

        userActions : function() {
            var base = this;

            base.$box.find('.akabox-close').on('click', function(){
                base.zoomOut(options);
            });
        },

        getEleSt : function (ele) {

            var base = this;

            base._imgSrc   = ele.attr('src');
            base._videoSrc = ele.data('video');
            base._eleW     = ele.width();
            base._eleH     = ele.height();
            base._eleT     = ele.offset().top;
            base._eleL     = ele.offset().left;
            base._scrollTop = $(window).scrollTop();
        },

        onClicked : function(options, ele) {

            var base = this;

            base.getEleSt(ele);
            base.zoomIn(options, ele);
        },

        zoomIn : function(options) {
            
            var base = this;

            base.$image.html('<img src="'+ base._imgSrc +'" />');

            base.$target.css('width', base._eleW)
                        .css('height', base._eleH)
                        .css('left', base._eleL)
                        .css('top', base._eleT - base._scrollTop);

            base.$box.fadeIn( options.fadeInSpeed, function() {
                base.$target.transition({
                    top: options.top,
                    left: options.left,
                    width: options.width,
                    height: 'auto',
                    marginLeft: options.marginLeft
                }, options.zoomInSpeed , function(){
                    options.onOpened();
                });
            });

        },

        zoomOut : function(options) {
            var base = this;

            console.log(base);
            base.$target.transition({
                marginLeft: 0,
                top: base._eleT - base._scrollTop,
                left: base._eleL,
                width: base._eleW,
                height: base._eleH

            }, 250, function(){

                base.$box.fadeOut(250, function(){
                    base.$image.empty();
                    base.$target.attr('style','');
                    options.onClosed();
                });
            });
        }

    };

    $.fn.akabox = function (options) {

         var config = $.extend({
            // These are the defaults.
            debug : true,
            videoSrc : null,
            top: '10%',
            left:  0,
            width: '60%',
            marginLeft: '20%',
            fadeInSpeed : 200,
            zoomInSpeed : 250,
            zoomOutSpeend : 250,
            onOpened : function(){},
            onClosed : function(){}

        }, options);


        /*jshint multistr: true */
        var html =   '<div id="akabox">\
                            <div class="akabox-target">\
                                <div class="akabox-inner">\
                                    <span class="akabox-close">close</span>\
                                    <div class="akabox-image"></div>\
                                    <div class="akabox-video" id="akamai-media-player"></div>\
                                </div>\
                            </div>\
                            <div class="akabox-overlay"></div>\
                        </div>';

        $(html).appendTo($('body'));

        return this.filter('img').each(function() {

            if( $(this).data("akabox-init") === true) {
                return false;
            }
            
            $(this).data("akabox-init", true);

            var akabox = Object.create(Akabox);

            akabox.init(config, this);
        });
    };


}(jQuery, window, document));

