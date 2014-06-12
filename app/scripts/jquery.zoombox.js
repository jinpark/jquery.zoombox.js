/*!
 * jQuery zoombox plugin
 * Original author: @ericsun977
 * Licensed under the MIT license
 * Required libraries & plugins: 
 *  jquery
 *  jquery.easing 1.3+
 *  jquery.transit 0.9.9+
 */


;(function ( $, window, document, undefined ) {

    var pluginName = 'zoombox',
        defaults = {
            debug : false,
            top: '10%',
            left:  0,
            width: '80%',
            height: '80%',
            marginLeft: '10%',
            fadeInSpeed : 250,
            zoomInSpeed : 500,
            fadeOutSpeed : 250,
            zoomOutSpeed : 500,
            autoplay     : true,
            onInit: function(){},
            beforeOpen : function(element){},
            onOpened : function(element){},
            beforeClose : function(element){},
            onClosed : function(element){}
        };

    // The actual plugin constructor
    Zoombox = function( element, options, box ) {

        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this.isAnimating = false;
        this.box = box;
        this.data = {};
        this.init();
    };

    Zoombox.prototype.init = function () {

        var base = this;

        if (!base.box.isInited) {
            base.options.onInit();
            base.box.isInited = true;
        }

        $(base.element).find('.zoombox-button').on('click', function(e){
            e.preventDefault();
            base.keepStatus(base.element);

            if(!base.isAnimating) {
                base.showBox();    
            }
        });

        $(window).resize(function(){
            base.updateStatus(base.element);
        });
    };
    
    Zoombox.prototype.keepStatus = function(ele) {
        
        var $ele = $(ele);

        this.data._eleW      = $ele.width();
        this.data._eleH      = $ele.height();
        this.data._eleT      = $ele.offset().top;
        this.data._eleL      = $ele.offset().left;
        this.data._scrollTop = $(window).scrollTop();
        this.data._thumbSrc = $ele.data('poster');
        this.data._videoSrc  = $ele.data('video');

        if(this.options.debug && window.console) {
            console.log(this.data);
        }
    };

    Zoombox.prototype.updateStatus = function(ele) {
        var $ele = $(ele);
        this.data._eleW      = $ele.width();
        this.data._eleH      = $ele.height();
        this.data._eleT      = $ele.offset().top;
        this.data._eleL      = $ele.offset().left;
        this.data._scrollTop = $(window).scrollTop();

        if(this.options.debug && window.console) {
            console.log(this.data);
        }
    };

    Zoombox.prototype.showBox = function() {

        var base = this;
            $box = this.box.self;
            $target = this.box.target;

        if( base.data._thumbSrc ) {
            $box.find('.zoombox-thumb').html('<img src="'+this.data._thumbSrc+'" />');
        }

        $box.addClass('active');

        $target.css('width', base.data._eleW)
                .css('height', base.data._eleH)
                .css('left', base.data._eleL)
                .css('top', base.data._eleT - base.data._scrollTop);
 
        if (!base.isAnimating) {
            
            base.isAnimating = true;

            base.options.beforeOpen(base.element);

            $box.fadeIn( base.options.fadeInSpeed, 'easeOutQuint', function() {
                $target.transition({
                    top: base.options.top,
                    left: base.options.left,
                    width: base.options.width,
                    height: base.options.height,
                    marginLeft: base.options.marginLeft
                }, base.options.zoomInSpeed, 'easeOutExpo', function(){
                    
                    $box.addClass('opened');
                    
                    base.isAnimating = false;

                    base.options.onOpened(base.element);
                });
            });
        }
        

        $box.find('.zoombox-close, .zoombox-overlay').one('click', function(){

            if (!base.isAnimating) {

                $box.removeClass('opened');

                base.isAnimating = true;

                base.options.beforeClose(base.element);

                $target.transition({
                    top: base.data._eleT - $(window).scrollTop(),
                    left: base.data._eleL,
                    width: base.data._eleW,
                    height: base.data._eleH,
                    marginLeft: '0'
                }, base.options.zoomOutSpeed, 'easeOutExpo', function(){
                    $box.fadeOut(base.options.fadeOutSpeed, 'easeOutQuint', function(){
                        
                        $box.removeClass('active');
                        $target.attr('style','');
                        base.data = {};

                        base.isAnimating = false;

                        $box.find('.zoombox-thumb').html('');
                        $box.find('.zoombox-video').html('');

                        base.options.onClosed(base.element);
                    });
                });
            }
        });
    };

    $.fn.zoombox = function ( options ) {

        var Box = Box || {};

        Box.isInited = false;

        Box.injectBox = function () {

            /*jshint multistr: true */
            var boxHtml = '<div id="zoombox-modal">\
                            <div class="zoombox-target">\
                                <div class="zoombox-inner">\
                                    <span class="zoombox-close">close</span>\
                                    <div class="zoombox-thumb"></div>\
                                    <div id="akamai-media-player" class="zoombox-video"></div>\
                                </div>\
                            </div>\
                            <div class="zoombox-overlay"></div>\
                        </div>';

            $(boxHtml).appendTo($('body'));
        };

        Box.init = function() {
            var $box        = $('#zoombox-modal');
            this.self      = $box;
            this.target     = $box.find('.zoombox-target');
        };

        Box.injectBox();
        Box.init();

        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Zoombox( this, options, Box));
            }
        });
    }

})( jQuery, window, document );