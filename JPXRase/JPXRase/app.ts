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

            this.parseImageHeader(stream.cleaveStream(ifdEntry.imageOffset, ifdEntry.imageByteCount));
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

        private parseImageHeader(imageSubstream: ArrayedStream) {
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

            var hasMultipleTiles = (bitstream.readBits(1) == 1);
            var isFrequencyMode = (bitstream.readBits(1) == 1);
            var spatialTransformation
                = new ImageOrientationState(
                    (bitstream.readBits(1) == 1),
                    (bitstream.readBits(1) == 1),
                    (bitstream.readBits(1) == 1));
            var hasIndexTable = (bitstream.readBits(1) == 1);

            var overlapMode = bitstream.readBits(2);
            if (overlapMode == 3)
                throw 'Image cannot be digested with this version of JXR Picturase as the image uses unsupported overlap mode.';

            var hasShortHeader = (bitstream.readBits(1) == 1);
            var useLongValues = (bitstream.readBits(1) == 1);
            var useWindowing = (bitstream.readBits(1) == 1);
            var hasTrimFlexbits = (bitstream.readBits(1) == 1);

            //codec version check 3
            if (bitstream.readBits(1) != 0)
                console.log('Image may not be fully digested with this version of JXR Picturase. Reserved D');

            var isNotBgr = (bitstream.readBits(1) == 1);
            var isAlphaPremultiplied = (bitstream.readBits(1) == 1);
            var hasALphaImagePlane = (bitstream.readBits(1) == 1);
            var outputColorFormat: ColorFormat = bitstream.readBits(4);
            var outputBitDepth: BitDepth = bitstream.readBits(4);
            var width: number;
            var height: number;
            if (hasShortHeader) {
                width = bitstream.readBits(16) + 1;
                height = bitstream.readBits(16) + 1;
            }
            else {
                width = bitstream.readBits(32) + 1;
                height = bitstream.readBits(32) + 1;
            }
            if (width % 2 != 0 && (outputColorFormat == ColorFormat.Yuv420 || outputColorFormat == ColorFormat.Yuv422))
                throw 'invalid image width';
            if (height % 2 != 0 && outputColorFormat == ColorFormat.Yuv420)
                throw 'invalid image height';

            var numberOfVerticalTiles = 0;
            var numberOfHorizontalTiles = 0;
            if (hasMultipleTiles) {
                numberOfVerticalTiles = bitstream.readBits(12);
                numberOfHorizontalTiles = bitstream.readBits(12);
            }
            if (!hasIndexTable && (isFrequencyMode || numberOfVerticalTiles > 1 || numberOfHorizontalTiles > 1))
                throw 'Image doesn\'t have index table while it should do. JXR Picturase cannot digest it.';

            var leftBoundariesofTiles: number[] = [0];//
            var topBoundariesofTiles: number[] = [0];
            for (var i = 1; i < numberOfVerticalTiles; i++)
                leftBoundariesofTiles.push(
                    bitstream.readBits(hasShortHeader ? 8 : 16)
                    + leftBoundariesofTiles[i - 1]);
            //leftBoundariesofTiles.push(width in macroblock unit);
            for (var i = 1; i < numberOfHorizontalTiles; i++)
                topBoundariesofTiles.push(
                    bitstream.readBits(hasShortHeader ? 8 : 16)
                    + topBoundariesofTiles[i - 1]);
            //topBoundariesofTiles.push(height in macroblock unit);

            //var macroblocksInEachTile: number[] = [];
            //{
            //    var n = 0;
            //    for (var i = 0; i < numberOfHorizontalTiles; i++) {
            //        for (var i2 = 0; i2 < numberOfVerticalTiles; i2++) {
            //            macroblocksInEachTile[i + i2] = 
            //        }   
            //    }
            //}
            //cannot count it completely because we don't know tiles' total width and height

            var topMargin = 0;
            var leftMargin = 0;
            var bottomMargin = 0;
            var rightMargin = 0;
            if (useWindowing) {
                topMargin = bitstream.readBits(6);
                leftMargin = bitstream.readBits(6);
                bottomMargin = bitstream.readBits(6);
                rightMargin = bitstream.readBits(6);
            }
            if (topMargin % 2 != 0 && outputColorFormat == ColorFormat.Yuv420)
                throw 'image top margin is invalid';
            if (leftMargin % 2 != 0 && (outputColorFormat == ColorFormat.Yuv420 || outputColorFormat == ColorFormat.Yuv422))
                throw 'image left margin is invalid';
            if (height % 16 == 0) {
                if (bottomMargin != 0)
                    throw 'image bottom margin is invalid';
            }
            else
                if (bottomMargin != 16 - (height % 16))
                    throw 'image bottom margin is invalid';
            if (bottomMargin % 2 != 0 && outputColorFormat == ColorFormat.Yuv420)
                throw 'image bottom margin is invalid';
            if (width % 16 == 0) {
                if (rightMargin != 0)
                    throw 'image right margin is invalid';
            }
            else
                if (rightMargin != 16 - (width % 16))
                    throw 'image right margin is invalid';
            if (rightMargin % 2 != 0 && (outputColorFormat == ColorFormat.Yuv420 || outputColorFormat == ColorFormat.Yuv422))
                throw 'image right margin is invalid';

            if ((width + leftMargin + rightMargin) % 16 != 0)
                throw 'invalid width and horizontal margins';
            if ((height + topMargin + bottomMargin) % 16 != 0)
                throw 'invalid height and vertical margins';


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