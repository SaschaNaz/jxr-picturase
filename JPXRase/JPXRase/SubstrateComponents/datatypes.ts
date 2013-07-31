module JxrPicturase.SubstrateComponents {
    export enum ImageOverlapMode {
        None, SecondLevel, FirstAndSecondLevel
    }

    export class TransformationState {
        constructor(
            public RotatedClockwise: Boolean,
            public FlippedHorizontally: Boolean,
            public FlippedVertically: Boolean) {
        }

        static getTransformationState(state: number) {
            switch (state) {
                default://should be equal to value 0
                case 0: return new TransformationState(false, false, false);

                case 1: return new TransformationState(false, false, true);
                case 2: return new TransformationState(false, true, false);
                case 3: return new TransformationState(false, true, true);
                case 4: return new TransformationState(true, false, false);
                case 5: return new TransformationState(true, false, true);
                case 6: return new TransformationState(true, true, false);
                case 7: return new TransformationState(true, true, true);
            }
        }
    }
    
    export enum ColorSpace {
        sRGB = 1, Other = 0xFFFF
    }

    export class ColorPrimaries {
        greenX: number;
        blueX: number;
        redX: number;
        whiteX: number;
        greenY: number;
        blueY: number;
        redY: number;
        whiteY: number;
        constructor(greenX, blueX, redX, whiteX, greenY, blueY, redY, whiteY) {
            this.greenX = greenX;
            this.blueX = blueX;
            this.redX = redX;
            this.whiteX = whiteX;
            this.greenY = greenY;
            this.blueY = blueY;
            this.redY = redY;
            this.whiteY = whiteY;
        }

        static getColorPrimaries(primaries: number) {
            switch (primaries) {
                case 0:
                case 3:
                default:
                    throw new Error("Unsupported ColorPrimaries value");
                case 1:
                    return new ColorPrimaries(0.300, 0.150, 0.640, 0.3127, 0.600, 0.060, 0.330, 0.3290);
                case 2:
                    return null;
                case 4:
                    return new ColorPrimaries(0.210, 0.140, 0.670, 0.3100, 0.710, 0.080, 0.330, 0.3160);
                case 5:
                    return new ColorPrimaries(0.290, 0.150, 0.640, 0.3127, 0.600, 0.060, 0.330, 0.3290);
                case 6:
                case 7:
                    return new ColorPrimaries(0.310, 0.155, 0.630, 0.3127, 0.595, 0.070, 0.340, 0.3290);
            }
        }
    }

    export class TransferCharacteristics {
        private conv1(vLc: number) {
            if (vLc >= 0.018)

        }
    }

    export enum 

    export enum ResolutionTiffUnit {
        Inches = 2, Centimeters = 3
    }
}