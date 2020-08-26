import {addFuncs} from 'core/acts-funcs.js';
import {lazyPic, makeLazy} from 'setbp/utility/lazy-media.js';

addFuncs({
  lazyPic: function(val, opts) {
    lazyPic(opts.$el);
  },
  lazyImg: makeLazy('src'),
  lazyBg: makeLazy('bg'),
});
