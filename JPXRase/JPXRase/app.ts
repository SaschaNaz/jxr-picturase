///<reference path="arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="containerinfo.ts"/>
///<reference path="formatids.ts"/>
///<reference path="jxrproperties.ts"/>
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

    class CatalyticDomain {
        react(file: ArrayBuffer) {
            //porting ReadContainer method
            var JxrInvalidMessage = "This format is not a valid JPEG XR format for JXR Picturase.";

            var substrate = new SubstrateWithCoenzyme(file);
            var stream = substrate.stream;

            //signiture
            if (stream.readAsUtf8Text(2) !== 'II')
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
            //value to offset, auto type check feature
            //아래 태그들을 propertyXbox 사용하게 통합
            var propertyXbox = new PropertyExporter(substrate.stream, type, count, valueAsSubstream);
            switch (tag) {
                case TagIds.PixelFormat: //pixel format tag
                    {
                        var childStream = substrate.stream.duplicateStream();
                        childStream.seek(valueAsSubstream.readAsUint32());
                        var pixelFormat = PixelFormats.getPixelFormatByGuid(childStream.readAsGuidHexString());

                        var containerInfo = substrate.containerInfo;
                        containerInfo.hasAlpha = pixelFormat.hasAlpha;
                        containerInfo.bitsPerUnit = pixelFormat.bitsPerUnit;
                        containerInfo.isRgb = !pixelFormat.isBgr;
                        break;
                    }
                case TagIds.Transformation: //transformation tag
                    {
                        if (count != 1)
                            throw 'Failed to read transformation tag.';
                        substrate.containerInfo.orientationState = ImageOrientationState.getOrientationState(valueAsSubstream.readAsUint32());
                        break;
                    }
                case TagIds.ImageSizeX: //image width tag
                    {
                        var value = valueAsSubstream.readAsUint32();
                        if (value == 0)
                            throw 'Invalid width tag';
                        substrate.containerInfo.sizeX = value;
                        break;
                    }
                case TagIds.ImageSizeY: //image height tag
                    {
                        var value = valueAsSubstream.readAsUint32();
                        if (value == 0)
                            throw 'Invalid height tag';
                        substrate.containerInfo.sizeY = value;
                        break;
                    }
                case TagIds.ImageOffset: //image offset tag
                    {
                        if (count != 1)
                            throw 'Invalid image offset tag';
                        substrate.containerInfo.imageOffset = valueAsSubstream.readAsUint32();
                        break;
                    }
                case TagIds.ImageByteCount: //image byte count tag
                    {
                        if (count != 1)
                            throw 'Invalid image byte count tag';
                        substrate.containerInfo.imageByteCount = valueAsSubstream.readAsUint32();
                        break;
                    }
                case TagIds.AlphaOffset: //alpha offset tag
                    {
                        if (count != 1)
                            throw 'Invalid alpha offset tag';
                        substrate.containerInfo.alphaOffset = valueAsSubstream.readAsUint32();
                        break;
                    }
                case TagIds.AlphaByteCount: // alpha byte count tag
                    {
                        if (count != 1)
                            throw 'Invalid alpha byte count tag';
                        substrate.containerInfo.alphaByteCount = valueAsSubstream.readAsUint32();
                        break;
                    }
                case TagIds.ResolutionX: // x resolution tag
                    {
                        if (count != 1)
                            throw 'Invalid x resolution tag';
                        substrate.containerInfo.resolutionX = valueAsSubstream.readAsFloat();
                        break;
                    }
                case TagIds.ResolutionY: // y resolution tag
                    {
                        if (count != 1)
                            throw 'Invalid y resolution tag';
                        substrate.containerInfo.resolutionY = valueAsSubstream.readAsFloat();
                        break;
                    }
                case TagIds.IccProfile: // ICC profile tag - same as TIFF
                    {
                        substrate.containerInfo.iccProfileOffset = valueAsSubstream.readAsUint32();
                        substrate.containerInfo.iccProfileByteCount = count;
                        break;
                    }
                case TagIds.XmpMetadata: // XMP metadata tag
                    {
                        substrate.containerInfo.xmpMetadataOffset = valueAsSubstream.readAsUint32();
                        substrate.containerInfo.xmpMetadataByteCount = count;
                        break;
                    }
                case TagIds.ExifMetadata: // EXIF metadata tag
                    {
                        var value = valueAsSubstream.readAsUint32();
                        substrate.containerInfo.exifMetadataOffset = value;
                        substrate.containerInfo.exifMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);
                        break;
                    }
                case TagIds.GpsInfoMetadata: // GPS info metadata tag
                    {
                        var value = valueAsSubstream.readAsUint32();
                        substrate.containerInfo.gpsInfoMetadataOffset = value;
                        substrate.containerInfo.gpsInfoMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);
                        break;
                    }
                case TagIds.IptcNaaMetadata: // IPTC-NAA metadata tag
                    {
                        break;
                    }
                case TagIds.PhotoshopMetadata: // Photoshop metadata tag
                    {
                        break;
                    }
                case TagIds.Compression: // compression tag
                case TagIds.ImageType: // image type tag
                case TagIds.ImageDataDiscarded: // (discarded) image data tag
                case TagIds.AlphaDataDiscarded: // (discarded) alpha data tag
                    break;

                //descriptive metadata
                case TagIds.ImageDescription: // image description tag
                    {
                        var str = new PropertyExporter(substrate.stream, type, count, valueAsSubstream).getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CameraManufacturer: // camera manufacturer tag
                    {
                        break;
                    }
                case TagIds.CameraModel: // camera model name tag
                    {
                        break;
                    }
                case TagIds.Software: // software tag
                    {
                        break;
                    }
                case TagIds.DateAndTime: // date and time tag
                    {
                        break;
                    }
                case TagIds.Artist: // artist tag
                    {
                        break;
                    }
                case TagIds.Copyright: // copyright tag
                    {
                        break;
                    }
                case TagIds.RatingStars: // rating stars tag
                    {
                        var value = valueAsSubstream.readAsUint16();
                        
                        break;
                    }
                case TagIds.RatingValue: // rating value tag
                    {
                        break;
                    }
                case TagIds.Caption: // caption tag
                    {
                        break;
                    }
                case TagIds.DocumentName: // document name tag
                    {
                        break;
                    }
                case TagIds.PageName: // page name tag
                    {
                        break;
                    }
                case TagIds.PageNumber: // page number tag
                    {
                        break;
                    }
                case TagIds.HostComputer: // host computer tag
                    {
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }

        //IFD = Image File Directory
        private getIfdSizeFromStream(stream: ArrayedStream, ifdOffset: number) {
            var childStream = stream.duplicateStream();
            childStream.seek(ifdOffset);
            //var ifdEntryAsStream = stream.duplicateStream().readAsSubstream(12);
            var ifdCount = childStream.readAsUint16();
            var exifIfdByteCount = 0;
            var gpsInfoIfdByteCount = 0;
            var interoperabilityIfdByteCount = 0;
            var ifdByteCount = 6 + ifdCount * 12;

            for (var i = 0; i < ifdCount; i++) {
                var tag = childStream.readAsUint16();
                var type = childStream.readAsUint16();
                var count = childStream.readAsUint32();
                var value = childStream.readAsUint32();
                var datasize: number;

                if (type == 0 || type >= 13)
                    throw "The image has unsupported IFD type";
                switch (tag) {
                    case TagIds.ExifMetadata: {
                        exifIfdByteCount = this.getIfdSizeFromStream(stream, value); break;
                    }
                    case TagIds.GpsInfoMetadata: {
                        gpsInfoIfdByteCount = this.getIfdSizeFromStream(stream, value); break;
                    }
                    case TagIds.InteroperabilityIfd: {
                        interoperabilityIfdByteCount = this.getIfdSizeFromStream(stream, value); break;
                    }
                    default:
                        {
                            switch (type) {
                                //case 0:
                                //    datasize = 0 * count; break;
                                case 1:
                                case 2:
                                case 6:
                                case 7:
                                    datasize = 1 * count; break;
                                case 3:
                                case 8:
                                    datasize = 2 * count; break;
                                case 4:
                                case 9:
                                case 11:
                                    datasize = 4 * count; break;
                                case 5:
                                case 10:
                                case 12:
                                    datasize = 8 * count; break;
                            }
                            if (datasize > 4)
                                ifdByteCount += datasize;
                            break;
                        }
                }
            }
            
            if (exifIfdByteCount != 0)
                ifdByteCount += (ifdByteCount & 1) + exifIfdByteCount;
            if (gpsInfoIfdByteCount != 0)
                ifdByteCount += (ifdByteCount & 1) + gpsInfoIfdByteCount;
            if (interoperabilityIfdByteCount != 0)
                ifdByteCount += (ifdByteCount & 1) + interoperabilityIfdByteCount;

            return ifdByteCount;
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
            var jxrase = new CatalyticDomain();
            jxrase.react(xhr.response);
        }
        xhr.send();
    }
}