/*globals window: true, describe: true, it: true, assert:true*/
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var ServiceMediator = window.ServiceMediator;

  describe("ServiceMediator", function() {
    it("are createable", function() {
      var services = ServiceMediator.create();
      assert.ok(services);
    });

    it("only one responder per message", function() {
      var services = ServiceMediator.create();
      services.on("service", function() {});
      var err;
      try {
        services.on("service", function() {});
      } catch(e) {
        err = e;
      }

      assert.equal(String(err), "Error: only one service responder allowed");
    });
    it("on/request", function(done) {
      var services = ServiceMediator.create();

      services.request('service').then(function(value) {
        assert.equal(value, "value");
        done();
      });

      services.on('service', function(promise) {
        promise.fulfill("value");
      });
    });

    it("multiple request", function(done) {
      var services = ServiceMediator.create();

      var count = 0;
      services.request('service').then(function() {
        assert.equal(count, 1);
      });

      services.request('service').then(function() {
        assert.equal(count, 2);
        done();
      });

      services.on('service', function(promise) {
        count++;
        promise.fulfill("value");
      });
    });

    it("errors in the service handler call the error handler of the promise", function(done) {
      var services = ServiceMediator.create();

      var otherwiseCalled = true;
      services.request('service').then(function(value) {
        assert.ok(false);
      }).otherwise(function(reason) {
        assert.ok(reason);
        otherwiseCalled = true;
      });

      services.request('service').then(function() {
        assert.equal(otherwiseCalled, true);
        done();
      }).otherwise(function(reason) {
        assert.ok(false);
      });

      var count = 0;
      services.on('service', function(promise) {
        count++;
        if (count === 2) {
          promise.fulfill("value");
        } else {
          throw new Error("error");
        }
      });
    });

  });

}());

