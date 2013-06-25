class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

class JxrBindingDomain {

}

class ActiveSite {
    react(file: ArrayBuffer) {

        alert('reacted');
    }
}

class ArrayedStream {
    private index: number;
    private filearray: Uint8Array;

    constructor(file: ArrayBuffer) {
        var filearray = new Uint8Array(file);
    }

    readAsArrayBy(length: number) {
        if (this.index + length <= this.filearray.length)
            return this.filearray.subarray(this.index, this.index + length);
        else
            throw "File reached to the end.";
    }

    readAsByte() {
        if (this.index + 1 <= this.filearray.length) {
            this.index++;
            return this.filearray[this.index];
        }
    }

    readAsText(length: number) {
        if (this.index + length < this.filearray.length)
            return this.filearray.subarray(this.index, this.index + length);
        else
            throw "File reached to the end.";
    }

    moveBy(position: number) {
        var indexafter = this.index + position;
        if (indexafter >= 0)
            this.index = indexafter;
        else
            throw "The stream couldn't seek that position.";
    }
}

window.onload = () => {
    var image = new Image();
    //image.onload = () => { if (image.height != 3 || image.width != 2) startReaction(); };
    image.onerror = () => { startReaction(); };
    image.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAJAAG8AQAQAAAAegAAAAK8BAABAAAAAAAAAAS8BAABAAAAAAAAAIC8BAABAAAAAgAAAIG8BAABAAAAAwAAAIK8CwABAAAAAADAQoO8CwABAAAAAADAQsC8BAABAAAAigAAAMG8BAABAAAADgEAAAAAAAAkw91vA07+S7GFPXd2jckMV01QSE9UTwARRMBxAAEAAmAAoAAKAACgAAAAAQAAAAkAPv8ABEKAAAEAAAEByQ1Yf8AAAAEC+CFiBD4ggohx4eEAEYaNG1TNAiQC9xR+0RLkCyGAAABAMAALCApgSCe/8AAAAAAAAAAAAQMjN6DL0wTgiCRowm+GEBEEfCCSwwmmGEqhBEogj4QTUjCSQgl5wQ2CPqCiemEkSMJ8QQQUOaQT+kAJnaCiemEkSMJ8QVBRPTCSJGE+IIIKHNIJ/SAEzoQUOaQT+kAJnaCVUgksQgjTF0EqpBJYhBGmLoJVSCSyQRpy6CVUgksiCNMTsKHMwn9QhM7wocmE/pBCZ3hQ5MJ/SCEzvChyYT+oQmdA";
};

function startReaction() {
    var jxrase = new ActiveSite();
    jxrase.react;
}