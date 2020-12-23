import { jQuery as $ } from './globals';

/**
 * Flattens a nested array
 *
 * Example:
 * [['a'], ['b']].flatten() -> ['a', 'b']
 *
 * @param {Array} arr A nested array
 * @returns {Array} A flattened array
 */
export const flattenArray = arr => arr.concat.apply([], arr);

/**
 * Returns true if the argument is a function
 *
 * @param {Function|*} f
 */
export const isFunction = f => typeof f === 'function';


/**
 * Makes a string kebab case
 *
 * @param {string} str
 * @return {string}
 */
export const kebabCase = str => str.replace(/[\W]/g, '-');

/**
 * Is true if the users device is an ipad
 *
 * @const {boolean}
 */
export const isIPad = navigator.userAgent.match(/iPad/i) !== null;


/**
 * Is true if the users device is an iOS device
 *
 * @const {boolean}
 */
export const isIOS = navigator.userAgent.match(/iPad|iPod|iPhone/i) !== null;

/**
 * Returns true if the array contains the value
 *
 * @template T
 * @param {Array.<T>} arr
 * @param {T} val
 * @return {boolean}
 */
export const contains = (arr, val) => arr.indexOf(val) !== -1;

/**
 * Returns a default value if provided value is undefined
 *
 * @template T
 * @param {T} value
 * @param {T} fallback
 * @return {T}
 */
export const defaultValue = (value, fallback) => (value !== undefined) ? value : fallback;

/**
 * Enum for keyboard key codes
 * @readonly
 * @enum {number}
 */
export const keyCode = {
  ENTER: 13,
  ESC: 27,
  SPACE: 32
};

/**
 * Make a non-button element behave as a button. I.e handle enter and space
 * keydowns as click
 *
 * @param  {H5P.jQuery} $element The "button" element
 * @param  {function(Event)} callback
 * @param  {*} [scope]
 */
export const addClickAndKeyboardListeners = function ($element, callback, scope) {
  $element.click(function (event) {
    callback.call(scope || this, event);
  });

  $element.keydown(function (event) {
    if (contains([keyCode.ENTER, keyCode.SPACE], event.which)) {
      event.preventDefault();
      callback.call(scope || this, event);
    }
  });
};

/**
 * Adjust size of inner element to outer element.
 *
 * When rotating the element-outer element, it will not fit into the
 * parent container and sides will be cut off. Solution in fitElement:
 * 1) Scale the parent to be large enough to take element-outer and use percentage as unit
 * 2) As element outer will scale up (width and height of 100%), so scale it down
 * 3) Fix scaling and positioning of element-inner element caused by scaling element-outer element
 *
 * @param {H5P.jQuery} $inner Inner element to fit into outer element.
 * @param {H5P.jQuery} $outer Outer element.
 */
export const fitElement = function($inner, $outer) {
  setTimeout(() => {
    // Store initial sizes
    const outerHullSize = getHullSize($outer);
    const innerHullSize = getHullSize($inner);

    $outer.css({
      width: `${innerHullSize.width * parseFloat($outer[0].style.width) / $outer[0].offsetWidth}%`,
      height: `${innerHullSize.height * parseFloat($outer[0].style.height) / $outer[0].offsetHeight}%`
    });

    // Compute scale percentage of inner element in relation to outer element
    const scale = {
      width: outerHullSize.width / innerHullSize.width,
      height: outerHullSize.height / innerHullSize.height
    }

    // Scale inner element to fit parent element
    $inner.css({
      transform: `${$inner[0].style.transform} scale(${scale.width}, ${scale.height})`
    });

    // Update content (revert scaling and sizing of parent)
    const $content = $inner.find('.h5p-element-inner');
    $content.css({
      transform: `${$content[0].style.transform} scale(${1 / scale.width}, ${1 / scale.height})`,
      transformOrigin: '0 0',
      width: `${scale.width * 100}%`,
      height: `${scale.height * 100}%`
    });

  }, 100); // TODO: Could make sense to investigate a better trigger for starting setRotation
};

/**
 * Get hull size for (rotated) element.
 * @param {H5P.jQuery} element Element.
 * @return {object} Hull size of element.
 */
export const getHullSize = function($element) {
  const clientRect = $element[0].getBoundingClientRect();

  return {
    width: clientRect.width,
    height: clientRect.height
  };
};

/**
 * @const {H5P.jQuery}
 */
const $STRIP_HTML_HELPER = $('<div>');

/**
 * Strips the html from a string, using jquery
 *
 * @param {string} str
 * @return {string}
 */
export const stripHTML = str => $STRIP_HTML_HELPER.html(str).text().trim();
