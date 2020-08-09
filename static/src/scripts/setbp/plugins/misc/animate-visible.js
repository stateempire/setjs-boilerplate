import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

eventManager.addListener(eventTypes.view, 'animate-visible', function(top, bottom) {
  $('[data-animation]').not('.js-animated').each(function() {
    var $el = $(this);
    var elTop = $el.offset().top;
    var elBottom = elTop + $el.height();
    if (elBottom >= top && elTop <= bottom) {
      $el.addClass('js-animated').addClass($el.data('animation'));
    }
  });
});
