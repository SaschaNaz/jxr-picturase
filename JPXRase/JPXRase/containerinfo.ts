///<reference path="pixelformats.ts"/>
///<reference path="rationalnumber.ts"/>
///<reference path="arrayedstream.ts"/>
module JxrPicturase {
    //this is not a requested decoding info, but the info about image from container
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
    }

    export class ImageOrientationState {
        constructor(
            public RotatedClockwise: Boolean,
            public FlippedHorizontally: Boolean,
            public FlippedVertically: Boolean) {
        }
        
        static getOrientationState(state: number) {
            switch (state) {
                case 0: return new ImageOrientationState(false, false, false);
                case 1: return new ImageOrientationState(false, false, true);
                case 2: return new ImageOrientationState(false, true, false);
                case 3: return new ImageOrientationState(false, true, true);
                case 4: return new ImageOrientationState(true, false, false);
                case 5: return new ImageOrientationState(true, false, true);
                case 6: return new ImageOrientationState(true, true, false);
                case 7: return new ImageOrientationState(true, true, true);
                default: return null;
            }
        }
    }

    export enum ResolutionTiffUnit {
        Inches = 2, Centimeters = 3
    }
}