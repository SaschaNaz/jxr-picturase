///<reference path="arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
var JxrPicturase;
(function (JxrPicturase) {
    var JxrBindingDomain = (function () {
        function JxrBindingDomain() {
        }
        return JxrBindingDomain;
    })();

    var ActiveSite = (function () {
        function ActiveSite() {
        }
        ActiveSite.prototype.react = function (file) {
            //porting ReadContainer method
            var JxrInvalidMessage = "This format is not a valid JPEG XR format for JXR Picturase.";
            var JxrVersionTooHighMessage = "Current version of JXR Picturase doesn't support this version of JPEG XR.";

            var stream = new JxrPicturase.ArrayedStream(file);

            if (stream.readAsText(2) !== 'II')
                throw JxrInvalidMessage;
            var jxrId = stream.readAsUint16();
            if ((0xFF & jxrId) != 0xBC)
                throw JxrInvalidMessage;

             {
                var versionNumber = (0xFF00 & jxrId) >> 8;
                if (versionNumber != 0 && versionNumber != 1)
                    throw JxrVersionTooHighMessage;
            }

            //PFD - what is PFD? format decoder?
            stream.seek(stream.readAsUint32());
             {
                var pfdEntries = stream.readAsUint16();
                if (pfdEntries == 0 && pfdEntries == 0xFFFF)
                    throw JxrInvalidMessage;
                this.parsePFDEntries(stream, pfdEntries);
            }
        };

        //ported version of ParsePFD
        ActiveSite.prototype.parsePFDEntries = function (stream, pfdEntries) {
            for (var i = 0; i < pfdEntries; i++) {
                this.parsePFD(stream, stream.readAsUint16(), stream.readAsUint16(), stream.readAsUint32(), stream.readAsUint32());
            }
        };

        //ported version of ParsePFDEntry
        ActiveSite.prototype.parsePFD = function (stream, tag, type, count, value) {
            switch (tag) {
                case 0xBC01: {
                    stream.seek(value);
                    var guid = stream.readAsGuidHexString();

                    break;
                }
                case 0xBC02: {
                    break;
                }
                case 0xBC80: {
                    break;
                }
                case 0xBC81: {
                    break;
                }
                case 0xBCC0: {
                    break;
                }
                case 0xBCC1: {
                    break;
                }
                case 0xBCC2: {
                    break;
                }
                case 0xBCC3: {
                    break;
                }
                case 0xBC82: {
                    break;
                }
                case 0xBC83: {
                    break;
                }
                case 0x8773: {
                    break;
                }
                case 0x02BC: {
                    break;
                }
                case 0x8769: {
                    break;
                }
                case 0x8825: {
                    break;
                }
                case 0x83BB: {
                    break;
                }
                case 0x8649: {
                    break;
                }
                case 0xBC03:
                case 0xBC04:
                case 0xBCC4:
                case 0xBCC5:
                    break;

                case 0x010E: {
                    break;
                }
                case 0x010F: {
                    break;
                }
                case 0x0110: {
                    break;
                }
                case 0x0131: {
                    break;
                }
                case 0x0132: {
                    break;
                }
                case 0x013B: {
                    break;
                }
                case 0x8298: {
                    break;
                }
                case 0x4746: {
                    break;
                }
                case 0x4749: {
                    break;
                }
                case 0x9C9B: {
                    break;
                }
                case 0x010D: {
                    break;
                }
                case 0x011D: {
                    break;
                }
                case 0x0129: {
                    break;
                }
                case 0x013c: {
                    break;
                }
                default: {
                    break;
                }
            }
        };
        return ActiveSite;
    })();

    window.onload = function () {
        var image = new Image();

        //image.onload = () => { if (image.height != 3 || image.width != 2) startReaction(); };
        image.onerror = function () {
            startReaction();
        };
        image.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAJAAG8AQAQAAAAegAAAAK8BAABAAAAAAAAAAS8BAABAAAAAAAAAIC8BAABAAAAAgAAAIG8BAABAAAAAwAAAIK8CwABAAAAAADAQoO8CwABAAAAAADAQsC8BAABAAAAigAAAMG8BAABAAAADgEAAAAAAAAkw91vA07+S7GFPXd2jckMV01QSE9UTwARRMBxAAEAAmAAoAAKAACgAAAAAQAAAAkAPv8ABEKAAAEAAAEByQ1Yf8AAAAEC+CFiBD4ggohx4eEAEYaNG1TNAiQC9xR+0RLkCyGAAABAMAALCApgSCe/8AAAAAAAAAAAAQMjN6DL0wTgiCRowm+GEBEEfCCSwwmmGEqhBEogj4QTUjCSQgl5wQ2CPqCiemEkSMJ8QQQUOaQT+kAJnaCiemEkSMJ8QVBRPTCSJGE+IIIKHNIJ/SAEzoQUOaQT+kAJnaCVUgksQgjTF0EqpBJYhBGmLoJVSCSyQRpy6CVUgksiCNMTsKHMwn9QhM7wocmE/pBCZ3hQ5MJ/SCEzvChyYT+oQmdA";

        startReaction();
    };

    function startReaction() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "temp.jxr", true);
        xhr.responseType = "arraybuffer";

        var arraybuffer;
        xhr.onload = function () {
            arraybuffer = xhr.response;

            var jxrase = new ActiveSite();
            jxrase.react(arraybuffer);
        };
        xhr.send();
    }
})(JxrPicturase || (JxrPicturase = {}));
//@ sourceMappingURL=app.js.map
