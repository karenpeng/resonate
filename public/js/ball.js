(function (exports) {
  "use strict";
  var Ball = function (x, y, n, p) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.processing = p;
  };

  Ball.prototype.paint = function () {
    this.processing.fill(255);
    this.processing.noStroke();
    this.processing.ellipse(this.x, this.y, this.n, this.n);
    this.processing.fill(0);
    this.processing.ellipse(this.x-3, this.y-3, 3, 3);
    this.processing.ellipse(this.x+3, this.y-3, 3, 3);
  };
  exports.Ball = Ball;
})(this);
