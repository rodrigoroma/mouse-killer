(function() {
	"use strict";

	var mousekiller = angular.module('mouseKiller', []);

	mousekiller.provider('mouseKillerConfig', function () {
		this.event = 'click';
		this.hintType = 'title';
		this.titleText = 'Hotkey: %';

		this.setEvent = function(event) {
			this.event = event.toLowerCase();
		};

		this.setHintType = function(hintType) {
			this.hintType = hintType.toLowerCase();
		};

		this.setTitleText = function(titleText) {
			this.titleText = titleText;
		}

		this.$get = function () {
			return this;
		};
	})

	mousekiller.directive('mkShortcut', ['$document', 'mouseKillerConfig', function($document, mouseKillerConfig) {
		return {
			restrict: 'A',
			scope: {
				mkShortcut: '@',
				mkEvent: '@',
				mkHintType: '@',
				mkTitleText: '@'
			},
			link: function(scope, element, attrs, controller) {
				var modifiers = ['shift', 'ctrl', 'alt', 'meta'];

				var config = {
					shortcut: scope.mkShortcut,
					event: scope.mkEvent || mouseKillerConfig.event,
					hintType: scope.mkHintType || mouseKillerConfig.hintType,
					titleText: scope.mkTitleText || mouseKillerConfig.titleText
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

				var isVisible = function(elem) {
					if ((elem instanceof Element) == false)  {
						throw Error('DomUtil: elem is not an element.');
					}

					// Check if some CSS rule makes the element invisible
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

					// Check if the element is not in the visible area
					var centralPoint = {
						x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
						y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
					};
					if (centralPoint.x < 0) {
						return false;
					}
					if (centralPoint.x > (document.documentElement.clientWidth || window.innerWidth)) {
						return false;
					}
					if (centralPoint.y < 0) {
						return false;
					}
					if (centralPoint.y > (document.documentElement.clientHeight || window.innerHeight)) {
						return false;
					}

					// Check if there is an element that hides our element
					var pointElement = document.elementFromPoint(centralPoint.x, centralPoint.y);

					do {
						if (pointElement === elem) {
							return true;
						}
					} while (pointElement = pointElement.parentNode);

					return false;
				}

				var isDisabled = function(elem) {
					if (elem.disabled) {
						return true;
					}

					return false;
				}

				var addHint = function() {
					var shortcutText = attrs.mkShortcut
						.toUpperCase()
						.trim()
						.replace(/ *\+ */g, "+");

					if (config.hintType == 'title') {
						var titleText = config.titleText.replace("%", shortcutText)

						element.attr('title', titleText);
					}

					if (config.hintType == 'inline') {
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

				var handleKeydown = function(evt) {
					// Checks if the pressed keys satisfy the shortcut
					if (matchKeys(evt) == false) {
						return;
					}
					
					// Checks if the element is visible and clickable
					if (isVisible(element[0]) == false) {
						return;
					}

					// Check if the element is not disabled
					if (isDisabled(element[0]) == true) {
						return;
					}

					// TODO: Should I check if the current focus is on a text input?

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