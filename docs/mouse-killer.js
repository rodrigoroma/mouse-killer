/*
 * mouse-killer v0.3.1
 *
 * An Angular.JS directive to bind keyboard shortcuts to buttons (or any other DOM element).
 *
 * (c) 2017 Rodrigo Roma
 * License: MIT
 */

(function () {
	"use strict";

	var mousekiller = angular.module('mouseKiller', []);

	mousekiller.provider('mouseKiller', function () {
		this.event = 'click';
		this.hint = 'title';
		this.hintTitle = 'Shortcut: %';
		this.preventDefault = true;
		this.stopPropagation = true;
		this.enabled = "auto";

		this.setEvent = function (event) {
			this.event = event.toLowerCase();
		};

		this.setHint = function (hint) {
			this.hint = hint.toLowerCase();
		};

		this.setHintTitle = function (hintTitle) {
			this.hintTitle = hintTitle;
		}

		this.setPreventDefault = function (preventDefault) {
			this.preventDefault = preventDefault;
		}

		this.setStopPropagation = function (stopPropagation) {
			this.stopPropagation = stopPropagation;
		}

		this.setEnabled = function (enabled) {
			this.enabled = enabled;
		}

		this.$get = function () {
			return this;
		};
	})

	mousekiller.directive('mkShortcut', ['$document', 'mouseKiller', function ($document, mouseKiller) {
		return {
			restrict: 'A',
			scope: {
				mkShortcut: '@',
				mkEvent: '@',
				mkHint: '@',
				mkHintTitle: '@',
				mkPreventDefault: '=',
				mkStopPropagation: '=',
				mkEnabled: '='
			},
			link: function (scope, element, attrs, controller) {
				var modifiers = ['shift', 'ctrl', 'alt', 'meta'];

				var config = {}

				var init = function () {
					// Sets the "config" object
					initializeConfiguration();

					// There is no shortcut defined
					if (config.shortcut == null) {
						return;
					}

					// Add hint to the element
					addHint();

					// Bind the keydown event to the handler function
					$document.on('keydown', handleKeydown);

					element.on('$destroy', function () {
						$document.off('keydown', handleKeydown);
					});
				}

				var initializeConfiguration = function () {
					config = {
						shortcut: getShortcutObject(scope.mkShortcut),
						event: scope.mkEvent || mouseKiller.event,
						hint: scope.mkHint || mouseKiller.hint,
						hintTitle: scope.mkHintTitle || mouseKiller.hintTitle,
						preventDefault: (scope.mkPreventDefault !== undefined) ? scope.mkPreventDefault : mouseKiller.preventDefault,
						stopPropagation: (scope.mkStopPropagation !== undefined) ? scope.mkStopPropagation : mouseKiller.stopPropagation,
						enabled: (scope.mkEnabled !== undefined) ? scope.mkEnabled : mouseKiller.enabled
					}
				}

				var getShortcutObject = function (shortcut) {
					// Check for blank shortcut
					if (!shortcut) {
						return null;
					}

					// Initializes the shortcut object
					var shortcutObject = {
						keyCode: null
					}

					for (var i in modifiers) {
						shortcutObject[modifiers[i]] = false;
					}

					var keys = shortcut.split("+")

					for (var i in keys) {
						var key = keys[i];

						key = key.toLowerCase();
						key = key.trim();

						// Key is a modifier key
						if (modifiers.indexOf(key) > -1) {
							shortcutObject[key] = true;
							continue;
						}

						// Key is a normal key
						if (shortcutObject.keyCode != null) {
							throw Error("Invalid shortcut \"" + shortcut + "\". You can have only one normal key (and any number of modifier keys).");
							return null;
						}

						try {
							shortcutObject.keyCode = getKeyCode(key);
						} catch (err) {
							throw Error("Error in '" + shortcut + "' shortcut :: " + err);
						}
					}

					// Calculate the number of keys
					shortcutObject.numberOfKeys = 0;

					if (shortcutObject.keyCode) {
						shortcutObject.numberOfKeys++;
					}

					for (var i in modifiers) {
						if (shortcutObject[modifiers[i]] == true) {
							shortcutObject.numberOfKeys++;
						}
					}

					return shortcutObject;
				}

				var addHint = function () {
					if (config.shortcut == null) {
						return;
					}

					var shortcutText = attrs.mkShortcut
						.toUpperCase()
						.trim()
						.replace(/ *\+ */g, "+");

					if (config.hint == 'title') {
						var hintTitle = config.hintTitle.replace("%", shortcutText)

						element.attr('title', hintTitle);
					}

					if (config.hint == 'inline') {
						element[0].appendChild(document.createTextNode(" (" + shortcutText + ")"));
					}
				}

				var handleKeydown = function (evt) {
					var elem = element[0];

					if ((elem instanceof Element) == false) {
						throw Error('DomUtil: elem is not an element.');
					}

					// Checks if the pressed keys satisfy the shortcut
					if (matchKeys(evt) == false) {
						return;
					}

					if (isEnabled(elem, evt) == false) {
						return;
					}

					preventDefault(evt);

					stopPropagation(evt);

					element.trigger(config.event);
				}

				var matchKeys = function (evt) {
					if (config.shortcut == null) {
						return false;
					}

					var evtKeyCode = evt.which || evt.keyCode;

					// Validate keyCode
					if (config.shortcut.keyCode && config.shortcut.keyCode != evtKeyCode) {
						return false;
					}

					// Validate modifier keys
					for (var i in modifiers) {
						var m = modifiers[i];

						if (config.shortcut[m] != evt[m + 'Key']) {
							return false;
						}
					}

					return true;
				}

				var getKeyCode = function (key) {
					// Checks if the key is already a keycode like {61}
					if (key.match(/^{ *\d+ *}$/)) {
						return key.replace(/^{ *(\d+) *}$/, "$1");
					}

					// If it is a literal char
					switch (key) {
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

				var isEnabled = function (elem, evt) {

					// true
					if (config.enabled === true) {
						return true;
					}

					// false
					if (config.enabled === false) {
						return false;
					}

					// auto
					if (typeof config.enabled === "string" && config.enabled === "auto") {
						var restrictedTags = ["INPUT", "SELECT", "TEXTAREA"];

						// Check focus
						if (config.shortcut.numberOfKeys < 2 && restrictedTags.indexOf(document.activeElement.nodeName) > -1) {
							return false;
						}

						// Check if the user could manually click the button
						if (isClickable(elem) == false) {
							return false;
						}

						return true;
					}

					// function
					if (typeof config.enabled === "function") {
						return config.enabled(elem, evt, isClickable(elem));
					}

					console.error("Invalid value for 'enabled' property. Expected true|false|auto|function but found " + config.enabled);
					return true;
				}

				var isClickable = function (elem) {
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

				var isVisible = function (elem) {
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

				var isDisabled = function (elem) {
					if (elem.disabled) {
						return true;
					}

					// TODO: check if the element has the "disabled" attribute

					return false;
				}

				var getElementViewportPosition = function (elem) {
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

				var checkElementOnPoint = function (elem, point) {
					var pointElement = document.elementFromPoint(point.x, point.y);

					do {
						if (pointElement === elem) {
							return true;
						}
					} while (pointElement = pointElement.parentNode);

					return false;
				}

				var isOverrided = function (elem) {
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

				var elementOverridesElement = function (innerElement, outerElement) {

					if (elementIsInsideElement(innerElement, outerElement) == false && elementIsABackdrop(outerElement) == false) {
						return false;
					}

					if (getElementOnTop(innerElement, outerElement) == innerElement) {
						return false;
					}

					return true;
				}

				var elementIsInsideElement = function (innerElement, outerElement) {
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

				var elementIsABackdrop = function (elem) {

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

				var getElementOnTop = function (a, b) {
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

				var domRelativePosition = function (ctxA, ctxB, a, b) {
					if ($.inArray(b, $(a).parents()) >= 0) {
						return a;
					}

					if ($.inArray(a, $(b).parents()) >= 0) {
						return b;
					}

					return ($(ctxA).index() - $(ctxB).index() > 0 ? a : b);
				}

				var cssProperty = function (elem, prop) {
					return window.getComputedStyle(elem).getPropertyValue(prop);
				}

				var preventDefault = function (evt) {
					if (config.preventDefault === false) {
						return;
					}

					if (config.preventDefault === true) {
						evt.preventDefault();
						return;
					}

					evt.preventDefault();
					console.warn('Invalid preventDefault value (should be a boolean)');
				}

				var stopPropagation = function (evt) {
					if (config.stopPropagation === false) {
						return;
					}

					if (config.stopPropagation === true) {
						evt.stopPropagation();
						return;
					}

					evt.stopPropagation();
					console.warn('Invalid stopPropagation value (should be a boolean)');
				}

				init();
			}
		};
	}]);

}).call(this);