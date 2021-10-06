import Element from './element.js';
import Parent from 'h5p-parent';

/**
 * @class
 */
function Slide(parameters) {
  const self = this;
  Parent.call(self, Element, parameters.elements);

  // The slide DOM element when attached
  let $wrapper;

  /**
   * Create HTML
   *
   * @return {jQuery} Element
   */
  self.getElement = function () {
    if (!$wrapper) {
      $wrapper = H5P.jQuery(Slide.createHTML(parameters));
    }
    return $wrapper;
  };

  /**
   * Make current slide
   */
  self.setCurrent = function () {
    this.parent.$current = $wrapper.addClass('h5p-current');
  };

  /**
   * Append all of the elements to the slide.
   */
  self.appendElements = function () {

    for (let i = 0; i < self.children.length; i++) {
      self.parent.attachElement(parameters.elements[i], self.children[i].instance, $wrapper, self.index);

      /*
       * Workaround for KidsLoop app. When dragging a text draggable, the
       * screen slides as well and nobody seems to be able or willing to
       * investigate why instead.
       */
      const instance = self.children[i].instance;
      if (instance && instance.libraryInfo && instance.libraryInfo.machineName === 'H5P.DragText') {
        self.children[i].instance.$draggables.get(0).childNodes.forEach(child => {
          child.addEventListener('touchstart', () => {
            this.parent.blockSliding = true;
          });

          child.addEventListener('touchend', () => {
            this.parent.blockSliding = false;
          });
        });
      }
    }

    self.parent.elementsAttached[self.index] = true;
    self.parent.trigger('domChanged', {
      '$target': $wrapper,
      'library': 'CoursePresentation',
      'key': 'newSlide'
    }, {'bubbles': true, 'external': true});
  };
}

/**
 * Creates the HTML for a single slide.
 *
 * @param {Object} params Slide parameters.
 * @returns {string} HTML.
 */
Slide.createHTML = function (parameters) {
  return '<div role="document" class="h5p-slide"' + (parameters.background !== undefined ? ' style="background:' + parameters.background + '"' : '') + '></div>';
};

export default Slide;
