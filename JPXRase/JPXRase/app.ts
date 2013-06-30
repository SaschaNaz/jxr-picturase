///<reference path="arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="containerinfo.ts"/>
module JxrPicturase {
    class SubstrateWithCoenzyme {
        stream: ArrayedStream;
        containerInfo = new ContainerInfo();

        constructor(file: ArrayBuffer) {
            this.stream = new ArrayedStream(file, 0);
        }
    }

    class BindingDomain {

    }

    class ActiveSite {
        react(file: ArrayBuffer) {
            //porting ReadContainer method
            var JxrInvalidMessage = "This format is not a valid JPEG XR format for JXR Picturase.";

            var substrate = new SubstrateWithCoenzyme(file);
            var stream = substrate.stream;

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
                    throw "Current version of JXR Picturase doesn't support this version of JPEG XR.";
            }

            //PFD - what is PFD? format decoder?
            stream.seek(stream.readAsUint32());
            {
                var pfdEntries = stream.readAsUint16();
                if (pfdEntries == 0 && pfdEntries == 0xFFFF)
                    throw JxrInvalidMessage;
                this.parsePFDEntries(substrate, pfdEntries);
            }
        }

        //ported version of ParsePFD
        private parsePFDEntries(substrate: SubstrateWithCoenzyme, pfdEntries: number) {
            var stream = substrate.stream;
            for (var i = 0; i < pfdEntries; i++) {
                this.parsePFD(
                    substrate,
                    stream.readAsUint16(),
                    stream.readAsUint16(),
                    stream.readAsUint32(),
                    stream.readAsSubstream(4));
            }
        }

        //ported version of ParsePFDEntry
        private parsePFD(substrate: SubstrateWithCoenzyme, tag: number, type: number, count: number, valueAsSubstream: ArrayedStream) {
            var stream = substrate.stream;
            switch (tag) {
                case 0xBC01: //pixel format tag
                    {
                        var childStream = stream.duplicateStream();
                        childStream.seek(valueAsSubstream.readAsUint32());
                        var pixelFormat = PixelFormats.getPixelFormatByGuid(childStream.readAsGuidHexString());

                        var containerInfo = substrate.containerInfo;
                        containerInfo.hasAlpha = pixelFormat.hasAlpha;
                        containerInfo.imageInfo.bitsPerUnit = pixelFormat.bitsPerUnit;
                        containerInfo.imageInfo.isRgb = !pixelFormat.isBgr;
                        break;
                    }
                case 0xBC02: //transformation tag
                    {
                        if (count != 1)
                            throw 'Failed to read transformation tag.';
                        substrate.containerInfo.orientationState = ImageOrientationState.getOrientationState(valueAsSubstream.readAsUint32());
                        break;
                    }
                case 0xBC80: //image width tag
                    {
                        if (valueAsSubstream.readAsUint32() == 0)
                            throw 'Invalid width tag';
                        break;
                    }
                case 0xBC81: //image height tag
                    {
                        if (valueAsSubstream.readAsUint32() == 0)
                            throw 'Invalid height tag';
                        break;
                    }
                case 0xBCC0: //image offset tag
                    {
                        break;
                    }
                case 0xBCC1: //image byte count tag
                    {
                        break;
                    }
                case 0xBCC2: //alpha offset tag
                    {
                        break;
                    }
                case 0xBCC3: // alpha byte count tag
                    {
                        break;
                    }
                case 0xBC82: // width resolution tag
                    {
                        if (count != 1)
                            throw 'Invalid with resolution tag';
                        var value = valueAsSubstream.readAsUint32();
                        break;
                    }
                case 0xBC83: // height resolution tag
                    {
                        break;
                    }
                case 0x8773: // ICC profile tag - same as TIFF
                    {
                        break;
                    }
                case 0x02BC: // XMP metadata tag
                    {
                        break;
                    }
                case 0x8769: // EXIF metadata tag
                    {
                        break;
                    }
                case 0x8825: // GPS info metadata tag
                    {
                        break;
                    }
                case 0x83BB: // IPTC-NAA metadata tag
                    {
                        break;
                    }
                case 0x8649: // Photoshop metadata tag
                    {
                        break;
                    }
                case 0xBC03: // compression tag
                case 0xBC04: // image type tag
                case 0xBCC4: // (discarded) image data tag
                case 0xBCC5: // (discarded) alpha data tag
                    break;

                //descriptive metadata
                case 0x010E: // image description tag
                    {
                        break;
                    }
                case 0x010F: // camera manufacturer tag
                    {
                        break;
                    }
                case 0x0110: // camera model name tag
                    {
                        break;
                    }
                case 0x0131: // software tag
                    {
                        break;
                    }
                case 0x0132: // date and time tag
                    {
                        break;
                    }
                case 0x013B: // artist tag
                    {
                        break;
                    }
                case 0x8298: // copyright tag
                    {
                        break;
                    }
                case 0x4746: // rating stars tag
                    {
                        break;
                    }
                case 0x4749: // rating value tag
                    {
                        break;
                    }
                case 0x9C9B: // caption tag
                    {
                        break;
                    }
                case 0x010D: // document name tag
                    {
                        break;
                    }
                case 0x011D: // page name tag
                    {
                        break;
                    }
                case 0x0129: // page number tag
                    {
                        break;
                    }
                case 0x013c: // host computer tag
                    {
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
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
}