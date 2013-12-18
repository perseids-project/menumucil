/*!
 * menumucil
 */
;(function($) {
	
	function menumucil( elem, options, id ) {
		var self = this;
		self.elem = elem;
		self.id = id;
		self.init( elem, options );
	}
	
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
		self.create();
	}
	
	menumucil.prototype.create = function() {
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
		//	Create buton
		//------------------------------------------------------------
		self.clicker = $( document.createElement( 'a' ) );
		self.clicker.attr( 'href', '#' );
		self.clicker.html( self.options['closed'] );
		self.clicker.addClass( 'clicker' );
		if ( self.options['button_classes'] != null ) {
		    self.clicker.addClass( self.options['button_classes'] );
		}
		self.menu.append( self.clicker );
		
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
		$( self.clicker ).click( function( _e ) {
			if ( self.pane.hasClass('open') ) {
				self.close();
			}
			else if ( self.pane.hasClass('closed') ) {
				self.open();
			}
			_e.preventDefault();
		})
	}
	
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
		self.clicker.html( self.options['open'] );
		self.pane.trigger( self.events['open'], [self.id] );
	}
	
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
			self.clicker.html( self.options['closed'] );
			self.menu.trigger( self.events['closed'], [self.id] );
		}, 10 );
	}
	
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