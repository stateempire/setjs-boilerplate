import getComp from 'setbp/template/component.js';
import {lazyMedia} from 'setbp/utility/lazy-media.js';
import {loadImages} from 'setbp/utility/assets.js';
import getSlickConfig from 'config/slick-config.js';

function loadInsta({name, config, $el}) {
  $.getJSON('https://www.instagram.com/' + name +'/?__a=1', function(res) {
    var slickConfig = getSlickConfig(config);
    var instaComp = getComp('common/instagram', {posts: res.graphql.user.edge_owner_to_timeline_media.edges});
    loadImages(instaComp.$root.find('img'), function() {
      $el.append(instaComp.$root);
      instaComp.$root.find('.slides').slick($.extend({
        prevArrow: instaComp.$prev,
        nextArrow: instaComp.$next,
      }, slickConfig));
    });
  });
}

$.fn.instagram = function(name, config) {
  var $el = this;
  lazyMedia({name, config, $el, loadFunc: loadInsta});
  // $('.slick-slider').slick('reInit');
  return $el;
};
