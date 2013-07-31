///<reference path="pixelformats.ts"/>
///<reference path="../rationalnumber.ts"/>
///<reference path="../arrayedstream.ts"/>
///<reference path="datatypes.ts"/>
///<reference path="jxrproperties.ts"/>
///<reference path="formatids.ts"/>
module JxrPicturase.SubstrateComponents {
    export class IfdEntry {
        //JPEG XR descriptive metedata
        documentName: String;
        imageDescription: String;
        cameraManufacturer: String;
        cameraModel: String;
        pageName: String;
        pageNumber: Uint16Array;
        softwareInformation: String;
        dateAndTime: String;
        artistName: String;
        hostComputer: String;
        copyrightNotice: String;

        colorSpace: ColorSpace;
        pixelFormat: PixelFormat;
        transformation: TransformationState;
        //imageType: ?
        //ptmColorInformation: ?
        //profileLevelContainer: ?

        imageSizeX: number;
        imageSizeY: number;
        resolutionX: number;
        resolutionY: number;

        imageOffset: number;
        imageByteCount: number;
        alphaOffset: number;
        alphaByteCount: number;
        //imageBandPresence: ?
        //alphaBandPresence: ?
        //paddingData: ?

        //resolutionTiffX: RationalNumber;
        //resolutionTiffY: RationalNumber;
        //resolutionTiffUnit: ResolutionTiffUnit;

        //orientationState: ImageOrientationState;//initally null

        //colorFormat: ColorFormat;
        //bitDepth: BitDepth;
        //leadingPadding: number;

        iccProfileByteStream: ArrayedStream;
        xmpMetadataByteStream: ArrayedStream;
        exifMetadataByteStream: ArrayedStream;
        gpsInfoMetadataByteStream: ArrayedStream;
        iptcNaaMetadataByteStream: ArrayedStream;
        photoshopMetadataByteStream: ArrayedStream;

        //Windows descriptive metadata
        //metadataRatingStars: number;
        //metadataRatingPercent: number;

        //metadataTitle: String;
        //metadataComment: String;
        //metadataAuthor: String;
        //metadataKeywords: String;
        //metadataSubject: String;

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
                //descriptive metadata
                case IfdTag.DocumentName:
                    {
                        ifdEntry.documentName = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.ImageDescription:
                    {
                        ifdEntry.imageDescription = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.CameraManufacturer:
                    {
                        ifdEntry.cameraManufacturer = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.CameraModel:
                    {
                        ifdEntry.cameraModel = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.PageName:
                    {
                        ifdEntry.pageName = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.PageNumber:
                    {
                        ifdEntry.pageNumber = propertyInStream.getUint16ArrayFromStreamFixedLength(2);
                        break;
                    }
                case IfdTag.Software:
                    {
                        ifdEntry.softwareInformation = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.DateAndTime:
                    {
                        ifdEntry.dateAndTime = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.ArtistName:
                    {
                        ifdEntry.artistName = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.HostComputer:
                    {
                        ifdEntry.hostComputer = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.CopyrightNotice:
                    {
                        ifdEntry.copyrightNotice = propertyInStream.getTextPropertyFromStream();
                        break;
                    }
                case IfdTag.ColorSpace:
                    {
                        ifdEntry.colorSpace = propertyInStream.getUint16PropertyFromStream();
                        if (!ColorSpace[ifdEntry.colorSpace])
                            ifdEntry.colorSpace = ColorSpace.Other;
                        break;
                    }
                case IfdTag.PixelFormat:
                    {
                        ifdEntry.pixelFormat
                            = PixelFormats.getPixelFormatByGuid(propertyInStream.getByteStreamFromStream().readAsHexString(16));
                        break;
                    }
                case IfdTag.Transformation:
                    {
                        ifdEntry.transformation = TransformationState.getTransformationState(propertyInStream.getAnyUintPropertyFromStream());
                        break;
                    }
                case IfdTag.ImageType:
                    {
                        var imagetype = (propertyInStream.getUint32PropertyFromStream() >> 30);
                        var isImagePreview = ((imagetype & 1) == 1);
                        var isOneOfMultipleImages = (((imagetype >> 1) & 1) == 1);
                        break;
                    }
                case IfdTag.ColorInformation:
                    {
                        var colorInfoStream = (propertyInStream.getByteStreamFromStreamFixedLength(4));
                        //IFD용 에러 마련.
                        //각 하부 데이터 에러 메시지 따로 출력
                        var colorPrimaries = ColorPrimaries.getColorPrimaries(colorInfoStream.readAsUint8());
                        var transferCharacteristics = colorInfoStream.readAsUint8();
                        var matrixCoeffecients = colorInfoStream.readAsUint8();
                        var isFullRange = (colorInfoStream.readAsUint8() & 1) == 1;
                        break;
                    }
                case IfdTag.ProfileLevelContainer: 
                    {
                        break;
                    }
                case IfdTag.ImageSizeX:
                    {
                        var value = propertyInStream.getAnyUintPropertyFromStream();
                        if (value == 0)
                            throw new Error('Invalid width tag');
                        ifdEntry.imageSizeX = value;
                        break;
                    }
                case IfdTag.ImageSizeY:
                    {
                        var value = propertyInStream.getAnyUintPropertyFromStream();
                        if (value == 0)
                            throw new Error('Invalid height tag');
                        ifdEntry.imageSizeY = value;
                        break;
                    }
                case IfdTag.ResolutionX:
                    {
                        if ((ifdEntry.resolutionX = propertyInStream.getFloatPropertyFromStream()) === undefined)
                            throw new Error('cannot parse this image because of the critical format error with x resolution.');
                        break;
                    }
                case IfdTag.ResolutionY:
                    {
                        if ((ifdEntry.resolutionY = propertyInStream.getFloatPropertyFromStream()) === undefined)
                            throw new Error('cannot parse this image because of the critical format error with y resolution.');
                        break;
                    }
                case IfdTag.ImageOffset:
                    {
                        if ((ifdEntry.imageOffset = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw new Error('cannot parse this image because of the critical format error with image offset.');
                        break;
                    }
                case IfdTag.ImageByteCount:
                    {
                        if ((ifdEntry.imageByteCount = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw new Error('cannot parse this image because of the critical format error with image byte count.');
                        break;
                    }
                case IfdTag.AlphaOffset:
                    {
                        if ((ifdEntry.alphaOffset = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw new Error('cannot parse this image because of the critical format error with alpha offset.');
                        break;
                    }
                case IfdTag.AlphaByteCount:
                    {
                        if ((ifdEntry.alphaByteCount = propertyInStream.getAnyUintPropertyFromStream()) === undefined)
                            throw new Error('cannot parse this image because of the critical format error with alpha byte count.');
                        break;
                    }
                case IfdTag.ImageBandPresence:
                    {
                        break;
                    }
                case IfdTag.AlphaBandPresence:
                    {
                        break;
                    }
                case IfdTag.PaddingData:
                    {
                        break;
                    }

                case IfdTag.IccProfile:
                    {
                        ifdEntry.iccProfileByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case IfdTag.XmpMetadata:
                    {
                        ifdEntry.xmpMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case IfdTag.ExifMetadata:
                    {
                        //var value = valueAsSubstream.readAsUint32();
                        //ifdEntry.exifMetadataOffset = value;
                        //ifdEntry.exifMetadataByteCount = this.getIfdSizeFromStream(substrate.stream, value);

                        ifdEntry.exifMetadataByteStream = this.getIfdSubstreamFromStream(propertyInStream.basestream, propertyInStream.getAnyUintPropertyFromStream());
                        break;
                    }
                case IfdTag.GpsInfoMetadata:
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
                case IfdTag.IptcNaaMetadata:
                    {
                        ifdEntry.iptcNaaMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }
                case IfdTag.PhotoshopMetadata:
                    {
                        ifdEntry.photoshopMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        break;
                    }

                //case TagIds.RatingStars:
                //    {
                //        ifdEntry.metadataRatingStars = propertyInStream.getUint16PropertyFromStream();
                //        break;
                //    }
                //case TagIds.RatingValue:
                //    {
                //        ifdEntry.metadataRatingPercent = propertyInStream.getUint16PropertyFromStream();
                //        break;
                //    }
                //case TagIds.Title:
                //    {
                //        ifdEntry.metadataTitle = propertyInStream.getTextPropertyFromStream();
                //        break;
                //    }
                //case TagIds.Comment:
                //    {
                //        ifdEntry.metadataComment = propertyInStream.getTextPropertyFromStream();
                //        break;
                //    }
                //case TagIds.Author:
                //    {
                //        ifdEntry.metadataAuthor = propertyInStream.getTextPropertyFromStream();
                //        break;
                //    }
                //case TagIds.Keywords:
                //    {
                //        ifdEntry.metadataKeywords = propertyInStream.getTextPropertyFromStream();
                //        break;
                //    }
                //case TagIds.Subject:
                //    {
                //        ifdEntry.metadataSubject = propertyInStream.getTextPropertyFromStream();
                //        break;
                //    }
                //case TagIds.ResolutionTiffX:
                //    {
                //        ifdEntry.resolutionTiffX = propertyInStream.getURationalPropertyFromStream();
                //        break;
                //    }
                //case TagIds.ResolutionTiffY:
                //    {
                //        ifdEntry.resolutionTiffY = propertyInStream.getURationalPropertyFromStream();
                //        break;
                //    }
                //case TagIds.ResolutionTiffUnit:
                //    {
                //        switch (propertyInStream.getUint16PropertyFromStream()) {
                //            case 2:
                //                {
                //                    ifdEntry.resolutionTiffUnit = ResolutionTiffUnit.Inches;
                //                    break;
                //                }
                //            case 3:
                //                {
                //                    ifdEntry.resolutionTiffUnit = ResolutionTiffUnit.Centimeters;
                //                    break;
                //                }
                //        }
                //        break;
                //    }
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
                    throw new Error("The image has unsupported IFD type");

                var datasize = PropertyReader.getPropertyDataSize(type, count);
                if (datasize > 4)//real value would be in position right after the IFD
                    ifdByteCount += datasize;
            }

            childStream.seek(ifdOffset);
            return childStream.readAsSubstream(ifdByteCount);
        }
    }
}