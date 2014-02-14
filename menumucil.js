/*!
 * menumucil
 */
;(function($) {
	
	/**
	 * Holds default options, adds user defined options, and initializes the plugin
	 *
	 * @param { obj } _elem The element that becomes the root of the plugin
	 * @param { obj } _options Configuration options
	 * @param { string } _id The id of the root element 
	 */
	function menumucil( elem, options, id ) {
		var self = this;
		self.elem = elem;
		self.id = id;
		self.init( elem, options );
	}
	
	/**
	 * Holds default options, adds user defined options, and initializes the plugin
	 *
	 * @param { obj } _elem The element that becomes the root of the plugin
	 * @param { obj } _options Configuration options
	 */
	menumucil.prototype.init = function( elem, options ) {
		var self = this;
		
		//---------------
		//	User options 
		//---------------
		self.options = $.extend({
			closed: "&#9660;",
			open: "&#9650;",
			button_classes: null,
			up: false,
			cover: false
		}, options);
		
		self.events = {
			open: 'MENUMUCIL-OPEN',
			closed: 'MENUMUCIL-CLOSED'
		};
		
		//-----------------------------------
		//	Shared instance method variables
		//-----------------------------------
		self.menu = null;
		self.pane = null;
		self.clicker = null;
		
		//-------------------------
		//	Get the party started  
		//-------------------------
		self.build();
	}
	
	/**
	 * Build the DOM elements needed by the plugin
	 */
	menumucil.prototype.build = function() {
		var self = this;
		self.menu = $( self.elem );
		
		self.menu.addClass( 'menumucil' );
		
		//------------------------------------------------------------
		//  Cover mode?
		//------------------------------------------------------------
		if ( self.options['cover'] || self.options['up'] ) {
			self.menu.css({
				position: 'absolute',
				'z-index': 5000
			});
		}
		self.menu.wrapInner( '<div class="inner" />');
		self.menu.wrapInner( '<div class="pane" />');
		
		self.pane = $( '.pane', self.elem );
		self.pane.addClass( 'closed' );
		
		//------------------------------------------------------------
		//	Create clicker
		//------------------------------------------------------------
		self.clicker = $( document.createElement( 'a' ) );
		self.clicker.attr( 'href', '#' );
		self.clicker.addClass( 'clicker' );
		if ( self.options['button_classes'] != null ) {
		    self.clicker.addClass( self.options['button_classes'] );
		}
		self.menu.append( self.clicker );
		
		//------------------------------------------------------------
		//  The main clicker icon
		//------------------------------------------------------------
		self.icon = $( document.createElement( 'span' ) );
		self.icon.addClass( 'icon' );
		self.clicker.append( self.icon );
		self.icon.html( self.options['closed'] );
		
		
		//------------------------------------------------------------
		//  Extra content that needs to be written to the clicker.
		//  Content counts and that sort of thing.
		//------------------------------------------------------------
		self.extra = $( document.createElement( 'span' ) );
		self.extra.addClass( 'extra' );
		self.clicker.append( self.extra );
		
		//---------------------------------
		//	Register transition listeners  
		//---------------------------------
		self.pane.on( 'transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd', function( _e ) {
			if ( self.pane.hasClass( 'open' ) ) {
				self.pane.css('max-height', 9999);
			}
		});
		
		//------------------------------------------------------------
		//  Cover mode?
		//------------------------------------------------------------
		if ( self.options['cover'] || self.options['up'] ) {
			var height = self.clicker.height();
			self.menu.after( '<div style="height:'+height+'px;clear:both"></div>')
		}
		
		//-----------------------------
		//	Close the menu by default  
		//-----------------------------
		self.closeNow();
		
		//------------------------
		//	Register click event  
		//------------------------
		$( self.clicker ).on( 'click touchstart', function( _e ) {
			if ( self.isOpen() ) {
				self.close();
			}
			else if ( self.pane.hasClass('closed') ) {
				self.open();
			}
			_e.preventDefault();
		})
	}
	
	/**
	 * Check to see if the menu is open.
	 *
	 * @return { boolean }
	 */
	menumucil.prototype.isOpen = function() {
		var self = this;
		if ( self.pane.hasClass('open') ) {
			return true;
		}
		return false;
	}
	
	/**
	 * Check to see if the menu is closed.
	 *
	 * @return { boolean }
	 */
	menumucil.prototype.isClosed = function() {
		var self = this;
		if ( self.pane.hasClass('closed') ) {
			return true;
		}
		return false;
	}
	
	/**
	 * Open the menu.
	 */
	menumucil.prototype.open = function() {
		var self = this;
		self.pane.contentHeight = self.pane.outerHeight();
		self.pane.contentHeight += $( '.inner', self.elem ).outerHeight();
		self.pane.css({
			'max-height': self.pane.contentHeight
		});
		if ( self.options['up'] ) {
			self.menu.css({
				'top': self.menu.position().top - self.pane.contentHeight
			});
		}
		self.pane.removeClass( 'closed' );
		self.pane.addClass( 'open' );
		self.icon.html( self.options['open'] );
		self.pane.trigger( self.events['open'], [self.id] );
	}
	
	/**
	 * Close the menu.
	 */
	menumucil.prototype.close = function() {
		var self = this;
		self.pane.contentHeight = self.pane.outerHeight();
		self.pane.removeClass('transitions').css( 'max-height', self.pane.contentHeight );
		
		//------------------------------------------------------------
		//	This delay is needed for quick close animation
		//------------------------------------------------------------
		setTimeout( function() {
			self.closeNow();
			self.pane.removeClass('open');
			self.pane.addClass('closed');
			self.icon.html( self.options['closed'] );
			self.menu.trigger( self.events['closed'], [self.id] );
		}, 10 );
	}
	
	/**
	 * Close the menu bypassing animations
	 */
	menumucil.prototype.closeNow = function() {
		var self = this;
		self.pane.addClass('transitions').css({
			'max-height': 0
		});
	}

	//----------------
	//	Extend JQuery 
	//----------------
	jQuery(document).ready( function($) {
		jQuery.fn.menumucil = function( options ) {
			var id = jQuery(this).selector;
			return this.each( function() {
				jQuery.data( this, id, new menumucil( this, options, id ) );
			});
		};
	})
})(jQuery);