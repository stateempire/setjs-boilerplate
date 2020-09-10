import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';
import {setDefData} from 'setbp/kernel/basics.js';
import {batchCall} from 'setbp/utility/calls.js';
import initSampleEntities from 'entities/sample.js';

['init', 'route', 'user', 'lang'].forEach(function(name) {
  eventManager.addListener(eventTypes[name], {id: 'data', priority: 1}, function(data) {
    name = name == 'init' ? 'route' : name;
    setDefData(name, data);
  });
});

export default function(opts) {
  batchCall(opts)
  .add(initSampleEntities)
  .go();
}
