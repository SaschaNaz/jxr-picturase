///<reference path="../pixelformats.ts"/>
///<reference path="../rationalnumber.ts"/>
///<reference path="../arrayedstream.ts"/>
///<reference path="datatypes.ts"/>
///<reference path="jxrproperties.ts"/>
///<reference path="formatids.ts"/>
module JxrPicturase.SubstrateComponents {
    export class IfdEntry {
        resolutionX: number;
        resolutionY: number;

        resolutionTiffX: RationalNumber;
        resolutionTiffY: RationalNumber;
        resolutionTiffUnit: ResolutionTiffUnit;

        hasAlpha: Boolean;

        orientationState: ImageOrientationState;//initally null

        sizeX: number;
        sizeY: number;
        get width() { return (this.orientationState != null && this.orientationState.RotatedClockwise) ? this.sizeY : this.sizeX; }
        get height() { return (this.orientationState != null && this.orientationState.RotatedClockwise) ? this.sizeX : this.sizeY; }
        colorFormat: ColorFormat;
        bitDepth: BitDepth;
        bitsPerUnit: number;
        leadingPadding: number;
        isRgb: Boolean;

        //user buffer is always padded to whole Macroblock
        //Anyway it is used for optimization for SSE command set, which is not possible with JavaScript.
        //paddedUserBuffer: Boolean;

        //misc
        imageOffset: number;
        imageByteCount: number;
        alphaOffset: number;
        alphaByteCount: number;

        iccProfileByteStream: ArrayedStream;

        xmpMetadataByteStream: ArrayedStream;

        exifMetadataByteStream: ArrayedStream;

        gpsInfoMetadataByteStream: ArrayedStream;

        iptcNaaMetadataByteStream: ArrayedStream;

        photoshopMetadataByteStream: ArrayedStream;

        //descriptive metadata
        metadataDocumentName: String;
        metadataDescription: String;
        metadataCameraManufacturer: String;
        metadataCameraModel: String;
        metadataPageName: String;
        metadataPageNumber: Uint16Array;
        metadataSoftware: String;
        metadataDateAndTime: String;
        metadataArtistName: String;
        metadataHostComputer: String;
        metadataCopyrightNotice: String;

        //non-EXIF descriptive metadata
        metadataRatingStars: number;
        metadataRatingPercent: number;

        metadataTitle: String;
        metadataComment: String;
        metadataAuthor: String;
        metadataKeywords: String;
        metadataSubject: String;

        static Parse(stream: ArrayedStream, entries: number) {
            var ifdEntry = new IfdEntry();
            for (var i = 0; i < entries; i++) {
                this.parseIfdEntry(
                    ifdEntry,
                    stream.readAsUint16(),
                    new PropertyReader(
                        stream,
                        stream.readAsUint16(),
                        stream.readAsUint32(),
                        stream.readAsSubstream(4)));
            }
            return ifdEntry;
        }

        //ported version of ParsePFDEntry
        private static parseIfdEntry(ifdEntry: IfdEntry, tag: number, propertyInStream: PropertyReader) {
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
        private static getIfdSubstreamFromStream(stream: ArrayedStream, ifdOffset: number) {
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
    }
}