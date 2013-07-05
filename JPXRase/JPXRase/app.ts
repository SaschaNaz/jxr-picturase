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
            if (stream.readAsUint8() != 0xBC)
                throw JxrInvalidMessage;

            //JXR version check - only 00 and 01 will be accepted
            {
                var versionNumber = stream.readAsUint8();
                if (versionNumber != 1)
                    throw "Current version of JXR Picturase doesn't support this version of JPEG XR.";
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
            for (var i = 0; i < pfdEntries; i++) {
                this.parseIfdEntry(
                    substrate,
                    stream.readAsUint16(),
                    stream.readAsUint16(),
                    stream.readAsUint32(),
                    stream.readAsSubstream(4));
            }

            //var nextIfdOffset = stream.readAsUint32();
            //This can be used to read multiple subfiles, but HTML img tag doesn't support it
        }

        //ported version of ParsePFDEntry
        private parseIfdEntry(substrate: SubstrateWithCoenzyme, tag: number, type: number, count: number, valueAsSubstream: ArrayedStream) {
            //value to offset, auto type check feature
            //아래 태그들을 propertyXbox 사용하게 통합
            var propertyXbox = new PropertyExporter(substrate.stream, type, count, valueAsSubstream);
            switch (tag) {
                case TagIds.PixelFormat: //pixel format tag
                    {
                        var pixelFormat
                            = PixelFormats.getPixelFormatByGuid(propertyXbox.getByteStreamFromStream().readAsHexString(16));

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
                        substrate.containerInfo.orientationState = ImageOrientationState.getOrientationState(propertyXbox.getAnyUintPropertyFromStream());
                        break;
                    }
                case TagIds.ImageSizeX: //image width tag
                    {
                        var value = propertyXbox.getAnyUintPropertyFromStream();
                        if (value == 0)
                            throw 'Invalid width tag';
                        substrate.containerInfo.sizeX = value;
                        break;
                    }
                case TagIds.ImageSizeY: //image height tag
                    {
                        var value = propertyXbox.getAnyUintPropertyFromStream();
                        if (value == 0)
                            throw 'Invalid height tag';
                        substrate.containerInfo.sizeY = value;
                        break;
                    }
                case TagIds.ImageOffset: //image offset tag
                    {
                        if ((substrate.containerInfo.imageOffset = propertyXbox.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with image offset.';
                        break;
                    }
                case TagIds.ImageByteCount: //image byte count tag
                    {
                        if ((substrate.containerInfo.imageByteCount = propertyXbox.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with image byte count.';
                        break;
                    }
                case TagIds.AlphaOffset: //alpha offset tag
                    {
                        if ((substrate.containerInfo.alphaOffset = propertyXbox.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with alpha offset.';
                        break;
                    }
                case TagIds.AlphaByteCount: // alpha byte count tag
                    {
                        if ((substrate.containerInfo.alphaByteCount = propertyXbox.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with alpha byte count.';
                        break;
                    }
                case TagIds.ResolutionX: // x resolution tag
                    {
                        if ((substrate.containerInfo.resolutionX = propertyXbox.getFloatPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with x resolution.';
                        break;
                    }
                case TagIds.ResolutionY: // y resolution tag
                    {
                        if ((substrate.containerInfo.resolutionY = propertyXbox.getFloatPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with y resolution.';
                        break;
                    }
                case TagIds.IccProfile: // ICC profile tag - same as TIFF
                    {
                        substrate.containerInfo.iccProfileByteStream = propertyXbox.getByteStreamFromStream();
                        break;
                    }
                case TagIds.XmpMetadata: // XMP metadata tag
                    {
                        substrate.containerInfo.xmpMetadataByteStream = propertyXbox.getByteStreamFromStream();
                        break;
                    }
                case TagIds.ExifMetadata: // EXIF metadata tag
                    {
                        //var value = valueAsSubstream.readAsUint32();
                        //substrate.containerInfo.exifMetadataOffset = value;
                        //substrate.containerInfo.exifMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);

                        substrate.containerInfo.exifMetadataByteStream = this.getIfdSubstreamFromStream(substrate.stream, propertyXbox.getAnyUintPropertyFromStream());
                        break;
                    }
                case TagIds.GpsInfoMetadata: // GPS info metadata tag
                    {
                        //var value = valueAsSubstream.readAsUint32();
                        //substrate.containerInfo.gpsInfoMetadataOffset = value;
                        //substrate.containerInfo.gpsInfoMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);

                        substrate.containerInfo.gpsInfoMetadataByteStream = this.getIfdSubstreamFromStream(substrate.stream, propertyXbox.getAnyUintPropertyFromStream());
                        break;
                    }
                //case TagIds.InteroperabilityIfd: //JPEG XR cannot be DCF basic file (that always uses normal JPEG format) or THM file.
                //    {
                //        this.getIfdSubstreamFromStream(substrate.stream, propertyXbox.getUintPropertyFromStream());
                //        break;
                //    }
                case TagIds.IptcNaaMetadata: // IPTC-NAA metadata tag
                    {
                        substrate.containerInfo.iptcNaaMetadataByteStream = propertyXbox.getByteStreamFromStream();
                        break;
                    }
                case TagIds.PhotoshopMetadata: // Photoshop metadata tag
                    {
                        substrate.containerInfo.photoshopMetadataByteStream = propertyXbox.getByteStreamFromStream();
                        break;
                    }
                case TagIds.Compression: // compression tag
                case TagIds.ImageType: // image type tag
                case TagIds.ImageDataDiscarded: // (discarded) image data tag
                case TagIds.AlphaDataDiscarded: // (discarded) alpha data tag
                    break;

                //descriptive metadata
                case TagIds.DocumentName: // document name tag
                    {
                        substrate.containerInfo.metadataDocumentName = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.ImageDescription: // image description tag
                    {
                        substrate.containerInfo.metadataDescription = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CameraManufacturer: // camera manufacturer tag
                    {
                        substrate.containerInfo.metadataCameraManufacturer = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CameraModel: // camera model name tag
                    {
                        substrate.containerInfo.metadataDescription = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.PageName: // page name tag
                    {
                        substrate.containerInfo.metadataPageName = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.PageNumber: // page number tag
                    {
                        substrate.containerInfo.metadataPageNumber = propertyXbox.getUint16ArrayFromStreamFixedLength(2);
                        break;
                    }
                case TagIds.Software: // software tag
                    {
                        substrate.containerInfo.metadataSoftware = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.DateAndTime: // date and time tag
                    {
                        substrate.containerInfo.metadataDateAndTime = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.ArtistName: // artist tag
                    {
                        substrate.containerInfo.metadataArtistName = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.HostComputer: // host computer tag
                    {
                        substrate.containerInfo.metadataHostComputer = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CopyrightNotice: // copyright tag
                    {
                        substrate.containerInfo.metadataCopyrightNotice = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.RatingStars: // rating stars tag
                    {
                        substrate.containerInfo.metadataRatingStars = propertyXbox.getUint16PropertyFromStream();
                        break;
                    }
                case TagIds.RatingValue: // rating value tag
                    {
                        substrate.containerInfo.metadataRatingValue = propertyXbox.getUint16PropertyFromStream();
                        break;
                    }
                case TagIds.Caption: // caption tag
                    {
                        substrate.containerInfo.metadataCaption = propertyXbox.getTextPropertyFromStream();
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }

        //IFD = Image File Directory. as EXIF 2.2 and TIFF 6.0 specification
        private getIfdSubstreamFromStream(stream: ArrayedStream, ifdOffset: number) {
            var childStream = stream.duplicateStream();
            childStream.seek(ifdOffset);
            //var ifdEntryAsStream = stream.duplicateStream().readAsSubstream(12);
            var ifdCount = childStream.readAsUint16();
            var ifdByteCount = 6 + ifdCount * 12;

            for (var i = 0; i < ifdCount; i++) {
                var tag = childStream.readAsUint16();
                var type = childStream.readAsUint16();
                var count = childStream.readAsUint32();
                var valueAsSubstream = childStream.readAsSubstream(4);
                var datasize: number;

                if (type == 0 || type >= 13)
                    throw "The image has unsupported IFD type";
                
                switch (type) {
                    //case 0://reserved, not specified
                    case DataTypeIds.Byte://byte
                    case DataTypeIds.TextUtf8://utf8text
                    case DataTypeIds.Int8://Signed byte
                    case DataTypeIds.Undefined://Undefined
                        datasize = 1 * count; break;
                    case DataTypeIds.Uint16://Uint16
                    case DataTypeIds.Int16://Int16
                        datasize = 2 * count; break;
                    case DataTypeIds.Uint32://UInt32
                    case DataTypeIds.Int32://Int32
                    case DataTypeIds.Float://Float
                        datasize = 4 * count; break;
                    case DataTypeIds.URationalNumber://URationalNumber
                    case DataTypeIds.RationalNumber://RationalNumber
                    case DataTypeIds.Double://Double
                        datasize = 8 * count; break;
                }
                if (datasize > 4)//real value would be in position right after the IFD
                    ifdByteCount += datasize;
            }

            childStream.seek(ifdOffset);
            return childStream.readAsSubstream(ifdByteCount);
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