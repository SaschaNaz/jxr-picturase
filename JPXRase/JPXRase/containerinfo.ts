///<reference path="pixelformats.ts"/>
module JxrPicturase {
    export class ContainerInfo {
        hasAlpha: Boolean;
        imageInfo: ImageInfo;
    }

    export enum PostProcessingStrength { None, Light, Medium, Strong, VeryStrong }
    export class ImageOrientationState {
        RotatedClockwise: Boolean;
        FlippedVertically: Boolean;
        FlippedHorizontally: Boolean;
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