/*!
 * jQuery zoombox plugin
 * Original author: @ericsun977
 * Licensed under the MIT license
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
            // beforeOpen : function(){},
            onOpened : function(element){},
            // beforeClose : function(){},
            onClosed : function(element){}
        };

    // The actual plugin constructor
    Zoombox = function( element, options, box ) {

        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this.isAnimating = false;
        this.box = box;
        this.init();
    };

    Zoombox.prototype.init = function () {

        var base = this;

        $(base.element).find('.zoombox-button').on('click', function(e){
            e.preventDefault();
            base.keepStatus(base.element);
            if(!base.isAnimating) {
                base.showBox();    
            }
        });

        $(window).resize(function(){
            // DOTO: Debounced Resize()
            base.keepStatus(base.element);
        });
    };
    
    Zoombox.prototype.keepStatus = function(ele) {
        
        var $ele = $(ele);

        this._thumbSrc = $ele.data('poster');
        this._videoSrc  = $ele.data('video');
        this._eleW      = $ele.width();
        this._eleH      = $ele.height();
        this._eleT      = $ele.offset().top;
        this._eleL      = $ele.offset().left;
        this._scrollTop = $(window).scrollTop();

        if( this._thumbSrc ) {
            this.setThumbnail();
        }

        if(this.options.debug && window.console) {
            console.log(this);
        }
    };

    Zoombox.prototype.setThumbnail = function() {
        var $box = this.box.self;
        $box.find('.zoombox-thumb').html('<img src="'+this._thumbSrc+'" />');
    };

    Zoombox.prototype.showBox = function() {

        var base = this;
            $box = this.box.self;
            $target = this.box.target;

        $box.addClass('active');

        $target.css('width', base._eleW)
                .css('height', base._eleH)
                .css('left', base._eleL)
                .css('top', base._eleT - base._scrollTop);
 
        if (!base.isAnimating) {
            
            base.isAnimating = true;

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

                    base.options.onOpenedCallback(base.element);
                });
            });
        }
        

        $box.find('.zoombox-close, .zoombox-overlay').one('click', function(){

            if (!base.isAnimating) {

                $box.removeClass('opened');

                base.isAnimating = true;

                $target.transition({
                    top: base._eleT - $(window).scrollTop(),
                    left: base._eleL,
                    width: base._eleW,
                    height: base._eleH,
                    marginLeft: '0'
                }, base.options.zoomOutSpeed, 'easeOutExpo', function(){
                    $box.fadeOut(base.options.fadeOutSpeed, 'easeOutQuint', function(){
                        
                        $box.removeClass('active');
                        
                        base.isAnimating = false;

                        $box.find('.zoombox-thumb').html('');
                        $box.find('.zoombox-video').html('');

                        base.options.onClosedCallback(base.element);
                    });
                });
            }
        });
    };

    $.fn.zoombox = function ( options ) {

        var Box = Box || {};

        Box.injectBox = function () {

            //$('#zoombox-modal').remove();

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