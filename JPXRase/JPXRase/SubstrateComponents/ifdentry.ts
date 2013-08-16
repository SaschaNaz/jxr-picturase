///<reference path="pixelformats.ts"/>
///<reference path="../rationalnumber.ts"/>
///<reference path="../arrayedstream.ts"/>
///<reference path="datatypes.ts"/>
///<reference path="jxrproperties.ts"/>
///<reference path="ifdtag.ts"/>
module JxrPicturase.SubstrateComponents {
    export class IfdEntry {
        //JPEG XR descriptive metedata
        documentName: string;
        imageDescription: string;
        cameraManufacturer: string;
        cameraModel: string;
        pageName: string;
        pageNumber: Uint16Array;
        softwareInformation: string;
        dateAndTime: string;
        artistName: string;
        hostComputer: string;
        copyrightNotice: string;

        colorSpace: ColorSpace;
        pixelFormat: PixelFormat;
        transformation: TransformationState;
        imageType: ImageType;
        colorInformation: ColorInformation
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

        //metadataTitle: string;
        //metadataComment: string;
        //metadataAuthor: string;
        //metadataKeywords: string;
        //metadataSubject: string;

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
                        try {
                            ifdEntry.documentName = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("DOCUMENT_NAME", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ImageDescription:
                    {
                        try {
                            ifdEntry.imageDescription = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("IMAGE_DESCRIPTION", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.DeviceManufacturer:
                    {
                        try {
                            ifdEntry.cameraManufacturer = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("EQUIPMENT_MAKE", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.DeviceModel:
                    {
                        try {
                            ifdEntry.cameraModel = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("EQUIPMENT_MODEL", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.PageName:
                    {
                        try {
                            ifdEntry.pageName = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("PAGE_NAME", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.PageNumber:
                    {
                        try {
                            ifdEntry.pageNumber = propertyInStream.getUint16ArrayFromStreamFixedLength(2);
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("PAGE_NUMBER", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.Software:
                    {
                        try {
                            ifdEntry.softwareInformation = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("SOFTWARE_NAME_VERSION", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.DateAndTime:
                    {
                        try {
                            ifdEntry.dateAndTime = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("DATE_TIME", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ArtistName:
                    {
                        try {
                            ifdEntry.artistName = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("ARTIST_NAME", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.HostComputer:
                    {
                        try {
                            ifdEntry.hostComputer = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("HOST_COMPUTER", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.CopyrightNotice:
                    {
                        try {
                            ifdEntry.copyrightNotice = propertyInStream.getTextPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("COPYRIGHT_NOTICE", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ColorSpace:
                    {
                        try {
                            ifdEntry.colorSpace = propertyInStream.getUint16PropertyFromStream();
                            if (!ColorSpace[ifdEntry.colorSpace])
                                ifdEntry.colorSpace = ColorSpace.Other;
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("COLOR_SPACE", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.PixelFormat:
                    {
                        try {
                            ifdEntry.pixelFormat
                            = PixelFormats.getPixelFormatByGuid(propertyInStream.getByteStreamFromStream().readAsHexString(16));
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            throw new Error(JxrErrorMessage.getInvalidValueMessage("PIXEL_FORMAT", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.Transformation:
                    {
                        try {
                            ifdEntry.transformation = TransformationState.getTransformationState(propertyInStream.getAnyUintPropertyFromStream());
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("SPATIAL_XFRM_PRIMARY", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ImageType:
                    {
                        try {
                            var imagetype = (propertyInStream.getUint32PropertyFromStream() >> 30);
                            var isImagePreview = ((imagetype & 1) == 1);
                            var isOneOfMultipleImages = (((imagetype >> 1) & 1) == 1);
                            ifdEntry.imageType = new ImageType(isImagePreview, isOneOfMultipleImages);
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("IMAGE_TYPE", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ColorInformation:
                    {
                        try {
                            var colorInfoStream = propertyInStream.getByteStreamFromStreamFixedLength(4);
                            var colorPrimaries = ColorPrimaries.getColorPrimaries(colorInfoStream.readAsUint8());
                            var transferer = Transferer.getTransferer(colorInfoStream.readAsUint8());
                            var matrixCoeffecients = MatrixCoefficients.getMatrixCoefficients(colorInfoStream.readAsUint8());
                            var isFullRange = (colorInfoStream.readAsUint8() & 1) == 1;
                            ifdEntry.colorInformation = new ColorInformation(colorPrimaries, transferer, matrixCoeffecients, isFullRange);
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("PTM_COLOR_INFO", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ProfileLevelContainer: 
                    {
                        try {
                            
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("PROFILE_LEVEL_CONTAINER", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ImageSizeX:
                    {
                        try {
                            var value = propertyInStream.getAnyUintPropertyFromStream();
                            if (value == 0)
                                throw new Error('Width shall not be 0');
                            ifdEntry.imageSizeX = value;
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            throw new Error(JxrErrorMessage.getInvalidValueMessage("IMAGE_WIDTH", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ImageSizeY:
                    {
                        try {
                            var value = propertyInStream.getAnyUintPropertyFromStream();
                            if (value == 0)
                                throw new Error('Height shall not be 0');
                            ifdEntry.imageSizeY = value;
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            throw new Error(JxrErrorMessage.getInvalidValueMessage("IMAGE_HEIGHT", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ResolutionX:
                    {
                        try {
                            ifdEntry.resolutionX = propertyInStream.getFloatPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("WIDTH_RESOLUTION", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ResolutionY:
                    {
                        try {
                            ifdEntry.resolutionY = propertyInStream.getFloatPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("HEIGHT_RESOLUTION", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ImageOffset:
                    {
                        try {
                            ifdEntry.imageOffset = propertyInStream.getAnyUintPropertyFromStream();
                        }
                        catch(e) {
                            console.warn((<Error>e).message);
                            throw new Error(JxrErrorMessage.getInvalidValueMessage("IMAGE_OFFSET", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ImageByteCount:
                    {
                        try {
                            ifdEntry.imageByteCount = propertyInStream.getAnyUintPropertyFromStream();
                        }
                        
                        catch (e) {
                            console.warn((<Error>e).message);
                            throw new Error(JxrErrorMessage.getInvalidValueMessage("IMAGE_BYTE_COUNT", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.AlphaOffset:
                    {
                        try {
                            ifdEntry.alphaOffset = propertyInStream.getAnyUintPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("ALPHA_OFFSET", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.AlphaByteCount:
                    {
                        try {
                            ifdEntry.alphaByteCount = propertyInStream.getAnyUintPropertyFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("ALPHA_BYTE_COUNT", "IFD_ENTRY"));
                        }
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
                        try {
                            ifdEntry.iccProfileByteStream = propertyInStream.getByteStreamFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("ICC color profile", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.XmpMetadata:
                    {
                        try {
                            ifdEntry.xmpMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("XMP metadata", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.ExifMetadata:
                    {
                        try {
                            ifdEntry.exifMetadataByteStream = this.getIfdSubstreamFromStream(propertyInStream.basestream, propertyInStream.getAnyUintPropertyFromStream());
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("EXIF metadata", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.GpsInfoMetadata:
                    {
                        try {
                            ifdEntry.gpsInfoMetadataByteStream = this.getIfdSubstreamFromStream(propertyInStream.basestream, propertyInStream.getAnyUintPropertyFromStream());
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("GPS information metadata", "IFD_ENTRY"));
                        }
                        break;
                    }
                //case TagIds.InteroperabilityIfd: //JPEG XR cannot be DCF basic file (that always uses normal JPEG format) or THM file.
                //    {
                //        this.getIfdSubstreamFromStream(substrate.stream, propertyXbox.getUintPropertyFromStream());
                //        break;
                //    }
                case IfdTag.IptcNaaMetadata:
                    {
                        try {
                            ifdEntry.iptcNaaMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("IPTC-NAA metadata", "IFD_ENTRY"));
                        }
                        break;
                    }
                case IfdTag.PhotoshopMetadata:
                    {
                        try {
                            ifdEntry.photoshopMetadataByteStream = propertyInStream.getByteStreamFromStream();
                        }
                        catch (e) {
                            console.warn((<Error>e).message);
                            console.warn(JxrErrorMessage.getInvalidValueMessage("Adobe Photoshop metadata", "IFD_ENTRY"));
                        }
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
                    throw new Error("Unsupported IFD type is detected");

                var datasize = PropertyReader.getPropertyDataSize(type, count);
                if (datasize > 4)//real value would be in position right after the IFD
                    ifdByteCount += datasize;
            }

            childStream.seek(ifdOffset);
            return childStream.readAsSubstream(ifdByteCount);
        }
    }
}