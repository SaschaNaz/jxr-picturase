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
        //porting ReadContainer method

        var JxrInvalidMessage = "This format is not a valid JPEG XR format for JXR Picturase.";
        var JxrVersionTooHighMessage = "Current version of JXR Picturase doesn't support this version of JPEG XR.";

        var stream = new ArrayedStream(file);

        //signiture
        if (stream.readAsText(2) !== 'II')
            throw JxrInvalidMessage;
        var jxrId = stream.readAsUint16();
        if ((0xFF & jxrId) != 0xBC)
            throw JxrInvalidMessage;

        //JXR version check - only 00 and 01 will be accepted
        {
            var versionNumber = (0xFF00 & jxrId) >> 8;
            if (versionNumber != 0 && versionNumber != 1)
                throw JxrVersionTooHighMessage;
        }

        //PFD - what is PFD? format decoder?
        stream.seek(stream.readAsUint32());

    }
}

class ArrayedStream {
    private index: number;
    private filearray: Uint8Array;

    constructor(file: ArrayBuffer) {
        this.filearray = new Uint8Array(file);
        this.index = 0;
    }

    readAsArrayBy(length: number) {
        var indexbefore = this.index;
        var indexafter = this.index + length;
        if (indexafter <= this.filearray.length) {
            this.index = indexafter;
            return this.filearray.subarray(indexbefore, indexafter);
        }
        else
            throw "File reached to the end.";
    }

    readAsUint8() {
        if (this.index + 1 <= this.filearray.length) {
            var uint8 = this.filearray[this.index]
            this.index++;
            return uint8;
        }
        else
            throw "File reached to the end.";
    }

    //little endian
    readAsUint16() {
        if (this.index + 2 <= this.filearray.length) {
            var uint16 = this.filearray[this.index] + (this.filearray[this.index + 1] << 8);
            this.index += 2;
            return uint16;
        }
        else
            throw "File reached to the end.";
    }

    //little endian
    readAsUint32() {
        if (this.index + 4 <= this.filearray.length) {
            var uint32 = this.filearray[this.index] + (this.filearray[this.index + 1] << 8) + (this.filearray[this.index + 2] << 16) + (this.filearray[this.index + 3] << 24);
            this.index += 4;
            return uint32;
        }
        else
            throw "File reached to the end.";
    }

    readAsText(length: number) {
        return String.fromCharCode.apply(null, this.readAsArrayBy(length));
    }

    moveBy(length: number) {
        var indexafter = this.index + length;
        if (indexafter >= 0 && indexafter <= this.filearray.length)
            this.index = indexafter;
        else
            throw "The stream couldn't seek that position.";
    }

    seek(position: number) {
        if (position >= 0 && position <= this.filearray.length)
            this.index = position;
        else
            throw "The stream couldn't seek that position.";
    }
}

window.onload = () => {
    var image = new Image();
    //image.onload = () => { if (image.height != 3 || image.width != 2) startReaction(); };
    image.onerror = () => { startReaction(); };
    image.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAJAAG8AQAQAAAAegAAAAK8BAABAAAAAAAAAAS8BAABAAAAAAAAAIC8BAABAAAAAgAAAIG8BAABAAAAAwAAAIK8CwABAAAAAADAQoO8CwABAAAAAADAQsC8BAABAAAAigAAAMG8BAABAAAADgEAAAAAAAAkw91vA07+S7GFPXd2jckMV01QSE9UTwARRMBxAAEAAmAAoAAKAACgAAAAAQAAAAkAPv8ABEKAAAEAAAEByQ1Yf8AAAAEC+CFiBD4ggohx4eEAEYaNG1TNAiQC9xR+0RLkCyGAAABAMAALCApgSCe/8AAAAAAAAAAAAQMjN6DL0wTgiCRowm+GEBEEfCCSwwmmGEqhBEogj4QTUjCSQgl5wQ2CPqCiemEkSMJ8QQQUOaQT+kAJnaCiemEkSMJ8QVBRPTCSJGE+IIIKHNIJ/SAEzoQUOaQT+kAJnaCVUgksQgjTF0EqpBJYhBGmLoJVSCSyQRpy6CVUgksiCNMTsKHMwn9QhM7wocmE/pBCZ3hQ5MJ/SCEzvChyYT+oQmdA";

    startReaction();
};

function startReaction() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "temp.txt", true);
    xhr.responseType = "arraybuffer";

    var arraybuffer: ArrayBuffer;
    xhr.onload = () => {
        arraybuffer = xhr.response;
        
        var jxrase = new ActiveSite();
        jxrase.react(arraybuffer);
    }
    xhr.send();
}