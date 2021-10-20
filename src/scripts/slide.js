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
   * Workaround for KidsLoop app. When dragging a text draggable, the
   * screen slides as well and nobody seems to be able or willing to
   * investigate why instead.
   * @param {H5P.ContentType} instance Instance of H5P content.
   * @param {string[]} machineNames Machine names of libraries to block dragging.
   */
  self.kidsloopPreventDragging = function (instance, machineNames) {
    const machineName = instance && instance.libraryInfo && instance.libraryInfo.machineName || null;

    if (machineNames.indexOf(machineName) !== -1) {
      let draggablesToBlock = [];
      if (machineName === 'H5P.DragText') {
        draggablesToBlock = instance.$draggables.get(0).childNodes;
      }
      else if (machineName === 'H5P.DragQuestion') {
        draggablesToBlock = instance.draggables.map(draggable => draggable.element.$.get(0));
      }

      // Add listeners to block dragging on slides
      draggablesToBlock.forEach(draggable => {
        draggable.addEventListener('touchstart', () => {
          this.parent.blockSliding = true;
        });

        draggable.addEventListener('touchend', () => {
          this.parent.blockSliding = false;
        });
      });
    }
  };

  /**
   * Append all of the elements to the slide.
   */
  self.appendElements = function () {

    for (let i = 0; i < self.children.length; i++) {
      self.parent.attachElement(parameters.elements[i], self.children[i].instance, $wrapper, self.index);

      // Workaround for KidsLoop app.
      self.kidsloopPreventDragging(self.children[i].instance, Slide.KIDSLOOP_PREVENT_DRAGGING);
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

/** @constant Machine name of content types that should prevent slide dragging, KidsLoop workaround for app */
Slide.KIDSLOOP_PREVENT_DRAGGING = ['H5P.DragText', 'H5P.DragQuestion'];

export default Slide;
