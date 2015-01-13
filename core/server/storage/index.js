var errors  = require('../errors'),
config  = require('../config'),
storage = {}; 

function getStorage(storageChoice) {
    // TODO: this is where the check for storage apps should go
    // Local file system is the default.  Fow now that is all we support.
    storageChoice = config.fileStore;

    if (storage[storageChoice]) {
        return storage[storageChoice];
    }   

    try {
        // TODO: determine if storage has all the necessary methods.
        storage[storageChoice] = require('ghost-s3')({
          errors: errors,
          config: require('../config')().aws
      });
    } catch (e) {
        try {
            storage[storageChoice] = require(storageChoice);
        } catch (e) {
            errors.logError(e);
        }   
    }   

    // Instantiate and cache the storage module instance.
    storage[storageChoice] = new storage[storageChoice]();

    return storage[storageChoice];
}

module.exports.getStorage = getStorage;