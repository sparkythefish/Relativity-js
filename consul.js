goog.provide('c');

c.display = document.getElementById('display');

c.debug = {"debug":"yes!"}

c.o = function (obj, prop) {
  console.log(prop + ": ");
  c.l(obj[prop]);
};

c.l = function (msg) { 
  console.log(msg);
};

c.d = function () {
};

c.tick = function () {
  if (!c.display) {
    c.display = document.getElementById('display');
  }
  c.display.innerHTML = '<pre>' + JSON.stringify(c.debug, undefined, 2) + '</pre>'; 
}

c.count = 50;

c.c = function (msg) {
  if (c.count > 0) {
    c.count--;
    c.l(msg);
  }
}
