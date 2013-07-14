///<reference path="arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="containerinfo.ts"/>
///<reference path="formatids.ts"/>
///<reference path="jxrproperties.ts"/>
module JxrPicturase {
    class SubstrateWithCoenzyme {
        stream: ArrayedStream;
        IfdEntries: IfdEntry[] = [];

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

            //JXR version check - only 01 will be accepted, as JPEG XR T.832 01/2012
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
            var ifdEntry = new IfdEntry();
            for (var i = 0; i < pfdEntries; i++) {
                this.parseIfdEntry(
                    ifdEntry,
                    stream.readAsUint16(),
                    new PropertyReader(
                        stream,
                        stream.readAsUint16(),
                        stream.readAsUint32(),
                        stream.readAsSubstream(4)));
            }
            substrate.IfdEntries.push(ifdEntry);

            var imageStream = stream.cleaveStream(ifdEntry.imageOffset, ifdEntry.imageByteCount);
            var imageHeader = this.readImageHeader(imageStream);
            //now imageStream position is changed by byte, not bit, as bits left should be ignored
            var imagePlaneHeader = this.readImagePlaneHeader(imageStream, imageHeader);
            //var nextIfdOffset = stream.readAsUint32();
            //This can be used to read multiple subfiles, but HTML img tag doesn't support it, but anyway...
        }

        //ported version of ParsePFDEntry
        private parseIfdEntry(ifdEntry: IfdEntry, tag: number, propertyInStream: PropertyReader) {
            switch (tag) {
                case TagIds.PixelFormat: //pixel format tag
                    {
                        var pixelFormat
                            = PixelFormats.getPixelFormatByGuid(propertyInStream.getByteStreamFromStream().readAsHexString(16));

                        var containerInfo = ifdEntry;
                        containerInfo.hasAlpha = pixelFormat.hasAlpha;
                        containerInfo.bitsPerUnit = pixelFormat.bitsPerUnit;
                        containerInfo.isRgb = !pixelFormat.isBgr;
                        break;
                    }
                case TagIds.Transformation: //transformation tag
                    {
                        ifdEntry.orientationState = ImageOrientationState.getOrientationState(propertyInStream.getAnyUintPropertyFromStream());
                        break;
                    }
                case TagIds.ImageSizeX: //image width tag
                    {
                        var value = propertyInStream.getAnyUintPropertyFromStream();
                        if (value == 0)
                            throw 'Invalid width tag';
                        ifdEntry.sizeX = value;
                        break;
                    }
                case TagIds.ImageSizeY: //image height tag
                    {
                        var value = propertyInStream.getAnyUintPropertyFromStream();
                        if (value == 0)
                            throw 'Invalid height tag';
                        ifdEntry.sizeY = value;
                        break;
                    }
                case TagIds.ImageOffset: //image offset tag
                    {
                        if ((ifdEntry.imageOffset = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with image offset.';
                        break;
                    }
                case TagIds.ImageByteCount: //image byte count tag
                    {
                        if ((ifdEntry.imageByteCount = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with image byte count.';
                        break;
                    }
                case TagIds.AlphaOffset: //alpha offset tag
                    {
                        if ((ifdEntry.alphaOffset = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with alpha offset.';
                        break;
                    }
                case TagIds.AlphaByteCount: // alpha byte count tag
                    {
                        if ((ifdEntry.alphaByteCount = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with alpha byte count.';
                        break;
                    }
                case TagIds.ResolutionX: // x resolution tag
                    {
                        if ((ifdEntry.resolutionX = propertyInStream.getFloatPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with x resolution.';
                        break;
                    }
                case TagIds.ResolutionY: // y resolution tag
                    {
                        if ((ifdEntry.resolutionY = propertyInStream.getFloatPropertyFromStream()) === undefined)
                            throw 'cannot parse this image because of the critical format error with y resolution.';
                        break;
                    }
                case TagIds.IccProfile: // ICC profile tag - same as TIFF
                    {
                        ifdEntry.iccProfileByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case TagIds.XmpMetadata: // XMP metadata tag
                    {
                        ifdEntry.xmpMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case TagIds.ExifMetadata: // EXIF metadata tag
                    {
                        //var value = valueAsSubstream.readAsUint32();
                        //ifdEntry.exifMetadataOffset = value;
                        //ifdEntry.exifMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);

                        ifdEntry.exifMetadataByteStream = this.getIfdSubstreamFromStream(propertyInStream.basestream, propertyInStream.getAnyUintPropertyFromStream());
                        break;
                    }
                case TagIds.GpsInfoMetadata: // GPS info metadata tag
                    {
                        //var value = valueAsSubstream.readAsUint32();
                        //ifdEntry.gpsInfoMetadataOffset = value;
                        //ifdEntry.gpsInfoMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);

                        ifdEntry.gpsInfoMetadataByteStream = this.getIfdSubstreamFromStream(propertyInStream.basestream, propertyInStream.getAnyUintPropertyFromStream());
                        break;
                    }
                //case TagIds.InteroperabilityIfd: //JPEG XR cannot be DCF basic file (that always uses normal JPEG format) or THM file.
                //    {
                //        this.getIfdSubstreamFromStream(substrate.stream, propertyXbox.getUintPropertyFromStream());
                //        break;
                //    }
                case TagIds.IptcNaaMetadata: // IPTC-NAA metadata tag
                    {
                        ifdEntry.iptcNaaMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case TagIds.PhotoshopMetadata: // Photoshop metadata tag
                    {
                        ifdEntry.photoshopMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case TagIds.Compression: // compression tag
                case TagIds.ImageDataDiscarded: // (discarded) image data tag
                case TagIds.AlphaDataDiscarded: // (discarded) alpha data tag
                case TagIds.PaddingData:
                    break;

                case TagIds.ImageType: // image type tag
                    {
                        var imagetype = (propertyInStream.getUint32PropertyFromStream() >> 30);
                        var isImagePreview = ((imagetype & 1) == 1);
                        var isOneOfMultipleImages = (((imagetype >> 1) & 1) == 1);
                        break;
                    }

                //descriptive metadata
                case TagIds.DocumentName: // document name tag
                    {
                        ifdEntry.metadataDocumentName = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.ImageDescription: // image description tag
                    {
                        ifdEntry.metadataDescription = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CameraManufacturer: // camera manufacturer tag
                    {
                        ifdEntry.metadataCameraManufacturer = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CameraModel: // camera model name tag
                    {
                        ifdEntry.metadataDescription = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.PageName: // page name tag
                    {
                        ifdEntry.metadataPageName = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.PageNumber: // page number tag
                    {
                        ifdEntry.metadataPageNumber = propertyInStream.getUint16ArrayFromStreamFixedLength(2);
                        break;
                    }
                case TagIds.Software: // software tag
                    {
                        ifdEntry.metadataSoftware = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.DateAndTime: // date and time tag
                    {
                        ifdEntry.metadataDateAndTime = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.ArtistName: // artist tag
                    {
                        ifdEntry.metadataArtistName = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.HostComputer: // host computer tag
                    {
                        ifdEntry.metadataHostComputer = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.CopyrightNotice: // copyright tag
                    {
                        ifdEntry.metadataCopyrightNotice = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.RatingStars: // rating stars tag
                    {
                        ifdEntry.metadataRatingStars = propertyInStream.getUint16PropertyFromStream();
                        break;
                    }
                case TagIds.RatingValue: // rating value tag
                    {
                        ifdEntry.metadataRatingPercent = propertyInStream.getUint16PropertyFromStream();
                        break;
                    }
                case TagIds.Title:
                    {
                        ifdEntry.metadataTitle = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.Comment:
                    {
                        ifdEntry.metadataComment = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.Author:
                    {
                        ifdEntry.metadataAuthor = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.Keywords:
                    {
                        ifdEntry.metadataKeywords = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.Subject:
                    {
                        ifdEntry.metadataSubject = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case TagIds.ResolutionTiffX:
                    {
                        ifdEntry.resolutionTiffX = propertyInStream.getURationalPropertyFromStream();
                        break;
                    }
                case TagIds.ResolutionTiffY:
                    {
                        ifdEntry.resolutionTiffY = propertyInStream.getURationalPropertyFromStream();
                        break;
                    }
                case TagIds.ResolutionTiffUnit:
                    {
                        switch (propertyInStream.getUint16PropertyFromStream()) {
                            case 2:
                                {
                                    ifdEntry.resolutionTiffUnit = ResolutionTiffUnit.Inches;
                                    break;
                                }
                            case 3:
                                {
                                    ifdEntry.resolutionTiffUnit = ResolutionTiffUnit.Centimeters;
                                    break;
                                }
                        }
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
                
                var datasize = PropertyReader.getPropertyDataSize(type, count);
                if (datasize > 4)//real value would be in position right after the IFD
                    ifdByteCount += datasize;
            }

            childStream.seek(ifdOffset);
            return childStream.readAsSubstream(ifdByteCount);
        }

        private readImageHeader(imageSubstream: ArrayedStream) {
            var imageHeader = new ImageHeader();

            //signature
            if (imageSubstream.readAsUtf8Text(8) !== 'WMPHOTO\u0000')
                throw 'Contained image is not valid JPEG XR image';

            var bitstream = new ArrayedBitStream(imageSubstream);

            //codec version check
            if (bitstream.readBits(4) != 1)
                throw 'Image cannot be digested with this version of JXR Picturase as the version of image is unsupported.';

            imageHeader.isHardTileUsed = (bitstream.readBits(1) == 1);

            //codec version check 2
            if (bitstream.readBits(3) != 1)
                console.log('Image may not be fully digested with this version of JXR Picturase. Reserved C');

            imageHeader.hasMultipleTiles = (bitstream.readBits(1) == 1);
            imageHeader.isFrequencyMode = (bitstream.readBits(1) == 1);
            imageHeader.spatialTransformation
                = new ImageOrientationState(
                    (bitstream.readBits(1) == 1),
                    (bitstream.readBits(1) == 1),
                    (bitstream.readBits(1) == 1));
            imageHeader.hasIndexTable = (bitstream.readBits(1) == 1);

            imageHeader.overlapMode = bitstream.readBits(2);
            if (imageHeader.overlapMode == 3)
                throw 'Image cannot be digested with this version of JXR Picturase as the image uses unsupported overlap mode.';

            var hasShortHeader = (bitstream.readBits(1) == 1);
            imageHeader.useLongValues = (bitstream.readBits(1) == 1);
            var useWindowing = (bitstream.readBits(1) == 1);
            imageHeader.hasTrimFlexbits = (bitstream.readBits(1) == 1);

            //codec version check 3
            if (bitstream.readBits(1) != 0)
                console.log('Image may not be fully digested with this version of JXR Picturase. Reserved D');

            imageHeader.isNotBgr = (bitstream.readBits(1) == 1);
            imageHeader.isAlphaPremultiplied = (bitstream.readBits(1) == 1);
            imageHeader.hasAlphaImagePlane = (bitstream.readBits(1) == 1);
            imageHeader.outputColorFormat = bitstream.readBits(4);
            imageHeader.outputBitDepth = bitstream.readBits(4);
            if (hasShortHeader) {
                imageHeader.width = bitstream.readBits(16) + 1;
                imageHeader.height = bitstream.readBits(16) + 1;
            }
            else {
                imageHeader.width = bitstream.readBits(32) + 1;
                imageHeader.height = bitstream.readBits(32) + 1;
            }
            if (imageHeader.width % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw 'invalid image width';
            if (imageHeader.height % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw 'invalid image height';

            if (imageHeader.hasMultipleTiles) {
                imageHeader.numberOfVerticalTiles = bitstream.readBits(12) + 1;
                imageHeader.numberOfHorizontalTiles = bitstream.readBits(12) + 1;
            }
            if (!imageHeader.hasIndexTable && (imageHeader.isFrequencyMode || imageHeader.numberOfVerticalTiles > 1 || imageHeader.numberOfHorizontalTiles > 1))
                throw 'Image doesn\'t have index table while it should do. JXR Picturase cannot digest it.';

            for (var i = 1; i < imageHeader.numberOfVerticalTiles; i++)
                imageHeader.tileBoundariesLeft.push(
                    bitstream.readBits(hasShortHeader ? 8 : 16)
                    + imageHeader.tileBoundariesLeft[i - 1]);
            for (var i = 1; i < imageHeader.numberOfHorizontalTiles; i++)
                imageHeader.tileBoundariesTop.push(
                    bitstream.readBits(hasShortHeader ? 8 : 16)
                    + imageHeader.tileBoundariesTop[i - 1]);

            if (useWindowing) {
                imageHeader.marginTop = bitstream.readBits(6);
                imageHeader.marginLeft = bitstream.readBits(6);
                imageHeader.marginBottom = bitstream.readBits(6);
                imageHeader.marginRight = bitstream.readBits(6);
            }
            if (imageHeader.marginTop % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw 'image top margin is invalid';
            if (imageHeader.marginLeft % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw 'image left margin is invalid';
            if (imageHeader.height % 16 == 0) {
                if (imageHeader.marginBottom != 0)
                    throw 'image bottom margin is invalid';
            }
            else
                if (imageHeader.marginBottom != 16 - (imageHeader.height % 16))
                    throw 'image bottom margin is invalid';
            if (imageHeader.marginBottom % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw 'image bottom margin is invalid';
            if (imageHeader.width % 16 == 0) {
                if (imageHeader.marginRight != 0)
                    throw 'image right margin is invalid';
            }
            else
                if (imageHeader.marginRight != 16 - (imageHeader.width % 16))
                    throw 'image right margin is invalid';
            if (imageHeader.marginRight % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw 'image right margin is invalid';

            var extendedWidth = imageHeader.width + imageHeader.marginLeft + imageHeader.marginRight;
            var extendedHeight = imageHeader.height + imageHeader.marginTop + imageHeader.marginBottom;
            if (extendedWidth % 16 != 0)
                throw 'invalid width and horizontal margins';
            if (extendedHeight % 16 != 0)
                throw 'invalid height and vertical margins';
            imageHeader.tileBoundariesLeft.push(extendedWidth / 16);
            imageHeader.tileBoundariesTop.push(extendedHeight / 16);
            
            for (var i = 0; i < imageHeader.numberOfHorizontalTiles; i++) {
                var tilesHorizontal = (imageHeader.tileBoundariesLeft[i + 1] - imageHeader.tileBoundariesLeft[i]);
                for (var i2 = 0; i2 < imageHeader.numberOfVerticalTiles; i2++) {
                    imageHeader.macroblocksInEachTile.push(
                        tilesHorizontal * (imageHeader.tileBoundariesTop[i + 1] - imageHeader.tileBoundariesTop[i]));//tilesVertical
                }
            }

            return imageHeader;
        }

        private readImagePlaneHeader(imageSubstream: ArrayedStream, imageHeader: ImageHeader) {
            var bitstream = new ArrayedBitStream(imageSubstream);

            var internalColorFormat: InternalColorFormat = bitstream.readBits(3);
            var willBeScaled = (bitstream.readBits(1) == 1);

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
                jxrase.react(xhr.response);
            }
            else
                console.log('Image URL is invalid.');
        }
        xhr.send();
    }
}