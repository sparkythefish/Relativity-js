goog.provide('c');

c.o = function (obj, prop) {
  console.log(prop + ": ");
  c.l(obj[prop]);
};

c.l = function (msg) { 
  console.log(msg);
};

c.d = function (msg) {
  var display = document.getElementById('display');
  display.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + msg;
};

c.count = 10;

c.c = function (msg) {
  if (c.count > 0) {
    c.count--;
    c.l(msg);
  }
}
