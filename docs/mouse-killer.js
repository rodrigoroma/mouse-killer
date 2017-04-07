/*
 * mouse-killer v0.3.0-rc.1
 *
 * An Angular.JS directive to bind keyboard shortcuts to buttons (or any other DOM element).
 *
 * (c) 2017 Rodrigo Roma
 * License: MIT
 */

(function() {
	"use strict";

	var mousekiller = angular.module('mouseKiller', []);

	mousekiller.provider('mouseKiller', function () {
		this.event = 'click';
		this.hint = 'title';
		this.hintTitle = 'Shortcut: %';

		this.setEvent = function(event) {
			this.event = event.toLowerCase();
		};

		this.setHint = function(hint) {
			this.hint = hint.toLowerCase();
		};

		this.setHintTitle = function(hintTitle) {
			this.hintTitle = hintTitle;
		}

		this.$get = function () {
			return this;
		};
	})

	mousekiller.directive('mkShortcut', ['$document', 'mouseKiller', function($document, mouseKiller) {
		return {
			restrict: 'A',
			scope: {
				mkShortcut: '@',
				mkEvent: '@',
				mkHint: '@',
				mkHintTitle: '@'
			},
			link: function(scope, element, attrs, controller) {
				var modifiers = ['shift', 'ctrl', 'alt', 'meta'];

				var config = {
					shortcut: scope.mkShortcut,
					event: scope.mkEvent || mouseKiller.event,
					hint: scope.mkHint || mouseKiller.hint,
					hintTitle: scope.mkHintTitle || mouseKiller.hintTitle
				}

				var init = function() {
					// Add hint to the element
					addHint();

					// Bind the keydown event to the handler function
					$document.on('keydown', handleKeydown);
					
					element.on('$destroy', function() {
						$document.off('keydown', handleKeydown);
					});
				}

				var matchKeys = function(evt) {
					var i;
					var keys = config.shortcut.split("+")

					for (i in keys) {
						var key = keys[i];

						key = key.toLowerCase();
						key = key.trim();

						if (matchKey(key, evt) == false) {
							return false;
						}						
					}

					return true;
				}

				var matchKey = function(key, evt) {
					// If the key is a modifier (alt, ctrl, ...)
					if (modifiers.indexOf(key) > -1) {
						return evt[key + 'Key'];
					}

					// If the key is not a modifier key
					var keyCode = getKeyCode(key);

					var evtKeyCode = evt.which || evt.keyCode;

					if (keyCode == evtKeyCode) {
						return true;
					}

					return false;
				}

				var getKeyCode = function(key) {
					// Checks if the key is already a keycode like {61}
					if (key.match(/^{ *\d+ *}$/)) {
						return key.replace(/^{ *(\d+) *}$/, "$1");
					}

					// If it is a literal char
					switch(key) {
						case 'backspace': return 8;
						case 'tab': return 9;
						case 'enter': return 13;
						case 'esc': return 27;
						case 'page up': return 33;
						case 'page down': return 34;
						case 'end': return 35;
						case 'home': return 36;
						case 'left arrow': return 37;
						case 'up arrow': return 38;
						case 'right arrow': return 39;
						case 'down arrow': return 40;
						case 'insert': return 45;
						case 'delete': return 46;
						case '0': return 48;
						case '1': return 49;
						case '2': return 50;
						case '3': return 51;
						case '4': return 52;
						case '5': return 53;
						case '6': return 54;
						case '7': return 55;
						case '8': return 56;
						case '9': return 57;
						case 'a': return 65;
						case 'b': return 66;
						case 'c': return 67;
						case 'd': return 68;
						case 'e': return 69;
						case 'f': return 70;
						case 'g': return 71;
						case 'h': return 72;
						case 'i': return 73;
						case 'j': return 74;
						case 'k': return 75;
						case 'l': return 76;
						case 'm': return 77;
						case 'n': return 78;
						case 'o': return 79;
						case 'p': return 80;
						case 'q': return 81;
						case 'r': return 82;
						case 's': return 83;
						case 't': return 84;
						case 'u': return 85;
						case 'v': return 86;
						case 'w': return 87;
						case 'x': return 88;
						case 'y': return 89;
						case 'z': return 90;
						case 'numpad 0': return 96;
						case 'numpad 1': return 97;
						case 'numpad 2': return 98;
						case 'numpad 3': return 99;
						case 'numpad 4': return 100;
						case 'numpad 5': return 101;
						case 'numpad 6': return 102;
						case 'numpad 7': return 103;
						case 'numpad 8': return 104;
						case 'numpad 9': return 105;
						case 'multiply': return 106;
						case 'add': return 107;
						case 'subtract': return 109;
						case 'decimal point': return 110;
						case 'divide': return 111;
						case 'f1': return 112;
						case 'f2': return 113;
						case 'f3': return 114;
						case 'f4': return 115;
						case 'f5': return 116;
						case 'f6': return 117;
						case 'f7': return 118;
						case 'f8': return 119;
						case 'f9': return 120;
						case 'f10': return 121;
						case 'f11': return 122;
						case 'f12': return 123;
						default: throw Error('Unknow key "' + key + '"');
					}
				}

				// Check if some CSS rule makes the element invisible
				var isVisible = function(elem) {
					var style = getComputedStyle(elem);

					if (style.display === 'none') {
						return false;
					}

					if (style.visibility !== 'visible') {
						return false;
					}

					if (style.opacity < 0.1) {
						return false;
					}

					if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height + elem.getBoundingClientRect().width === 0) {
						return false;
					}

					return true;
				}

				var getElementViewportPosition = function(elem) {
					var centralPoint = {
						x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
						y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
					};

					if (centralPoint.x < 0) {
						return null;
					}

					if (centralPoint.x > (document.documentElement.clientWidth || window.innerWidth)) {
						return null;
					}

					if (centralPoint.y < 0) {
						return null;
					}

					if (centralPoint.y > (document.documentElement.clientHeight || window.innerHeight)) {
						return null;
					}

					return centralPoint;
				}

				var checkElementOnPoint = function(elem, point) {
					var pointElement = document.elementFromPoint(point.x, point.y);

					do {
						if (pointElement === elem) {
							return true;
						}
					} while (pointElement = pointElement.parentNode);

					return false;
				}

				var isOverrided = function(elem) {
					var tagsToCheck = ["div"];

					var domElements = [];

					tagsToCheck.forEach(function addTags(tag) {
						var elementsOfTag = document.getElementsByTagName(tag);

						for (var i = 0; i < elementsOfTag.length; i++) {
							domElements.push(elementsOfTag[i])
						}
					})

					for (var i = 0; i < domElements.length; i++) {
						if (elementOverridesElement(elem, domElements[i]) == true) {
							return true;
						}
					}

					return false;
				}

				var elementOverridesElement = function(innerElement, outerElement) {

					if (elementIsInsideElement(innerElement, outerElement) == false && elementIsABackdrop(outerElement) == false) {
						return false;
					}

					if (getElementOnTop(innerElement, outerElement) == innerElement) {
						return false;
					}

					return true;
				}

				var elementIsInsideElement = function(innerElement, outerElement) {
					var innerCoordinates = innerElement.getBoundingClientRect();
					var outerCoordinates = outerElement.getBoundingClientRect();

					// Left edge
					if (innerCoordinates.left < outerCoordinates.left) {
						return false;
					}

					// Right edge
					if (innerCoordinates.right > outerCoordinates.right) {
						return false;
					}

					// Top edge
					if (innerCoordinates.top < outerCoordinates.top) {
						return false;
					}

					// Bottom edge
					if (innerCoordinates.bottom > outerCoordinates.bottom) {
						return false;
					}

					return true;
				}

				var elementIsABackdrop = function(elem) {

					if (cssProperty(elem, "position") != "fixed") {
						return false;
					}

					var elemCoordinates = elem.getBoundingClientRect();
					var extra = 20;

					// Left edge
					if (elemCoordinates.left - extra > 0) {
						return false;
					}

					// Right edge
					if (elemCoordinates.right + extra < (document.documentElement.clientWidth || window.innerWidth)) {
						return false;
					}

					// Top edge
					if (elemCoordinates.top - extra > 0) {
						return false;
					}

					// Bottom edge
					if (elemCoordinates.bottom + extra < (document.documentElement.clientHeight || window.innerHeight)) {
						return false;
					}

					return true;
				}

				var getElementOnTop = function(a, b) {
					var pa = $(a).parents(), ia = pa.length;
					var pb = $(b).parents(), ib = pb.length;

					// Skip common ancestors
					while (ia >= 0 && ib >= 0 && pa[--ia] == pb[--ib]) { }

					// Get the first different element
					var ctxA = (ia >= 0 ? pa[ia] : a);
					var ctxB = (ib >= 0 ? pb[ib] : b);

					// Get the z-index property of the first different element
					var za = zIndex(ctxA);
					var zb = zIndex(ctxB);

					// Find the first z-index
					while (ctxA && za === undefined) {
						ctxA = ia < 0 ? null : --ia < 0 ? a : pa[ia];
						za = zIndex(ctxA);
					}
					
					while (ctxB && zb === undefined) {
						ctxB = ib < 0 ? null : --ib < 0 ? b : pb[ib];
						zb = zIndex(ctxB);
					}

					var relative = domRelativePosition(ctxA, ctxB, a, b);

					if (za !== undefined) {
						if (zb !== undefined) {
							return za > zb ? a : za < zb ? b : relative;
						}

						return za > 0 ? a : za < 0 ? b : relative;
					} else if (zb !== undefined) {
						return zb < 0 ? a : zb > 0 ? b : relative;
					} else {
						return relative;
					}
				}

				function zIndex(ctx) {
					if (!ctx || ctx === document.body) return;

					var hasPosition = cssProperty(ctx, 'position') !== 'static';
					var hasZIndex = cssProperty(ctx, 'z-index') !== 'auto';

					if (hasPosition && hasZIndex) {
						return +cssProperty(ctx, 'z-index');
					}
				}

				var domRelativePosition = function(ctxA, ctxB, a, b) {
					if ($.inArray(b, $(a).parents()) >= 0) {
						return a;
					}

					if ($.inArray(a, $(b).parents()) >= 0) {
						return b;
					}

					return ($(ctxA).index() - $(ctxB).index() > 0 ? a : b);
				}

				var cssProperty = function(elem, prop) {
					return window.getComputedStyle(elem).getPropertyValue(prop);
				}

				var isDisabled = function(elem) {
					if (elem.disabled) {
						return true;
					}

					// TODO: check if the element has the "disabled" attribute

					return false;
				}

				var addHint = function() {
					var shortcutText = attrs.mkShortcut
						.toUpperCase()
						.trim()
						.replace(/ *\+ */g, "+");

					if (config.hint == 'title') {
						var hintTitle = config.hintTitle.replace("%", shortcutText)

						element.attr('title', hintTitle);
					}

					if (config.hint == 'inline') {
						element[0].innerText = element[0].innerText + " (" + shortcutText + ")"
					}
				}

				var blurElement = function(evt) {
					if (config.event != 'click') {
						return;
					}

					if (element[0] != document.activeElement) {
						return;
					}

					if (config.shortcut.match(/^ *enter *$/i) == false) {
						return;
					}
					
					element.trigger('blur');
				}

				var isClickable = function(elem) {
					// Checks if the element is hidden by a CSS rule
					if (isVisible(elem) == false) {
						return false;
					}

					// Check if the element is not disabled
					if (isDisabled(elem) == true) {
						return false;
					}

					// Get the element coordinates on the viewport (null if the element is not on the visible part of the screen)
					var elementPoint = getElementViewportPosition(elem);

					if (elementPoint == null) {
						return !isOverrided(elem);
					}

					return checkElementOnPoint(elem, elementPoint);
				}

				var handleKeydown = function(evt) {
					var elem = element[0];

					if ((elem instanceof Element) == false)  {
						throw Error('DomUtil: elem is not an element.');
					}

					// Checks if the pressed keys satisfy the shortcut
					if (matchKeys(evt) == false) {
						return;
					}

					// TODO: Check here if focus is on a text input

					// Check if the user could manually click the button
					if (isClickable(elem) == false) {
						return;
					}

					// Prevents double-triggering the click on a button if the shortcut é only the enter key
					blurElement(evt);

					evt.preventDefault();

					element.trigger(config.event);
				}
				
				init();
			}
		};
	}]);

}).call(this);