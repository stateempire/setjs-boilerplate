import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

var pending = [];

eventManager.addListener(eventTypes.view, 'lazy-media', function(top, bottom, height) {
  for (var i = pending.length - 1; i >= 0; i--) {
    if ($.contains(document.body, pending[i].$el[0])) {
      if (loadFullMedia(pending[i], height)) {
        pending.splice(i, 1);
      }
    } else {
      pending.splice(i, 1);
    }
  }
  manageVideos();
});

setInterval(manageVideos, 1000);

function manageVideos() {
  var width = $(window).width() + 200;
  var height = $(window).height();
  pending.filter(x => x.isReady).forEach(function(item) {
    var {left, top, right, bottom} = item.$el[0].getBoundingClientRect();
    if (right < -200 || left > width || bottom < 0 || top > height) {
      item.pause();
    } else {
      item.play();
    }
  });
}

function loadFullMedia(item, height) {
  var {$el, type, url} = item;
  var {top, bottom} = $el[0].getBoundingClientRect();
  if (bottom >= 0 && top <= height) {
    if (item.loadFunc) {
      item.loadFunc(item);
    } else if (type == 'vid') {
      if (!item.video) {
        item.play = play;
        item.pause = pause;
        item.video = item.getVideo();
        item.video.oncanplay = videoCallback;
        if (item.video.readyState > 3) {
          videoCallback();
        }
      }
      return;
    } else if (type == 'pic') {
      processPic();
    } else {
      processImage();
    }
    return true;
  }

  function mediaLoaded() {
    $el.addClass('js-loaded');
  }

  function videoCallback() {
    item.video.muted = true;
    item.video.oncanplay = null;
    item.isReady = true;
    mediaLoaded();
  }

  function pause() {
    if (!item.video.paused) {
      item.video.pause();
    }
  }

  function play() {
    if (item.isReady && item.video.paused) {
      item.video.play();
    }
  }

  function processImage() {
    $('<img>').on('load', function() {
      if (type == 'bg') {
        $el.css('background-image', 'url(' + url + ')');
        mediaLoaded();
      } else {
        $el.on('load', mediaLoaded).attr('src', url);
      }
    }).attr('src', url);
  }

  function processPic() {
    var $img = $el.find('img');
    var $sources = $el.find('source').detach();
    var attempts = 0;
    $img.on('load.lazy', completeLoad);
    $sources.each(function() {
      var $source = $(this);
      $source.attr('srcset', $source.data('srcset'));
    });
    $el.prepend($sources);
    setTimeout(poll, 80);

    function poll() {
      if ($img[0].complete || attempts++ > 60) {
        completeLoad();
      } else {
        setTimeout(poll, 500);
      }
    }

    function completeLoad() {
      if (!$el.hasClass('js-loaded')) {
        $img.off('.lazy').addClass('js-loaded').closest('.lazy-load').addClass('js-loaded');
        $el.off('.lazy');
        mediaLoaded();
      }
    }
  }
}

export function lazyMedia(opts) {
  var {$el} = opts;
  if (!$el.data('lm')) {
    $el.data('lm', 1);
    processLazy();
  }
  function processLazy() {
    if ($.contains(document.body, $el[0])) {
      if (!loadFullMedia(opts, $(window).height())) {
        pending.push(opts);
      }
    } else {
      setTimeout(processLazy, 250);
    }
  }
}

export function lazyPic($el) {
  lazyMedia({$el, type: 'pic'});
}

export function lazyImg($el, url) {
  lazyMedia({$el, url, type: 'src'});
}

export function makeLazy(type) {
  return function(url, {$el}) {
    if (url) {
      lazyMedia({$el, type, url});
    } else {
      $el.parent('figure').remove();
      $el.remove();
    }
  };
}
