/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.vimeo_player.js                                                                                                                   _
 _ last modified: 26/12/16 15.39                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2016. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

/* src-block */
alert( "This is the 'jquery.mb.vimeo_player.src.js' javascript file and can't be included. Use the one you find in the 'dist' folder!" )
/* end-src-block */

var get_vimeo_videoID = function( url ) {

  var videoID;
  if( url.indexOf( "vimeo.com" ) > 0 ) {
    videoID = url.substr( url.lastIndexOf( "/" ) + 1, url.length );
  } else {
    videoID = url.length > 15 ? null : url;
  }

  return videoID
};


( function( $ ) {
  jQuery.vimeo_player = {
    name: "jquery.mb.vimeo_player",
    author: "Matteo Bicocchi (pupunzi)",
    version: "{{ version }}",
    build: "{{ buildnum }}",
    defaults: {
      containment: "body",
      ratio: 16/9, // "16/9" or "4/3"
      videoURL: null,
      startAt: 0,
      stopAt: 0,
      autoPlay: true,
      fadeTime: 10,
      vol: 5, // 1 to 10
      addRaster: false,
      opacity: 1,
      mute: true,
      loop: true,
      showControls: true,
      show_vimeo_logo: true,
      stopMovieOnBlur: true,
      realfullscreen: true,
      mobileFallbackImage: null,
      gaTrack: false,
      optimizeDisplay: true,
      mask: false,
      align: "center,center", // top,bottom,left,right
      onReady: function( player ) {}
    },
    /**
     *  @fontface icons
     *  */
    controls: {
      play: "P",
      pause: "p",
      mute: "M",
      unmute: "A",
      fullscreen: "O",
      showSite: "R",
      logo: "V"
    },
    buildPlayer: function( options ) {

			//console.time("Vimeo_start")

			var isIframe = function() {
        var isIfr = false;
        try {
          if( self.location.href != top.location.href ) isIfr = true;
        } catch( e ) {
          isIfr = true;
        }
        return isIfr;
      };

      var script = document.createElement( 'script' );
      script.src = "//player.vimeo.com/api/player.js";
      script.onload = function() {
        jQuery( document ).trigger( "vimeo_api_loaded" );
      };
      document.head.appendChild( script );

      return this.each( function() {

        var vimeo_player = this;
        var $vimeo_player = jQuery( vimeo_player );
        vimeo_player.loop = 0;
        vimeo_player.opt = {};
        vimeo_player.state = {};
        vimeo_player.id = vimeo_player.id || "YTP_" + new Date().getTime();
        $vimeo_player.addClass( "vimeo_player" );

        var property = $vimeo_player.data( "property" ) && typeof $vimeo_player.data( "property" ) == "string" ? eval( '(' + $vimeo_player.data( "property" ) + ')' ) : $vimeo_player.data( "property" );

        jQuery.extend( vimeo_player.opt, jQuery.vimeo_player.defaults, options, property );
        vimeo_player.opt.ratio = vimeo_player.opt.ratio == "auto" ? 16/9 : vimeo_player.opt.ratio;

        if( eval( vimeo_player.opt.loop ) )
          vimeo_player.opt.loop = 9999;

        vimeo_player.isRetina = ( window.retina || window.devicePixelRatio > 1 );

        vimeo_player.canGoFullScreen = !( jQuery.browser.msie || jQuery.browser.opera || isIframe() );
        if( !vimeo_player.canGoFullScreen ) vimeo_player.opt.realfullscreen = false;

        vimeo_player.isAlone = false;
        vimeo_player.hasFocus = true;

        vimeo_player.videoID = this.opt.videoURL ? get_vimeo_videoID( this.opt.videoURL ) : $vimeo_player.attr( "href" ) ? get_vimeo_videoID( $vimeo_player.attr( "href" ) ) : false;

        vimeo_player.isSelf = vimeo_player.opt.containment == "self";

        vimeo_player.opt.containment = vimeo_player.opt.containment == "self" ? jQuery( this ) : jQuery( vimeo_player.opt.containment );
        vimeo_player.opt.vol = vimeo_player.opt.vol/10;

        vimeo_player.isBackground = vimeo_player.opt.containment.is( "body" );

        if( vimeo_player.isBackground && vimeo_player.backgroundIsInited )
          return;

        vimeo_player.canPlayOnMobile = vimeo_player.isSelf && jQuery( this ).children().length === 0;

        if( !vimeo_player.isSelf ) {
          $vimeo_player.hide();
        }

        var overlay = jQuery( "<div/>" ).css( {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        } ).addClass( "vimeo_player_overlay" );

        if( vimeo_player.isSelf ) {
          overlay.on( "click", function() {
            $vimeo_player.togglePlay();
          } )
        }

        var playerID = "vimeo_player_" + vimeo_player.id;

        var wrapper = jQuery( "<div/>" ).addClass( "vimeo_player_wrapper" ).attr( "id", "vimeo_player_wrapper_" + playerID );
        wrapper.css( {
          position: "absolute",
          zIndex: 0,
          minWidth: "100%",
          minHeight: "100%",
          left: 0,
          top: 0,
          overflow: "hidden",
          opacity: 0
        } );

        vimeo_player.playerBox = jQuery( "<iframe/>" ).attr( "id", playerID ).addClass( "playerBox" );
        vimeo_player.playerBox.css( {
          position: "absolute",
          zIndex: 0,
          /*
           width: "100%",
           height: "100%",
           top: -10,
           */
          frameBorder: 0,
          overflow: "hidden",
          left: 0
        } ).attr( {
          src: "//player.vimeo.com/video/" + vimeo_player.videoID + "?background=1"
        } );

        vimeo_player.opt.containment.prepend( wrapper );

        if( !jQuery.browser.mobile || vimeo_player.canPlayOnMobile )
          wrapper.append( vimeo_player.playerBox );
        else {
          if( vimeo_player.opt.mobileFallbackImage ) {
            wrapper.css( {
              backgroundImage: "url(" + vimeo_player.opt.mobileFallbackImage + ")",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              opacity: 1
            } )
          };

          setTimeout( function() {
            var VEvent = jQuery.Event( 'VPFallback' );
            $vimeo_player.trigger( VEvent );
          }, 1000 );

          $vimeo_player.hide();
          return $vimeo_player;
        }

        vimeo_player.opt.containment.children().not( "script, style" ).each( function() {
          if( jQuery( this ).css( "position" ) == "static" ) jQuery( this ).css( "position", "relative" );
        } );

        if( vimeo_player.isBackground ) {
          jQuery( "body" ).css( {
            boxSizing: "border-box"
          } );

          wrapper.css( {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0
          } );

        } else if( vimeo_player.opt.containment.css( "position" ) == "static" )
          vimeo_player.opt.containment.css( {
            position: "relative"
          } );

        vimeo_player.videoWrapper = wrapper;
        /*
         vimeo_player.playerBox.css( {
         opacity: 1,
         frameBorder: 0
         } );
         */

        if( !jQuery.browser.mobile ) {
          vimeo_player.playerBox.after( overlay );
          vimeo_player.overlay = overlay;
        }

        if( !vimeo_player.isBackground ) {
          overlay.on( "mouseenter", function() {
            if( vimeo_player.controlBar && vimeo_player.controlBar.length )
              vimeo_player.controlBar.addClass( "visible" );
          } ).on( "mouseleave", function() {
            if( vimeo_player.controlBar && vimeo_player.controlBar.length )
              vimeo_player.controlBar.removeClass( "visible" );
          } );
        }

        jQuery( document ).on( "vimeo_api_loaded", function() {

          vimeo_player.player = new Vimeo.Player( playerID, options );
          vimeo_player.player.ready().then( function() {

            var VEvent;

            function start() {
              vimeo_player.isReady = true;
              if( vimeo_player.opt.mute ) {
                setTimeout( function() {
                  $vimeo_player.v_mute();
                }, 1 );
              }

              if( vimeo_player.opt.showControls )
                jQuery.vimeo_player.buildControls( vimeo_player );

              if( vimeo_player.opt.autoPlay ) {
								//setTimeout(function () {
									$vimeo_player.v_play();
									VEvent = jQuery.Event('VPStart');
									$vimeo_player.trigger(VEvent);
									$vimeo_player.v_optimize_display();
								//}, vimeo_player.opt.fadeTime)
							} else {
								$vimeo_player.v_pause();
							}

              VEvent = jQuery.Event( 'VPReady' );
              VEvent.opt = vimeo_player.opt;
              $vimeo_player.trigger( VEvent );
              if( typeof vimeo_player.opt.onReady == "function" )
                vimeo_player.opt.onReady( vimeo_player )
              $vimeo_player.v_optimize_display();
            }

            if( vimeo_player.opt.startAt ) {
              vimeo_player.player.play().then( function() {
                vimeo_player.player.pause();
              } );
              $vimeo_player.v_seekTo( vimeo_player.opt.startAt, function() {
                start()
              } );
            } else {
              start();
            }

            jQuery( window ).off( "resize.vimeo_player_" + vimeo_player.id ).on( "resize.vimeo_player_" + vimeo_player.id, function() {
              clearTimeout(vimeo_player.optimizeD);
	            vimeo_player.optimizeD = setTimeout(function(){
		            $vimeo_player.v_optimize_display();
              },150)
            } );

            //PROGRESS
            vimeo_player.player.on( "progress", function( data ) {
              VEvent = jQuery.Event( 'VPProgress' );
              VEvent.data = data;
              $vimeo_player.trigger( VEvent );

            } );

            //ERROR
            vimeo_player.player.on( "error", function( data ) {
              vimeo_player.state = -1;
              //console.debug( "error:: ", data );
              // Trigger state events
              VEvent = jQuery.Event( 'VPError' );
              VEvent.error = data;
              $vimeo_player.trigger( VEvent );
            } );

            //PLAY
            vimeo_player.player.on( "play", function( data ) {
              vimeo_player.state = 1;
              $vimeo_player.trigger( "change_state" );

              if( vimeo_player.controlBar && vimeo_player.controlBar.length )
                vimeo_player.controlBar.find( ".vimeo_player_pause" ).html( jQuery.vimeo_player.controls.pause );

              if( typeof _gaq != "undefined" && eval( vimeo_player.opt.gaTrack ) ) _gaq.push( [ '_trackEvent', 'vimeo_player', 'Play', vimeo_player.videoID ] );
              if( typeof ga != "undefined" && eval( vimeo_player.opt.gaTrack ) ) ga( 'send', 'event', 'vimeo_player', 'play', vimeo_player.videoID );

              // Trigger state events
              VEvent = jQuery.Event( 'VPPlay' );
              VEvent.error = data;
              $vimeo_player.trigger( VEvent );


              //Add raster image
              if( vimeo_player.opt.addRaster ) {
                var classN = vimeo_player.opt.addRaster == "dot" ? "raster-dot" : "raster";
                vimeo_player.overlay.addClass( vimeo_player.isRetina ? classN + " retina" : classN );
              } else {
                vimeo_player.overlay.removeClass( function( index, classNames ) {
                  // change the list into an array
                  var current_classes = classNames.split( " " ),
                      // array of classes which are to be removed
                      classes_to_remove = [];
                  jQuery.each( current_classes, function( index, class_name ) {
                    // if the classname begins with bg add it to the classes_to_remove array
                    if( /raster.*/.test( class_name ) ) {
                      classes_to_remove.push( class_name );
                    }
                  } );
                  classes_to_remove.push( "retina" );
                  // turn the array back into a string
                  return classes_to_remove.join( " " );
                } )
              }

            } );

            //PAUSE
            vimeo_player.player.on( "pause", function( data ) {
              vimeo_player.state = 2;
              $vimeo_player.trigger( "change_state" );

              if( vimeo_player.controlBar && vimeo_player.controlBar.length )
                vimeo_player.controlBar.find( ".vimeo_player_pause" ).html( jQuery.vimeo_player.controls.play );

              VEvent = jQuery.Event( 'VPPause' );
              VEvent.time = data;
              $vimeo_player.trigger( VEvent );

            } );

            //SEEKED
            vimeo_player.player.on( "seeked", function( data ) {
              vimeo_player.state = 3;
              $vimeo_player.trigger( "change_state" )
            } );

            //ENDED
            vimeo_player.player.on( "ended", function( data ) {
              vimeo_player.state = 0;
              $vimeo_player.trigger( "change_state" );

              VEvent = jQuery.Event( 'VPEnd' );
              VEvent.time = data;
              $vimeo_player.trigger( VEvent );

            } );

            //TIME UPDATE
            vimeo_player.player.on( "timeupdate", function( data ) {

              vimeo_player.duration = data.duration;
              vimeo_player.percent = data.percent;
              vimeo_player.seconds = data.seconds;

              vimeo_player.state = 1;
              vimeo_player.player.getPaused().then( function( paused ) {
                if( paused )
                  vimeo_player.state = 2;
              } );

              if( vimeo_player.opt.stopMovieOnBlur ) {
                if( !document.hasFocus() ) {
                  if( vimeo_player.state == 1 ) {
                    vimeo_player.hasFocus = false;
                    $vimeo_player.v_pause();
                    vimeo_player.document_focus = setInterval( function() {
                      if( document.hasFocus() && !vimeo_player.hasFocus ) {
                        vimeo_player.hasFocus = true;
                        $vimeo_player.v_play();
                        clearInterval( vimeo_player.document_focus );
                      }
                    }, 300 );
                  }
                }
              }

              if( vimeo_player.opt.showControls ) {
                var controls = jQuery( "#controlBar_" + vimeo_player.id );
                var progressBar = controls.find( ".vimeo_player_pogress" );
                var loadedBar = controls.find( ".vimeo_player_loaded" );
                var timeBar = controls.find( ".vimeo_player_seek_bar" );
                var totW = progressBar.outerWidth();
                var currentTime = Math.floor( data.seconds );
                var totalTime = Math.floor( data.duration );
                var timeW = ( currentTime * totW ) / totalTime;
                var startLeft = 0;
                var loadedW = data.percent * 100;
                loadedBar.css( {
                  left: startLeft,
                  width: loadedW + "%"
                } );
                timeBar.css( {
                  left: 0,
                  width: timeW
                } );

                if( data.duration ) {
                  vimeo_player.controlBar.find( ".vimeo_player_time" ).html( jQuery.vimeo_player.formatTime( data.seconds ) + " / " + jQuery.vimeo_player.formatTime( data.duration ) );
                } else {
                  vimeo_player.controlBar.find( ".vimeo_player_time" ).html( "-- : -- / -- : --" );
                }
              }

              vimeo_player.opt.stopAt = vimeo_player.opt.stopAt > data.duration ? data.duration - 0.5 : vimeo_player.opt.stopAt;
              var end_time = vimeo_player.opt.stopAt || data.duration - 0.5;

              if( data.seconds >= end_time ) {

                vimeo_player.loop = vimeo_player.loop || 0;

                if( vimeo_player.opt.loop && vimeo_player.loop < vimeo_player.opt.loop ) {
                  $vimeo_player.v_seekTo( vimeo_player.opt.startAt );
                  vimeo_player.loop++;

                } else {
                  $vimeo_player.v_pause();
                  vimeo_player.state = 0;
                  $vimeo_player.trigger( "change_state" );
                }
              }

              // Trigger state events
              VEvent = jQuery.Event( 'VPTime' );
              VEvent.time = data.seconds;
              $vimeo_player.trigger( VEvent );

            } );
          } );

          $vimeo_player.on( "change_state", function() {
            if( vimeo_player.state == 0 )
              vimeo_player.videoWrapper.fadeOut( vimeo_player.opt.fadeTime, function() {
                $vimeo_player.v_seekTo( 0 );
              } );
          } )
        } );
      } )
    },

    formatTime: function( s ) {
      var min = Math.floor( s / 60 );
      var sec = Math.floor( s - ( 60 * min ) );
      return( min <= 9 ? "0" + min : min ) + " : " + ( sec <= 9 ? "0" + sec : sec );
    },

    play: function() {
      var vimeo_player = this.get( 0 );
      if( !vimeo_player.isReady )
        return this;

      vimeo_player.player.play();
      setTimeout( function() {
        vimeo_player.videoWrapper.fadeTo( vimeo_player.opt.fadeTime, vimeo_player.opt.opacity );

        //console.timeEnd("Vimeo_start");

      }, 800 );

      var controls = jQuery( "#controlBar_" + vimeo_player.id );

      if( controls.length ) {
        var playBtn = controls.find( ".mb_YTPPvimeo_player_playpause" );
        playBtn.html( jQuery.vimeo_player.controls.pause );
      }
      vimeo_player.state = 1;

      jQuery( vimeo_player ).css( "background-image", "none" );
      return this;
    },

    togglePlay: function( callback ) {
      var vimeo_player = this.get( 0 );
      if( vimeo_player.state == 1 )
        this.v_pause();
      else
        this.v_play();

      if( typeof callback == "function" )
        callback( vimeo_player.state );

      return this;
    },

    pause: function() {
      var vimeo_player = this.get( 0 );
      vimeo_player.player.pause();
      vimeo_player.state = 2;
      return this;
    },

    seekTo: function( val, callback ) {
      var vimeo_player = this.get( 0 );

      var seekTo = vimeo_player.opt.stopAt && ( val >= vimeo_player.opt.stopAt ) ? vimeo_player.opt.stopAt - 0.5 : val;

      vimeo_player.player.setCurrentTime( seekTo ).then( function( data ) {
        if( typeof callback == "function" )
          callback( data );
      } );
      return this;
    },

    setVolume: function( val ) {
      var vimeo_player = this.get( 0 );
      vimeo_player.isMute = false;
      vimeo_player.opt.vol = val || vimeo_player.opt.vol;
      vimeo_player.player.setVolume( vimeo_player.opt.vol );

      if( vimeo_player.volumeBar && vimeo_player.volumeBar.length )
        vimeo_player.volumeBar.updateSliderVal( val * 100 )
      return this;
    },

    toggleVolume: function() {
      var vimeo_player = this.get( 0 );
      if( !vimeo_player ) return;

      if( vimeo_player.isMute ) {
        jQuery( vimeo_player ).v_unmute();
        return true;
      } else {
        jQuery( vimeo_player ).v_mute();
        return false;
      }
    },

    mute: function() {
      var vimeo_player = this.get( 0 );

      if( vimeo_player.isMute )
        return;
      vimeo_player.isMute = true;
      vimeo_player.player.setVolume( 0 );

      if( vimeo_player.volumeBar && vimeo_player.volumeBar.length && vimeo_player.volumeBar.width() > 10 ) {
        vimeo_player.volumeBar.updateSliderVal( 0 );
      }

      var controls = jQuery( "#controlBar_" + vimeo_player.id );
      var muteBtn = controls.find( ".vimeo_player_muteUnmute" );
      muteBtn.html( jQuery.vimeo_player.controls.unmute );

      jQuery( vimeo_player ).addClass( "isMuted" );

      if( vimeo_player.volumeBar && vimeo_player.volumeBar.length )
        vimeo_player.volumeBar.addClass( "muted" );

      return this;
    },

    unmute: function() {
      var vimeo_player = this.get( 0 );

      if( !vimeo_player.isMute )
        return;

      vimeo_player.isMute = false;

      jQuery( vimeo_player ).v_set_volume( vimeo_player.opt.vol );

      if( vimeo_player.volumeBar && vimeo_player.volumeBar.length ) vimeo_player.volumeBar.updateSliderVal( vimeo_player.opt.vol > .1 ? vimeo_player.opt.vol : .1 );
      var controls = jQuery( "#controlBar_" + vimeo_player.id );
      var muteBtn = controls.find( ".vimeo_player_muteUnmute" );
      muteBtn.html( jQuery.vimeo_player.controls.mute );
      jQuery( vimeo_player ).removeClass( "isMuted" );
      if( vimeo_player.volumeBar && vimeo_player.volumeBar.length )
        vimeo_player.volumeBar.removeClass( "muted" );

      return this;
    },

    changeMovie: function( obj ) {
      var $vimeo_player = this;
      var vimeo_player = $vimeo_player.get( 0 );
      vimeo_player.opt.startAt = 0;
      vimeo_player.opt.stopAt = 0;
      vimeo_player.opt.mask = false;
      vimeo_player.opt.mute = true;
      vimeo_player.hasData = false;
      vimeo_player.hasChanged = true;
      vimeo_player.player.loopTime = undefined;

      if( obj )
        jQuery.extend( vimeo_player.opt, obj );

      if( vimeo_player.opt.loop == "true" )
        vimeo_player.opt.loop = 9999;

      vimeo_player.player.loadVideo( obj.videoURL ).then( function( id ) {
        $vimeo_player.v_optimize_display();
        jQuery( vimeo_player ).v_play();
        if( vimeo_player.opt.startAt )
          $vimeo_player.v_seekTo( vimeo_player.opt.startAt );
      } )
    },

    buildControls: function( vimeo_player ) {
      var data = vimeo_player.opt;

      if( jQuery( "#controlBar_" + vimeo_player.id ).length )
        return;

      vimeo_player.controlBar = jQuery( "<span/>" ).attr( "id", "controlBar_" + vimeo_player.id ).addClass( "vimeo_player_bar" ).css( {
        whiteSpace: "noWrap",
        position: vimeo_player.isBackground ? "fixed" : "absolute",
        zIndex: vimeo_player.isBackground ? 10000 : 1000
      } );
      var buttonBar = jQuery( "<div/>" ).addClass( "buttonBar" );
      /* play/pause button*/
      var playpause = jQuery( "<span>" + jQuery.vimeo_player.controls.play + "</span>" ).addClass( "vimeo_player_pause vimeo_icon" ).click( function() {
        if( vimeo_player.state == 1 ) jQuery( vimeo_player ).v_pause();
        else jQuery( vimeo_player ).v_play();
      } );
      /* mute/unmute button*/
      var MuteUnmute = jQuery( "<span>" + jQuery.vimeo_player.controls.mute + "</span>" ).addClass( "vimeo_player_muteUnmute vimeo_icon" ).click( function() {

        if( vimeo_player.isMute ) {
          jQuery( vimeo_player ).v_unmute();
        } else {
          jQuery( vimeo_player ).v_mute();
        }
      } );
      /* volume bar*/
      var volumeBar = jQuery( "<div/>" ).addClass( "vimeo_player_volume_bar" ).css( {
        display: "inline-block"
      } );
      vimeo_player.volumeBar = volumeBar;
      /* time elapsed */
      var idx = jQuery( "<span/>" ).addClass( "vimeo_player_time" );
      var vURL = "https://vimeo.com/" + vimeo_player.videoID;

      var movieUrl = jQuery( "<span/>" ).html( jQuery.vimeo_player.controls.logo ).addClass( "vimeo_url vimeo_icon" ).attr( "title", "view on Vimeo" ).on( "click", function() {
        window.open( vURL, "viewOnVimeo" )
      } );

      var fullscreen = jQuery( "<span/>" ).html( jQuery.vimeo_player.controls.fullscreen ).addClass( "vimeo_fullscreen vimeo_icon" ).on( "click", function() {
        jQuery( vimeo_player ).v_fullscreen( data.realfullscreen );
      } );
      var progressBar = jQuery( "<div/>" ).addClass( "vimeo_player_pogress" ).css( "position", "absolute" ).click( function( e ) {
        timeBar.css( {
          width: ( e.clientX - timeBar.offset().left )
        } );

        vimeo_player.timeW = e.clientX - timeBar.offset().left;

        vimeo_player.controlBar.find( ".vimeo_player_loaded" ).css( {
          width: 0
        } );
        var totalTime = Math.floor( vimeo_player.duration );
        vimeo_player.goto = ( timeBar.outerWidth() * totalTime ) / progressBar.outerWidth();

        jQuery( vimeo_player ).v_seekTo( parseFloat( vimeo_player.goto ) );

        vimeo_player.controlBar.find( ".vimeo_player_loaded" ).css( {
          width: 0
        } );

      } );
      var loadedBar = jQuery( "<div/>" ).addClass( "vimeo_player_loaded" ).css( "position", "absolute" );
      var timeBar = jQuery( "<div/>" ).addClass( "vimeo_player_seek_bar" ).css( "position", "absolute" );
      progressBar.append( loadedBar ).append( timeBar );
      buttonBar.append( playpause ).append( MuteUnmute ).append( volumeBar ).append( idx );
      if( data.show_vimeo_logo ) {
        buttonBar.append( movieUrl );
      }
      if( vimeo_player.isBackground || ( eval( vimeo_player.opt.realfullscreen ) && !vimeo_player.isBackground ) ) buttonBar.append( fullscreen );
      vimeo_player.controlBar.append( buttonBar ).append( progressBar );
      if( !vimeo_player.isBackground ) {
        //vimeo_player.controlBar.addClass( "inline_vimeo_player" );
        vimeo_player.videoWrapper.before( vimeo_player.controlBar );
      } else {
        jQuery( "body" ).after( vimeo_player.controlBar );
      }

      volumeBar.simpleSlider( {
        initialval: vimeo_player.opt.vol,
        scale: 100,
        orientation: "h",
        callback: function( el ) {
          if( el.value == 0 ) {
            jQuery( vimeo_player ).v_mute();
          } else {
            jQuery( vimeo_player ).v_unmute();
          }
          vimeo_player.player.setVolume( el.value / 100 );

          if( !vimeo_player.isMute )
            vimeo_player.opt.vol = el.value;
        }
      } );
    },

    optimizeVimeoDisplay: function( align ) {
      var vimeo_player = this.get( 0 );
      var vid = {};

      vimeo_player.opt.align = align || vimeo_player.opt.align;

      vimeo_player.opt.align = typeof vimeo_player.opt.align != "undefined " ? vimeo_player.opt.align : "center,center";
      var VimeoAlign = vimeo_player.opt.align.split( "," );

      if( vimeo_player.opt.optimizeDisplay ) {
        var win = {};
        var el = vimeo_player.videoWrapper;
        var abundance = vimeo_player.isPlayer ? 0 : el.outerHeight() * .15;

        win.width = el.outerWidth() + abundance;
        win.height = el.outerHeight() + abundance;

        vimeo_player.opt.ratio = eval( vimeo_player.opt.ratio );

        vid.width = win.width;
        vid.height = Math.ceil( vid.width / vimeo_player.opt.ratio );

        vid.marginTop = Math.ceil( -( ( vid.height - win.height ) / 2 ) );
        vid.marginLeft = 0;

        vimeo_player.playerBox.css( {
          top: 0,
          opacity: 0,
          width: 100,
          height: Math.ceil( 100 / vimeo_player.opt.ratio ),
          marginTop: 0,
          marginLeft: 0,
          frameBorder: 0
        } );

        var lowest = vid.height < win.height;

        if( lowest ) {
          vid.height = win.height;
          vid.width = Math.ceil( vid.height * vimeo_player.opt.ratio );
          vid.marginTop = 0;
          vid.marginLeft = Math.ceil( -( ( vid.width - win.width ) / 2 ) );
        }

        for( var a in VimeoAlign ) {

          if( VimeoAlign.hasOwnProperty( a ) ) {
            var al = VimeoAlign[ a ].replace( / /g, "" );
            switch( al ) {
              case "top":
                vid.marginTop = lowest ? -( ( vid.height - win.height ) / 2 ) : 0;
                break;
              case "bottom":
                vid.marginTop = lowest ? 0 : -( vid.height - win.height );
                break;
              case "left":
                vid.marginLeft = 0;
                break;
              case "right":
                vid.marginLeft = lowest ? -( vid.width - win.width ) : 0;
                break;
              default:
                if( vid.width > win.width )
                  vid.marginLeft = -( ( vid.width - win.width ) / 2 );
                break;
            }
          }
        }
      } else {
        vid.width = "100%";
        vid.height = "100%";
        vid.marginTop = 0;
        vid.marginLeft = 0;
      }
      setTimeout( function() {
        vimeo_player.playerBox.css( {
          opacity: 1,
          width: vid.width,
          height: vid.height,
          marginTop: vid.marginTop,
          marginLeft: vid.marginLeft,
          maxWidth: "initial"
        } );
      }, 10 )
    },

    /**
     *
     * @param align
     */
    setAlign: function( align ) {
      var $vimeo_player = this;
      $vimeo_player.v_optimize_display( align );
    },

    /**
     *
     */
    getAlign: function() {
      var vimeo_player = this.get( 0 );
      return vimeo_player.opt.align;
    },

    /**
     *
     * @param real
     * @returns {jQuery.vimeo_player}
     */
    fullscreen: function( real ) {
      var vimeo_player = this.get( 0 );
      var $vimeo_player = jQuery( vimeo_player );
      var VEvent;

      if( typeof real == "undefined" ) real = vimeo_player.opt.realfullscreen;
      real = eval( real );
      var controls = jQuery( "#controlBar_" + vimeo_player.id );
      var fullScreenBtn = controls.find( ".vimeo_fullscreen" );
      var videoWrapper = vimeo_player.isSelf ? vimeo_player.opt.containment : vimeo_player.videoWrapper;

      if( real ) {
        var fullscreenchange = jQuery.browser.mozilla ? "mozfullscreenchange" : jQuery.browser.webkit ? "webkitfullscreenchange" : "fullscreenchange";
        jQuery( document ).off( fullscreenchange ).on( fullscreenchange, function() {
          var isFullScreen = RunPrefixMethod( document, "IsFullScreen" ) || RunPrefixMethod( document, "FullScreen" );
          if( !isFullScreen ) {
            vimeo_player.isAlone = false;
            fullScreenBtn.html( jQuery.vimeo_player.controls.fullscreen );
            videoWrapper.removeClass( "vimeo_player_Fullscreen" );

            videoWrapper.fadeTo( vimeo_player.opt.fadeTime, vimeo_player.opt.opacity );

            videoWrapper.css( {
              zIndex: 0
            } );

            if( vimeo_player.isBackground ) {
              jQuery( "body" ).after( controls );
            } else {
              vimeo_player.videoWrapper.before( controls );
            }
            jQuery( window ).resize();
            // Trigger state events
            VEvent = jQuery.Event( 'VPFullScreenEnd' );
            $vimeo_player.trigger( VEvent );

          } else {
            // Trigger state events
            VEvent = jQuery.Event( 'VPFullScreenStart' );
            $vimeo_player.trigger( VEvent );
          }
        } );
      }
      if( !vimeo_player.isAlone ) {
        function hideMouse() {
          vimeo_player.overlay.css( {
            cursor: "none"
          } );
        }

        jQuery( document ).on( "mousemove.vimeo_player", function( e ) {
          vimeo_player.overlay.css( {
            cursor: "auto"
          } );
          clearTimeout( vimeo_player.hideCursor );
          if( !jQuery( e.target ).parents().is( ".vimeo_player_bar" ) )
            vimeo_player.hideCursor = setTimeout( hideMouse, 3000 );
        } );

        hideMouse();

        if( real ) {
          videoWrapper.css( {
            opacity: 0
          } );
          videoWrapper.addClass( "vimeo_player_Fullscreen" );
          launchFullscreen( videoWrapper.get( 0 ) );
          setTimeout( function() {
            videoWrapper.fadeTo( vimeo_player.opt.fadeTime, 1 );
            vimeo_player.videoWrapper.append( controls );
            jQuery( vimeo_player ).v_optimize_display();

          }, 500 )
        } else videoWrapper.css( {
          zIndex: 10000
        } ).fadeTo( vimeo_player.opt.fadeTime, 1 );
        fullScreenBtn.html( jQuery.vimeo_player.controls.showSite );
        vimeo_player.isAlone = true;
      } else {
        jQuery( document ).off( "mousemove.vimeo_player" );
        clearTimeout( vimeo_player.hideCursor );
        vimeo_player.overlay.css( {
          cursor: "auto"
        } );
        if( real ) {
          cancelFullscreen();
        } else {
          videoWrapper.fadeTo( vimeo_player.opt.fadeTime, vimeo_player.opt.opacity ).css( {
            zIndex: 0
          } );
        }
        fullScreenBtn.html( jQuery.vimeo_player.controls.fullscreen );
        vimeo_player.isAlone = false;
      }

      function RunPrefixMethod( obj, method ) {
        var pfx = [ "webkit", "moz", "ms", "o", "" ];
        var p = 0,
            m, t;
        while( p < pfx.length && !obj[ m ] ) {
          m = method;
          if( pfx[ p ] == "" ) {
            m = m.substr( 0, 1 ).toLowerCase() + m.substr( 1 );
          }
          m = pfx[ p ] + m;
          t = typeof obj[ m ];
          if( t != "undefined" ) {
            pfx = [ pfx[ p ] ];
            return( t == "function" ? obj[ m ]() : obj[ m ] );
          }
          p++;
        }
      }

      function launchFullscreen( element ) {
        RunPrefixMethod( element, "RequestFullScreen" );
      }

      function cancelFullscreen() {
        if( RunPrefixMethod( document, "FullScreen" ) || RunPrefixMethod( document, "IsFullScreen" ) ) {
          RunPrefixMethod( document, "CancelFullScreen" );
        }
      }
      return this;
    }
  };

  jQuery.fn.vimeo_player = jQuery.vimeo_player.buildPlayer;
  jQuery.fn.v_play = jQuery.vimeo_player.play;
  jQuery.fn.v_toggle_play = jQuery.vimeo_player.togglePlay;
  jQuery.fn.v_change_movie = jQuery.vimeo_player.changeMovie;
  jQuery.fn.v_pause = jQuery.vimeo_player.pause;
  jQuery.fn.v_seekTo = jQuery.vimeo_player.seekTo;
  jQuery.fn.v_optimize_display = jQuery.vimeo_player.optimizeVimeoDisplay;
  jQuery.fn.v_set_align = jQuery.vimeo_player.setAlign;
  jQuery.fn.v_get_align = jQuery.vimeo_player.getAlign;
  jQuery.fn.v_fullscreen = jQuery.vimeo_player.fullscreen;
  jQuery.fn.v_mute = jQuery.vimeo_player.mute;
  jQuery.fn.v_unmute = jQuery.vimeo_player.unmute;
  jQuery.fn.v_set_volume = jQuery.vimeo_player.setVolume;
  jQuery.fn.v_toggle_volume = jQuery.vimeo_player.toggleVolume;

} )( jQuery );
