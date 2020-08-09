import setjs from '@stateempire/setjs';
import {lazyPic, makeLazy} from 'setbp/utility/lazy-media.js';

setjs.addFuncs({
  lazyPic: function(val, opts) {
    lazyPic(opts.$el);
  },
  lazyImg: makeLazy('src'),
  lazyBg: makeLazy('bg'),
});
