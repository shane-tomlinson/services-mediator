# Service Mediator

An evening hack to implement a service request/response mediator using promises.

## Use
* Include lib/promises.js and lib/service-mediator.js into your project.
* Create an instance of the mediator.

```
var services = ServiceMediator.create();
```

* Bind a request listener - this can be done after requests are made.

```
services.on("request_name", function(promise) {
  // handle request here
  promise.fulfill("awesome");
  // or
  promise.reject("there was a problem");
});
```

* Make requests, receive a promise, bind listener to the promise.

```
services.request("request_name").then(function(value) {
  // Success! Do something with the value here.
}).otherwise(reason) {
  // wah wah, problem
});
```

## Author
* Shane Tomlinson
* shane@shanetomlinson.com
* stomlinson@mozilla.com
* set117@yahoo.com
* https://shanetomlinson.com
* http://github.com/shane-tomlinson
* http://github.com/stomlinson
* @shane_tomlinson


## License
This software is a vailable under version 2.0 of the MPL:

  https://www.mozilla.org/MPL/
