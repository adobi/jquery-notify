/*
	TODO: write some documentation
*/

(function($) {
	
	$.notify = function(options) {
		
		options = $.extend({}, $.notify.defaults, options);
		
		$.notify.options.slideTime = options.slideTime;
		$.notify.options.showTime = options.showTime;
		$.notify.options.animation = options.animation;
		$.notify.options.easing = options.easing;
		
		var flash;
		
		if(!$('.flash-message').length) {
			
			flash = build(options);
			
		}
		else {
			flash = $('.flash-message');
		}
		
		flash
			.showFlashMessage();
			
		if(options.hideOnClick)
			flash.hideOnClick();

	};
	
	$.notify.options = {};
	
	var build = function (options) {
		
		flash = $('<div></div>', { class: "flash-message"});
		
		var flashCss = {
			position: 'fixed',
			top: '0px',
			left: '0px',
			width: '100%',
			zIndex: 10000,
			margin: '0px',
			borderBottom: '3px solid #cfcfcf',
			color: '#444444',
			backgroundColor: '#ffffff',
			textAlign: 'center',
			padding: '15px 0',
			fontSize: '1.6em',
			cursor: 'pointer',
			display: 'none'
		};
		
		flashCss = $.extend({}, flashCss, options.outerStyle);
		
		var message = $('<div></div>');
		
		var messageCss = {};
		messageCss = $.extend({}, messageCss, options.innerStyle);
		message.css(messageCss).html(options.message);
		
		flash.css(flashCss).html(message);
		
		$('body').prepend(flash);
		
		return flash;		
	};
	
	var resetTimeout = function () {
		
		if($.notify.timeoutId !== undefined) {
			
				clearTimeout($.notify.timeoutId);
				$.notify.timeoutId = undefined;
		}
	};
	
	$.fn.showFlashMessage = function() {
		
		return this.each(function() {
			
			var self = $(this);
			
			var callback = function() { self.hideFlashMessage(); };
			
			if(self.is(':hidden')) {
				
				var sliderCallback = function() { 

					self.css('opacity', 1); $.notify.timeoutId = setTimeout(callback, $.notify.options.showTime); 
				}
				
				if($.notify.options.animation) {
					
					self.css('opacity','0.6').slideDown()
						.animate(
							{ paddingTop:30,paddingBottom:10 },
							{ easing: "easeOutBack" }
						)
						.animate( 
							{ paddingTop:15, paddingBottom:15 }, 
							{ easing: "jswing", complete: sliderCallback }
						);
				}
				else {
					self.slideDown($.notify.options.slideTime, sliderCallback);
				}
			}	
		});
	};
	
	$.fn.hideFlashMessage = function() {
		
		return this.each(function() {
			var self = $(this);
			
			if($.notify.options.animation) {
				
				self.css('opacity', '0.6')
					.animate(
						{}, 
						{ easing: "easeInBack" }
					)
					.animate(
						{ paddingTop:30, paddingBottom:10 },
						{ easing: "jswing",	complete: function() { self.slideUp(); } }
					);
			}
			else {
				self.slideUp($.notify.options.slideTime);
			}

			resetTimeout();	
		});
	};
	
	$.fn.hideOnClick = function() {
		
		return this.each(function() {
			
			var self = $(this);
			
			self.bind('click', function() {
				
				resetTimeout();	
				
				self.hideFlashMessage();
	
				return false;
			});
		});
	};
	
	$.notify.defaults = {
		slideTime: 300,
		showTime: 3000,
		easing:'',
		animation: false,
		hideOnClick: true,
		message: '',
		outerStyle: {},
		innerStyle: {}
	};
	
}) (jQuery); 