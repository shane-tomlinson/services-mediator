/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function(exports) {
  "use strict";

  var Promises = exports.Promises;

  var ServiceMediator = function() {};
  ServiceMediator.prototype = {
    request: function(message) {
      init.call(this);

      if (!this._promises[message]) this._promises[message] = [];

      var promise = Promises.create();
      this._promises[message].push(promise);

      clearQueue.call(this, message);

      return promise;
    },

    on: function(message, callback) {
      init.call(this);

      if (this._listeners[message]) throw new Error("only one service responder allowed");

      this._listeners[message] = callback;
      clearQueue.call(this, message);
    }
  };

  function clearQueue(message) {
    var promises = this._promises[message];
    var callback = this._listeners[message];
    if (promises && callback) {
      var promise;
      /*jshint boss:true*/
      while (promise = promises.shift()) {
        try {
          callback(promise);
        } catch(e) {
          promise.reject(e);
        }
      }
    }
  }

  function init() {
    /*jshint validthis: true*/
    if (!this._listeners) {
      this._listeners = {};
      this._promises = {};
    }
  }

  exports.ServiceMediator = {
    create: function() {
      return new ServiceMediator();
    }
  };

}(typeof module !== "undefined" ? module.exports : window));

