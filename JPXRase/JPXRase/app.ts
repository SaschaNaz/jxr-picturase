///<reference path="arrayedstream.ts"/>
///<reference path="SubstrateComponents/ifdentry.ts"/>
///<reference path="SubstrateComponents/imageheader.ts"/>
///<reference path="SubstrateComponents/imageplaneheader.ts"/>
module JxrPicturase {
    class SubstrateWithCoenzyme {
        stream: ArrayedStream;
        IfdEntries: SubstrateComponents.IfdEntry[] = [];

        constructor(file: ArrayBuffer) {
            this.stream = new ArrayedStream(file, 0);
        }
    }

    class BindingDomain {

    }

    class CatalyticDomain {
        react(file: ArrayBuffer) {
            //porting ReadContainer method
            var JxrInvalidMessage = new Error("This format is not a valid JPEG XR format for JXR Picturase.");

            var substrate = new SubstrateWithCoenzyme(file);
            var stream = substrate.stream;

            //signiture
            if (stream.readAsUtf8Text(2) !== 'II')
                throw JxrInvalidMessage;
            if (stream.readAsUint8() != 0xBC)
                throw JxrInvalidMessage;

            //JXR version check - only 01 will be accepted, as JPEG XR T.832 01/2012
            {
                var versionNumber = stream.readAsUint8();
                if (versionNumber != 1)
                    throw new Error("Current version of JXR Picturase doesn't support this version of JPEG XR.");
            }

            //PFD - what is PFD? format decoder?
            stream.seek(stream.readAsUint32());
            {
                var pfdEntries = stream.readAsUint16();
                if (pfdEntries == 0 && pfdEntries == 0xFFFF)
                    throw JxrInvalidMessage;
                this.parseIfd(substrate, pfdEntries);
            }
        }

        //ported version of ParsePFD
        private parseIfd(substrate: SubstrateWithCoenzyme, pfdEntries: number) {
            var stream = substrate.stream;
            var ifdEntry = SubstrateComponents.IfdEntry.Parse(stream, pfdEntries);
            substrate.IfdEntries.push(ifdEntry);

            var imageStream = stream.cleaveStream(ifdEntry.imageOffset, ifdEntry.imageByteCount);
            var imageHeader = SubstrateComponents.ImageHeader.Parse(imageStream);
            //now imageStream position is changed by byte, not bit, as bits left should be ignored
            var imagePlaneHeader = SubstrateComponents.ImagePlaneHeader.Parse(imageStream, imageHeader, false);
            //var nextIfdOffset = stream.readAsUint32();
            //This can be used to read multiple subfiles, but HTML img tag doesn't support it, but anyway...
        }
    }

    window.onload = () => {
        var image = new Image();
        //image.onload = () => { if (image.height != 3 || image.width != 2) startReaction(); };
        //image.onerror = () => { startReaction(); };
        image.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAJAAG8AQAQAAAAegAAAAK8BAABAAAAAAAAAAS8BAABAAAAAAAAAIC8BAABAAAAAgAAAIG8BAABAAAAAwAAAIK8CwABAAAAAADAQoO8CwABAAAAAADAQsC8BAABAAAAigAAAMG8BAABAAAADgEAAAAAAAAkw91vA07+S7GFPXd2jckMV01QSE9UTwARRMBxAAEAAmAAoAAKAACgAAAAAQAAAAkAPv8ABEKAAAEAAAEByQ1Yf8AAAAEC+CFiBD4ggohx4eEAEYaNG1TNAiQC9xR+0RLkCyGAAABAMAALCApgSCe/8AAAAAAAAAAAAQMjN6DL0wTgiCRowm+GEBEEfCCSwwmmGEqhBEogj4QTUjCSQgl5wQ2CPqCiemEkSMJ8QQQUOaQT+kAJnaCiemEkSMJ8QVBRPTCSJGE+IIIKHNIJ/SAEzoQUOaQT+kAJnaCVUgksQgjTF0EqpBJYhBGmLoJVSCSyQRpy6CVUgksiCNMTsKHMwn9QhM7wocmE/pBCZ3hQ5MJ/SCEzvChyYT+oQmdA";

        Activate();
    };

    function Activate() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "temp.jxr", true);
        xhr.responseType = "arraybuffer";

        xhr.onload = () => {
            if (xhr.status == 200) {
                var jxrase = new CatalyticDomain();
                try {
                    jxrase.react(xhr.response);
                }
                catch (e) {
                    console.log((<Error>e).message);
                }
            }
            else
                console.log('Image URL is invalid.');
        }
        xhr.send();
    }
}