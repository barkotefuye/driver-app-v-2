/*

Theme: Spyre - Slick contemporary multipurpose theme
Product Page: https://themes.getbootstrap.com/product/spyre-slick-contemporary-multipurpose-theme
Author: Webinning
Author URI: https://webinning.co.uk

---

Copyright 2018 Webinning

*/


'use strict';


// Preloader

var Preloader = new Promise(function(resolve) {
    // Variables
    var $preloader = $('.preloader'),
        $spinner = $('.spinner');

    
    // Methods
    function init() {
        $spinner.delay(750).fadeOut();

        setTimeout(function(){
            $preloader.delay(750).fadeOut('slow');
            
            resolve();
        }, 350);
    }
    

    // Events
    if($preloader.length) {
        $(window).on({
            'load': function() {
                init();
            }
        })
    }
});



// Navbar colors

var Navbar = (function() {
    // Variables
    var $navbar = $('.spyre-navbar'),
        $transparent = $navbar.data('transparent'),
        $textColor = $navbar.data('text-color'),
        $origBgColor = $navbar.css('background-color'),
        $navbarText = $navbar.find('.navbar-text'),
        $navbarTextLink = $navbar.find('.navbar-text a:not(".btn")'),
        $firstSection = $('main').find('section:first-child');

    
    // Methods
    function init() {
        var scrollTop = $(window).scrollTop(),
            $width = $(window).width(),
            height = $firstSection.find('.bg-container').length ? $firstSection.outerHeight() : 800,
            calc = ((scrollTop / height) * 1.5).toString();

        if($width >= 992) {
            if($origBgColor.indexOf('a') == -1){
                var newColor = $origBgColor.replace(')', ', ' + calc + ')').replace('rgb', 'rgba');
                $navbar.attr('style', 'background-color: ' + newColor + '!important');
    
                if(calc > '0.4') {
                    $navbarText.css('color', $textColor);
                    $navbarTextLink.css('color', $textColor);
                } else {
                    $navbarText.css('color', '');
                    $navbarTextLink.css('color', '');
                }
    
                if (calc > '0.97') {
                    newColor = $origBgColor.replace(')', ', 0.97)').replace('rgb', 'rgba');
                    $navbar.attr('style', 'background-color: ' + newColor + '!important');
                }
            }   
        } else {
            $navbar.attr('style', 'background-color: ' + $origBgColor + '!important');
            $navbarText.css('color', $textColor);
            $navbarTextLink.css('color', $textColor);
        }
    }
    

    // Events
    if($navbar.length && typeof $transparent != 'undefined') {
        init();

        $(window).on({
            'scroll resize': function() {
                init();
            }
        });
    }
}());



// Spyre Menu

var Menu = (function() {
    // Variables
    var $toggler = $('.menu-toggle'),
        $overlay = $('.spyre-navbar-overlay'),
        $nav = $('.spyre-navbar-nav'),
        $search = $('.search i'),
        $navText = $('.navbar-text');

    
    // Methods
    function openOverlay() {
        $toggler.addClass('open');
        $overlay.addClass('open');
        $nav.addClass('open');
        $navText.css('z-index', -1);
    }

    function closeOverlay() {
        $nav.removeClass('open');

        setTimeout(function(){
            $toggler.removeClass('open');
            $overlay.removeClass('open');
            $navText
            .delay(800)
            .queue(function (next) { 
                $(this).css('z-index', 0); 
                next(); 
            });
        }, 500);
    }

    function openSearch() {
        $search.parent().addClass('open');
    }

    function closeSearch() {
        $search.parent().removeClass('open');
    }
    

    // Events
    if($overlay.length) {
        $toggler.on({
            'click': function() {
                if(($(this)).hasClass('open')){
                    closeOverlay();

                    if($search.length){
                        closeSearch();
                    }
                } else {
                    openOverlay();
                }
            }
        });   
    }

    if($search.length) {
        $search.on({
            'click': function() {
                if($overlay.length){
                    openOverlay();
                }
                setTimeout(function(){
                    openSearch();
                }, 500);
            }
        });   
    }
})();



// Dropdown toggle (animated)

var DropdownToggle = (function() {
    //Variables
    var $toggle = $('.dropdown-toggle'),
        $dropdown = $('.dropdown-menu');

    
    // Methods
    function init($this) {
        $dropdown.not($this.next('.dropdown-menu')).slideUp(500);
        $this.next('.dropdown-menu').slideToggle(500);
    }
    

    // Events
    if($toggle.length) {
        $toggle.on({
            'click': function() {
                init($(this));
            }
        });
    }
}());



// Sticky

var Sticky = (function() {
    //Variables
    var $sticky = $('[data-toggle="sticky"]');

    
    // Methods
    function init($this){
        var $width = $(window).width(),
            $mobile = typeof $this.data('sticky-disable-mobile') != 'undefined' ? $this.data('sticky-disable-mobile') : true;

        if($mobile) {
            if ($width >= 992) {
                stick($this);
            } else {
                unstick($this);
            }
        } else {
            stick($this);
        }
    }

    function stick($this) {
        var $offsetTop = $this.data('sticky-offset-top') || 0,
            $parentSelector = $this.data('sticky-parent') || 'section',
            $bottoming = typeof $this.data('sticky-bottom') != 'undefined' ? $this.data('sticky-bottom') : true;

        $this.stick_in_parent({
            'parent': $parentSelector,
            'offset_top': $offsetTop,
            'bottoming': $bottoming
        });
    }

    function unstick($this) {
        $this.trigger("sticky_kit:detach");
    }
    

    // Events
    if($sticky.length) {
        $sticky.each(function() {
            init($(this));      
        });

        $(window).on({
            'resize': function() {
                $sticky.each(function() {
                    init($(this)); 
                });
            }
        })
    }
}());



// Parallax

var Parallax = (function() {
    // Variables
    var $rellax = $('.parallax');

    
    // Methods
    function init($this) {
        var rellax = new Rellax('.parallax');
    }
    

    // Events
    if($rellax.length) {
        init();
    }
}());



// Smooth scroll

var SmooothScroll = (function() {
    // Variables
    var $link = $('[data-smooth-scroll]'),
        $offset = $link.data('smooth-scroll-offset') || 0,
        $body = $('html, body');

    
    // Methodss
    function init($this) {
        var $hash = $this.data('smooth-scroll-hash');
        
        // If you want to stop prevent url changes, like #link just add
        if(typeof $hash != 'undefined' && $hash === false) {
            event.preventDefault();
        }
        scrollTo($this);
    }

    function scrollTo($this) {
        var $elem = $this.attr('href') ? $this.attr('href') : $this;

        $body.stop(true, true).animate({
            scrollTop: $($elem).offset().top - $offset
        }, 800, function(){
            
        });
    }
    

    // Events
    if ($link.length && $link.hash !== '') {
        $link.on({
            'click': function(event) {
                init($(this));
            }
        })
    }
}());



// Background text

var BackgroundText = (function() {
    // Variables
    var $bg = $('[data-background-text], .bg-text');

    
    // Methods
    function init($this) {
        var $color = $this.data('color'),
            $opacity = $this.data('opacity'),
            $fontSize = $this.data('font-size'),
            $fontWeight = $this.data('font-weight'),
            $offsetX = $this.data('offset-x'),
            $offsetY = $this.data('offset-y'),
            $padding = $this.data('padding'),
            $margin = $this.data('margin'),
            $letterSpacing = $this.data('letter-spacing');

        $this.css({
            'color': $color,
            'opacity': $opacity,
            'font-size': $fontSize,
            'font-weight': $fontWeight,
            'left': $offsetX,
            'top': $offsetY,
            'padding': $padding,
            'margin': $margin,
            'letter-spacing': $letterSpacing
        })
    }
    

    // Events
    if($bg.length) {
        $bg.each(function() {
			init($(this));
        });
    }
}());



// Typed text

var Typed = (function() {
    // Variables
    var $typed = $('[data-typed-text], .typed');

    
    // Methods
    function init($this, index) {
        var id = 'typed_' + index,
            $strings = $this.data('typed-text').split('###'),
            $loop = typeof $this.data('typed-loop') != 'undefined' ? $this.data('typed-loop') : true,
            $typeSpeed = $this.data('typed-speed') || 100,
            $backSpeed = $this.data('typed-back-speed') || 50,
            $backDelay = $this.data('typed-back-delay') || 1000,
            $startDelay = $this.data('typed-start-delay') || 0,
            $cursorChar = $this.data('typed-cursor') || '';

        $this.attr('data-typed-id', id);

		var options = {
			strings: $strings,
            typeSpeed: $typeSpeed,
            backSpeed: $backSpeed,
            startDelay: $startDelay,
            cursorChar: $cursorChar,
            loop: $loop,
            backDelay: $backDelay
        };

        // Init TypedJS
        var typed = new Typed('[data-typed-id='+ id +']', options);
        typed.stop();

        // When Preloader is ready
        if($('.preloader').length) {
            Preloader.then(function() {
                setTimeout(function(){
                    typed.start();
                }, 1500);
            }, function(error) {
    
            });
        } else {
            setTimeout(function(){
                typed.start();
            }, 1500);
        }
    }
    

    // Events
    if($typed.length) {
        $typed.each(function(i) {
            init($(this), i);
        });
    }
}());



// Google map

var GoogleMap = (function() {
    // Variables
    var $map = $('[data-latlng]');


    // Methods
    function init() {
        $map.each(function(i) {
            var $this = $(this),
                $coords = $this.data('latlng').split(','),
                $center = {lat: parseFloat($coords[0]), lng: parseFloat($coords[1])},
                $infoWindow = $this.html(),
                $zoom = (typeof $this.data('zoom') != 'undefined') ? $this.data('zoom') : 14,
                $icon = $this.data('marker'),
                $options = {},
                $zoomControl= (typeof $(this).data('zoom-control') != 'undefined') ? $this.data('zoom-control') : true,
                $mapTypeControl= (typeof $(this).data('map-type-control') != 'undefined') ? $this.data('map-type-control') : true,
                $scaleControl= (typeof $(this).data('scale-control') != 'undefined') ? $this.data('scale-control') : true,
                $streetViewControl= (typeof $(this).data('street-view-control') != 'undefined') ? $this.data('street-view-control') : true,
                $rotateControl= (typeof $(this).data('rotate-control') != 'undefined') ? $this.data('rotate-control') : true,
                $fullscreenControl= (typeof $(this).data('full-screen-control') != 'undefined') ? $this.data('full-screen-control') : true,
                $disableDefaultUI = (typeof $(this).data('disable-default-ui') != 'undefined') ?$this.data('disable-default-ui') :false,
                $styles = (typeof $(this).data('styles') != 'undefined') ?$this.data('styles') : [],
                $streetview = (typeof $(this).data('streetview') != 'undefined') ?$this.data('streetview') : false,
                $povHeading = (typeof $(this).data('pov-heading') != 'undefined') ?$this.data('pov-heading') : 0,
                $povPitch = (typeof $(this).data('pov-pitch') != 'undefined') ?$this.data('pov-pitch') : 0;

                if($disableDefaultUI) {
                    $options = {
                        disableDefaultUI: $disableDefaultUI
                    }
                } else {
                    $options = {
                        zoomControl: $zoomControl,
                        mapTypeControl: $mapTypeControl,
                        scaleControl: $scaleControl,
                        streetViewControl: $streetViewControl,
                        rotateControl: $rotateControl,
                        fullscreenControl: $fullscreenControl
                    }
                }
                
                // Setup map options
                var mapOptions = {
                    zoom: $zoom,
                    center: $center,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: $styles
                };
                
                // Add extra inline options
                mapOptions = $.extend(mapOptions, $options);

                // Create map
                var map = new google.maps.Map($this.get(0), mapOptions);

                // Create streetview
                if($streetview) {
                    var panorama = new google.maps.StreetViewPanorama($this.get(0), {
                        position: $center,
                        pov: {heading: $povHeading, pitch: $povPitch}
                    });
                    map.setStreetView(panorama);
                }

                // Create map markers
                var marker = new google.maps.Marker({
                    position: $center,
                    map: map,
                    icon: $icon
                });

                // Infowindow
                if($infoWindow.length) {
                    var contentString = $infoWindow;

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
    
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });
                }
        });
    }


    // Events
    if($map.length) {
        google.maps.event.addDomListener(window, 'load', init());
    }

}());



// Carousel

var Carousel = (function() {
    // Variables
    var $carousel = $('.owl-carousel');

    
    // Methods
    function init($this, index) {
        var $inlineOptoins = $this.data('carousel-options'),
            id = 'carousel_' + index;

        if($this.hasClass('carousel-nav-pos-edge')) {
            $this.after('<div class="container-nav container" id="' + id + '"><div class="owl-nav"></div></div>');
        }

        var $options = {
            margin: 0,
            stagePadding: 0,
            navText: ['<i class="zmdi zmdi-long-arrow-left"></i>','<i class="zmdi zmdi-long-arrow-right"></i>'],
            // navContainer: $this.hasClass('carousel-nav-pos-edge') ? '#' + id  + ' .owl-nav': false
        },
        options = $.extend($options, $inlineOptoins);

        $this.owlCarousel(options);
    }
    

    // Events
    if($carousel.length) {
        $carousel.each(function(i) {
            init($(this), i);
        });
    }
}());



// Vimeo and YouTube video players

var Player = (function() {
    // Variables
    var $vimeo = $('.vimeo'),
        $youTube = $('.youtube');

    
    // Methods
    function playVimeo($this) {
        $('.vimeo').vimeo_player();
    }

    function playYouTube($this) {
        $('.youtube').YTPlayer();
    }
    

    // Events
    if($vimeo.length) {
        playVimeo();
    }

    if($youTube.length) {
        playYouTube();
    }
}());



// Countdown

var Countdown = (function() {
    // Variables
    var $countdown = $('[data-countdown]');

    
    // Methods
    function init($this) {
        var finalDate = $this.data('countdown');

        $this.countdown(finalDate, function(event) {
            if(typeof $this.data('countdown-template') != 'undefined') {
                $this.html(event.strftime($this.data('countdown-template')));
            } else {
                $this.html(event.strftime('%D days %H:%M:%S'));
            }
            
        });
    }
    

    // Events
    if($countdown.length) {
        $countdown.each(function() {
            init($(this));
        });
    }
}());



// Isotope

var Isotope = (function() {
    // Variables
    var $grid = $('.grid, [data-isotope]'),
        $filter = $('[data-filter]'),
        $options = {
            itemSelector: '.grid-item',
            layoutMode: 'packery'
        };

    
    // Methods
    function init($this) {
        $grid.imagesLoaded( function() {
            // init Isotope after all images have loaded
            $grid.isotope($options);
        });
    }

    function filter($this) {
        var $filterValue = $this.data('filter'),
            filterOptions = {
                filter: $filterValue
            },
            $options = $.extend(filterOptions, $options);

        $grid.isotope($options);

        $filter.removeClass('active');
        $this.addClass('active');

        // Message if no result
        if(!$grid.data('isotope').filteredItems.length){
            $grid.append('<p class="no-grid-result text-center text-600 py-8">Unfortunately there is no result!</p>')
        } else {
            $grid.find('.no-grid-result').remove();
        }
    }
    

    // Events
    if($grid.length) {
        init($(this));

        if($filter.length) {
            $filter.on({
                'click': function() {
                    filter($(this));
                }
            })
        }
    }

}());



// Animations

var Animation = (function() {
    // Variables
    var $aos = $('[data-aos]');
    
    
    // Methods
    function init() {
        if($('.preloader').length) {
            Preloader.then(function() {
                setTimeout(function(){
                    AOS.init({
                        offset: 150,
                        delay: 0,
                        once: true,
                    });
                }, 1000);
            }, function(error) {
    
            });
        } else {
            AOS.init({
                offset: 150,
                delay: 0,
                once: true,
            });
        }
    }
    

    // Events
    if($aos.length){
        init();
    }

}());