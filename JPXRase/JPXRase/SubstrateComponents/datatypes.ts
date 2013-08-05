﻿module JxrPicturase.SubstrateComponents {
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
        constructor(
            greenX: number, blueX: number, redX: number, whiteX: number,
            greenY: number, blueY: number, redY: number, whiteY: number) {
            this.greenX = greenX;
            this.blueX = blueX;
            this.redX = redX;
            this.whiteX = whiteX;
            this.greenY = greenY;
            this.blueY = blueY;
            this.redY = redY;
            this.whiteY = whiteY;
        }
        
        isSpecified() {
            return (this.greenX != undefined
                && this.blueX != undefined
                && this.redX != undefined
                && this.whiteX != undefined
                && this.greenY != undefined
                && this.blueY != undefined
                && this.redY != undefined
                && this.whiteY != undefined);
        }

        static getColorPrimaries(primariesNumber: number) {
            switch (primariesNumber) {
                case 0:
                case 3:
                default:
                    throw new Error("Unsupported ColorPrimaries value");
                case 2://unspecified
                    return new ColorPrimaries(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
                case 1:
                    return new ColorPrimaries(0.300, 0.150, 0.640, 0.3127, 0.600, 0.060, 0.330, 0.3290);
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
        private transferer: Function;
        constructor(characteresticsFunction: Function) {

        }

        transfer(opticalIntensityInput: number) {
            if (opticalIntensityInput < 0 || opticalIntensityInput > 1)
                throw "invalid optical intensity input";
        }

        getTransferCharacteristics(characteresticsNumber: number) {
            switch (characteresticsNumber) {
                case 0:
                case 3:
                default:
                    throw new Error("Unsupported TransferCharacteristics value");
                case 1:
                    return new TransferCharacteristics(
                        (vLc: number) => { 
                            if (vLc >= 0.018 && vLc <= 1)
                                return (1.099 * Math.pow(vLc, 0.45) - 0.099);
                            else if (vLc >= 0 && vLc < 0.018)
                                return (4.500 * vLc)
                            else
                                throw new Error("TransferCharacterestics value is not valid");
                        });
            }
        }
    }
}