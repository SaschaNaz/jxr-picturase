///<reference path="pixelformats.ts"/>
module JxrPicturase {
    export class ContainerInfo {
        imageInfo = new ImageInfo();
        hasAlpha: Boolean;

        orientationState: ImageOrientationState;//initally null
    }

    export enum PostProcessingStrength { None, Light, Medium, Strong, VeryStrong }
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

    export class ImageInfo {
        width: number;
        height: number;
        colorFormat: ColorFormat;
        bitDepth: BitDepth;
        bitsPerUnit: number;
        leadingPadding: number;
        isRgb: Boolean;

        //ROI is not implemented here

        //thumbnail too

        //orientation
        orientationState: ImageOrientationState;

        //post processing
        postProcessingStrength: PostProcessingStrength;

        //user buffer is always padded to whole MB - what is MB?
        //Anyway it is used for optimization for SSE command set, which is not possible with JavaScript.
        //paddedUserBuffer: Boolean;
    }
}