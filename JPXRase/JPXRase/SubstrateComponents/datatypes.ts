module JxrPicturase.SubstrateComponents {
    export enum ImageOverlapMode {
        None, SecondLevel, FirstAndSecondLevel
    }

    export class TransformationState {
        constructor(
            public RotatedClockwise: boolean,
            public FlippedHorizontally: boolean,
            public FlippedVertically: boolean) {
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
        constructor(
            public greenX?: number, public blueX?: number, public redX?: number, public whiteX?: number,
            public greenY?: number, public blueY?: number, public redY?: number, public whiteY?: number) {
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
                    return new ColorPrimaries();
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

    export class Transferer {
        constructor(private transferFunction?: (vLc: number) => number, public isValueInZeroToOneRange = true) {
        }

        /** get vV value from vLc value */
        transfer(opticalIntensityInput: number) {
            if (this.isValueInZeroToOneRange && opticalIntensityInput < 0 || opticalIntensityInput > 1)
                throw "invalid optical intensity input";
            return this.transferFunction(opticalIntensityInput);
        }

        isSpecified() {
            return (this.transferFunction != undefined);
        }

        getTransferCharacteristics(characteresticsNumber: number) {
            switch (characteresticsNumber) {
                case 0:
                case 3:
                case 8:
                case 9:
                default:
                    throw new Error("Unsupported TransferCharacteristics value");
                case 2://unspecified
                    return new Transferer();
                case 1:
                case 6:
                    return new Transferer(
                        (vLc: number) => { 
                            if (vLc >= 0.018 && vLc <= 1)
                                return (1.099 * Math.pow(vLc, 0.45) - 0.099);
                            else if (vLc < 0.018 && vLc >= 0)
                                return (4.500 * vLc);
                            else
                                throw new Error("invalid optical intensity input");
                        });
                case 4:
                    return new Transferer(
                        (vLc: number) => {
                            return Math.pow(vLc, 2.2);
                        });
                case 5:
                    return new Transferer(
                        (vLc: number) => {
                            return Math.pow(vLc, 2.8);
                        });
                case 7:
                    return new Transferer(
                        (vLc: number) => {
                            if (vLc >= 0.0228 && vLc <= 1)
                                return (1.1115 * Math.pow(vLc, 0.45) - 0.1115);
                            else if (vLc < 0.0228 && vLc >= 0)
                                return (4.0 * vLc);
                            else
                                throw new Error("invalid optical intensity input");
                        });
                case 8:
                    return new Transferer(
                        (vLc: number) => {
                            return vLc;
                        });
                case 11:
                    return new Transferer(
                        (vLc: number) => {
                            if (vLc >= 0.018)
                                return (1.099 * Math.pow(vLc, 0.45) - 0.099);
                            else if (vLc > -0.018)
                                return (4.500 * vLc);
                            else
                                return (-1.099 * Math.pow(-vLc, 0.45) + 0.099);
                        }, false);
                case 12:
                    return new Transferer(
                        (vLc: number) => {
                            if (vLc <= 0.018 && vLc < 1.33)
                                return (1.099 * Math.pow(vLc, 0.45) - 0.099);
                            else if (vLc >= -0.0045 && vLc < 0.018)
                                return (4.500 * vLc);
                            else if (vLc >= -0.25 && vLc < -0.0045)
                                return (-(1.099 * Math.pow(-4 * vLc, 0.45) - 0.099) / 4)
                            else
                                throw new Error("invalid optical intensity input");
                        }, false);
                case 13:
                    return new Transferer(
                        (vLc: number) => {
                            if (vLc >= 0.0031308 && vLc < 1)
                                return (1.055 * Math.pow(vLc, 1 / 2.4) - 0.055)
                            else if (vLc >= 0 && vLc < 0.0031308)
                                return (12.92 * vLc);
                        });
            }
        }
    }

    export class MatrixTransformer {
        constructor(public colorSpace?: MatrixColorSpace, public vKr?: number, public vKb?: number) {
        }

        transform(transferer: Transferer, outputBitDepth: BitDepth, isRangeFull: boolean) {
            var er: number, eg: number, eb: number;
            var valueBitDepthWhite: number;
            switch (outputBitDepth) {
                case BitDepth.Bit8: valueBitDepthWhite = 8; break;
                case BitDepth.Bit10: valueBitDepthWhite = 10; break;
                case BitDepth.Bit16S: valueBitDepthWhite = 13; break;
                case BitDepth.Bit16: valueBitDepthWhite = 16; break;
            }
        }

        isSpecified() {
            if (this.colorSpace != undefined
                && this.vKr != undefined
                && this.vKb != undefined);
        }

        static getMatrixTransformer(matrixNumber: number) {
            switch (matrixNumber) {
                case 3:
                default:
                    throw new Error("MatrixTransformer value is not valid");
                case 2://unspecified
                    return new MatrixTransformer();
                case 0://RGB
                    return new MatrixTransformer(MatrixColorSpace.RGB);
                case 8://YCgCo
                    return new MatrixTransformer(MatrixColorSpace.YCgCo);
                case 1:
                    return new MatrixTransformer(MatrixColorSpace.YCbCr, 0.2126, 0.0772);
                case 4:
                    return new MatrixTransformer(MatrixColorSpace.YCbCr, 0.30, 0.11);
                case 5:
                case 6:
                    return new MatrixTransformer(MatrixColorSpace.YCbCr, 0.299, 0.114);
                case 7:
                    return new MatrixTransformer(MatrixColorSpace.YCbCr, 0.212, 0.087);
            }
        }
    }

    export enum MatrixColorSpace {
        RGB, YCgCo, YCbCr
    }
}