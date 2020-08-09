import eventTypes from 'config/event-types.js';

export var storageTypes = {
  // An example of a storage type object, used by the local/memory storage module from setbp
  gdpr: {name: 'gdpr', type: 'boolean', eventAfter: eventTypes.gdpr},
};

export default function() {
  // add storage types that must be added dynamically here (e.g. using setup methods)
  // this will be called by scripts/setbp/kernel/storage.js when main.js loads it
}
