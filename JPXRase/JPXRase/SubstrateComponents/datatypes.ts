///<reference path="jxrmath.ts"/>
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

    export class ImageType {
        constructor(public isImagePreview: boolean, public isOneOfMultipleImages: boolean) {
        }
    }

    export class ColorInformation {
        constructor(public colorPrimaries: ColorPrimaries, public transferer: Transferer, public matrixCoefficients: MatrixCoefficients, public isRangeFull: boolean) {
        }
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
                    throw new Error(JxrErrorMessage.getUnsupportedValueMessage("COLOR_PRIMARIES"));
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

        static getTransferer(characteresticsNumber: number) {
            switch (characteresticsNumber) {
                case 0:
                case 3:
                case 8:
                case 9:
                default:
                    throw new Error(JxrErrorMessage.getUnsupportedValueMessage("TRANSFER_CHARACTERISTICS"));
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

    export class MatrixCoefficients {
        constructor(public colorSpace?: MatrixColorSpace, public vKr?: number, public vKb?: number) {
        }

        isSpecified() {
            if (this.colorSpace != undefined
                && this.vKr != undefined
                && this.vKb != undefined);
        }

        static getMatrixCoefficients(matrixNumber: number) {
            switch (matrixNumber) {
                case 3:
                default:
                    throw new Error(JxrErrorMessage.getUnsupportedValueMessage("MATRIX_COEFFICIENTS"));
                case 2://unspecified
                    return new MatrixCoefficients();
                case 0://RGB
                    return new MatrixCoefficients(MatrixColorSpace.RGB);
                case 8://YCgCo
                    return new MatrixCoefficients(MatrixColorSpace.YCgCo);
                case 1:
                    return new MatrixCoefficients(MatrixColorSpace.YCbCr, 0.2126, 0.0772);
                case 4:
                    return new MatrixCoefficients(MatrixColorSpace.YCbCr, 0.30, 0.11);
                case 5:
                case 6:
                    return new MatrixCoefficients(MatrixColorSpace.YCbCr, 0.299, 0.114);
                case 7:
                    return new MatrixCoefficients(MatrixColorSpace.YCbCr, 0.212, 0.087);
            }
        }
    }

    export enum MatrixColorSpace {
        RGB, YCgCo, YCbCr
    }

    export class MatrixTransformer {
        constructor(private coeffecients: MatrixCoefficients, private outputBitDepth: BitDepth, private isRangeFull: boolean) {
        }

        transform(photon: RgbPhoton): Photon {
            var valueWhite = this.getValueWhite(this.outputBitDepth);
            var chromaOffset = this.getChromaOffset(this.outputBitDepth, valueWhite);
            if (this.coeffecients.colorSpace == MatrixColorSpace.RGB || this.coeffecients.colorSpace == MatrixColorSpace.YCgCo) {
                var outputRgbPhoton
                    = new RgbPhoton(
                        valueWhite / 256 * (219 * photon.r + 16),
                        valueWhite / 256 * (219 * photon.g + 16),
                        valueWhite / 256 * (219 * photon.b + 16));
                if (this.coeffecients.colorSpace == MatrixColorSpace.RGB) {
                    outputRgbPhoton.r = Math.round(outputRgbPhoton.r);
                    outputRgbPhoton.g = Math.round(outputRgbPhoton.g);
                    outputRgbPhoton.b = Math.round(outputRgbPhoton.b);
                    return outputRgbPhoton;
                }
                else {//YCgCo
                    return new YcgcoPhoton(
                        Math.round(0.5 * outputRgbPhoton.g + 0.25 * (outputRgbPhoton.r + outputRgbPhoton.b)),
                        Math.round(0.5 * outputRgbPhoton.g - 0.25 * (outputRgbPhoton.r + outputRgbPhoton.b)) + chromaOffset,
                        Math.round(0.5 * (outputRgbPhoton.r - outputRgbPhoton.b)) + chromaOffset);
                }
            }
            else {//YCbCr
                var ycbcrPhoton
                    = new YcbcrPhoton(this.coeffecients.vKr * photon.r + (1 - this.coeffecients.vKr - this.coeffecients.vKb) * photon.g + this.coeffecients.vKb * photon.b);
                ycbcrPhoton.cb = 0.5 * (photon.b - ycbcrPhoton.y) / (1 - this.coeffecients.vKb);
                ycbcrPhoton.cr = 0.5 * (photon.r - ycbcrPhoton.y) / (1 - this.coeffecients.vKr);
                if (!this.isRangeFull) {
                    var outputYcbcrPhoton = new YcbcrPhoton(
                        Math.round(valueWhite / 256 * (219 * ycbcrPhoton.y + 16)),
                        Math.round(valueWhite / 256 * (224 * ycbcrPhoton.cb) + chromaOffset),
                        Math.round(valueWhite / 256 * (224 * ycbcrPhoton.cr) + chromaOffset));
                    switch (this.outputBitDepth) {
                        case BitDepth.Bit8:
                        case BitDepth.Bit10:
                        case BitDepth.Bit16:
                            {
                                outputYcbcrPhoton.y = JxrMath.clip(outputYcbcrPhoton.y, 0, valueWhite - 1);
                                outputYcbcrPhoton.cb = JxrMath.clip(outputYcbcrPhoton.cb, 0, valueWhite - 1);
                                outputYcbcrPhoton.cr = JxrMath.clip(outputYcbcrPhoton.cr, 0, valueWhite - 1);
                            }
                    }
                    return outputYcbcrPhoton;
                }
                else {
                    return new YcbcrPhoton(
                        Math.round((valueWhite - 1) * ycbcrPhoton.y),
                        Math.round((valueWhite - 1) * ycbcrPhoton.cb + chromaOffset),
                        Math.round((valueWhite - 1) * ycbcrPhoton.cr + chromaOffset));
                }
            }
        }

        private getValueWhite(outputBitDepth: BitDepth) {
            var valueBitDepthWhite: number;
            switch (outputBitDepth) {
                case BitDepth.Bit8: valueBitDepthWhite = 8; break;
                case BitDepth.Bit10: valueBitDepthWhite = 10; break;
                case BitDepth.Bit16S: valueBitDepthWhite = 13; break;
                case BitDepth.Bit16: valueBitDepthWhite = 16; break;
                default: throw new Error("No guideline for this bit depth in PTM_COLOR_INFO");
            }
            return (1 << valueBitDepthWhite);
        }

        private getChromaOffset(outputBitDepth: BitDepth, valueWhite: number) {
            var chromaOffset: number;
            switch (outputBitDepth) {
                case BitDepth.Bit8: 
                case BitDepth.Bit10: 
                case BitDepth.Bit16:
                    chromaOffset = valueWhite / 2; break;
                case BitDepth.Bit16S:
                    chromaOffset = 0; break;
                default: throw new Error("No guideline for this bit depth in PTM_COLOR_INFO");
            }
            return chromaOffset;
        }
    }

    export interface Photon {
        colorSpace: MatrixColorSpace;
    }

    export class RgbPhoton {
        colorSpace = MatrixColorSpace.RGB;
        constructor(public r?: number, public g?: number, public b?: number) {
        }
    }

    export class YcgcoPhoton {
        colorSpace = MatrixColorSpace.YCgCo;
        constructor(public y?: number, public cg?: number, public co?: number) {
        }
    }

    export class YcbcrPhoton {
        colorSpace = MatrixColorSpace.YCbCr;
        constructor(public y?: number, public cb?: number, public cr?: number) {
        }
    }

    export enum Profile {
        SubBaseline = 44,
        Baseline = 55,
        Main = 66,
        Advanced = 111
    }

    export class ProfileAndLevelConformance {
        private useLongValues: boolean;
        private overlapModeList: ImageOverlapMode[] = [];
        private pixelFormatList: PixelFormat[] = [];

        private maxBitImageDimension: number;
        private maxBitDimensionInTiles: number;
        private maxBitTileDimension: number;
        /** size in bytes */
        private MaxBitBufferSize: number;

        constructor(public isInIfdEntry: boolean, profile = Profile.Advanced, level = 255) {
            if (profile == Profile.SubBaseline) {
                this.useLongValues = false;
                this.overlapModeList.push(ImageOverlapMode.None, ImageOverlapMode.SecondLevel);
            }
            switch (profile) {
                case Profile.Main:
                    this.pixelFormatList.push(
                        PixelFormats.Bpp48RgbHalf,
                        PixelFormats.Bpp96RgbFixedPoint,
                        PixelFormats.Bpp64RgbHalf,
                        PixelFormats.Bpp128RgbFixedPoint,
                        PixelFormats.Bpp128RgbFloat,
                        PixelFormats.Bpp32Bgra,
                        PixelFormats.Bpp64Rgba,
                        PixelFormats.Bpp64RgbaFixedPoint,
                        PixelFormats.Bpp64RgbaHalf,
                        PixelFormats.Bpp128RgbaFixedPoint,
                        PixelFormats.Bpp128RgbaFloat,
                        PixelFormats.Bpp32Pbgra,
                        PixelFormats.Bpp64Prgba,
                        PixelFormats.Bpp128PrgbaFloat,
                        PixelFormats.Bpp32Cmyk,
                        PixelFormats.Bpp40CmykAlpha,
                        PixelFormats.Bpp64Cmyk,
                        PixelFormats.Bpp80CmykAlpha,
                        PixelFormats.Bpp24Channels3,
                        PixelFormats.Bpp32Channels4,
                        PixelFormats.Bpp40Channels5,
                        PixelFormats.Bpp48Channels6,
                        PixelFormats.Bpp56Channels7,
                        PixelFormats.Bpp64Channels8,
                        PixelFormats.Bpp32Channels3Alpha,
                        PixelFormats.Bpp40Channels4Alpha,
                        PixelFormats.Bpp48Channels5Alpha,
                        PixelFormats.Bpp56Channels6Alpha,
                        PixelFormats.Bpp64Channels7Alpha,
                        PixelFormats.Bpp72Channels8Alpha,
                        PixelFormats.Bpp48Channels3,
                        PixelFormats.Bpp64Channels4,
                        PixelFormats.Bpp80Channels5,
                        PixelFormats.Bpp96Channels6,
                        PixelFormats.Bpp112Channels7,
                        PixelFormats.Bpp128Channels8,
                        PixelFormats.Bpp64Channels3Alpha,
                        PixelFormats.Bpp80Channels4Alpha,
                        PixelFormats.Bpp96Channels5Alpha,
                        PixelFormats.Bpp112Channels6Alpha,
                        PixelFormats.Bpp128Channels7Alpha,
                        PixelFormats.Bpp144Channels8Alpha,
                        PixelFormats.Bpp16GrayHalf,
                        PixelFormats.Bpp32GrayFixedPoint,
                        PixelFormats.Bpp32GrayFloat,
                        PixelFormats.Bpp32RgbExponent);
                    //no break
                case Profile.Baseline:
                    this.pixelFormatList.push(
                        PixelFormats.Bpp48Rgb,
                        PixelFormats.Bpp48RgbFixedPoint,
                        PixelFormats.Bpp64RgbFixedPoint,
                        PixelFormats.Bpp16Gray,
                        PixelFormats.Bpp16GrayFixedPoint);
                    //no break
                case Profile.SubBaseline:
                    this.pixelFormatList.push(
                        PixelFormats.Bpp24Rgb,
                        PixelFormats.Bpp24Bgr,
                        PixelFormats.Bpp32Bgr,
                        PixelFormats.Bpp8Gray,
                        PixelFormats.BlackWhite,
                        PixelFormats.Bpp16Bgr555,
                        PixelFormats.Bpp16Bgr565,
                        PixelFormats.Bpp32Bgr101010);
                    break;
            }

            switch (level) {
                case 4:
                    {
                        this.maxBitImageDimension = 10;
                        this.maxBitDimensionInTiles = 4;
                        this.maxBitTileDimension = 10;
                        this.MaxBitBufferSize = 22;
                        break;
                    }
                case 8:
                    {
                        this.maxBitImageDimension = 11;
                        this.maxBitDimensionInTiles = 5;
                        this.maxBitTileDimension = 11;
                        this.MaxBitBufferSize = 24;
                        break;
                    }
                case 16:
                    {
                        this.maxBitImageDimension = 12;
                        this.maxBitDimensionInTiles = 6;
                        this.maxBitTileDimension = 12;
                        this.MaxBitBufferSize = 26;
                        break;
                    }
                case 32:
                    {
                        this.maxBitImageDimension = 13;
                        this.maxBitDimensionInTiles = 7;
                        this.maxBitTileDimension = 12;
                        this.MaxBitBufferSize = 28;
                        break;
                    }
                case 64:
                    {
                        this.maxBitImageDimension = 14;
                        this.maxBitDimensionInTiles = 8;
                        this.maxBitTileDimension = 12;
                        this.MaxBitBufferSize = 30;
                        break;
                    }
                case 128:
                    {
                        this.maxBitImageDimension = 16;
                        this.maxBitDimensionInTiles = 10;
                        this.maxBitTileDimension = 12;
                        this.MaxBitBufferSize = 32;
                        break;
                    }
                case 255:
                    {
                        this.maxBitImageDimension = 32;
                        this.maxBitDimensionInTiles = 12;
                        this.maxBitTileDimension = 32;
                        //no buffersize limit
                        break;
                    }
                default:
                    throw new Error(JxrErrorMessage.getUnsupportedValueMessage("LEVEL_IDC"));
            }
        }

        check(ifdEntry: IfdEntry, imageHeader: ImageHeader, imagePlaneHeader: ImagePlaneHeader) {
            //profile check
            if (this.useLongValues !== undefined && this.useLongValues != imageHeader.useLongValues)
                return false;
            if (this.overlapModeList.length != 0 && this.overlapModeList.indexOf(imageHeader.overlapMode) == -1)
                return false;
            if (this.pixelFormatList.length != 0 && this.pixelFormatList.indexOf(ifdEntry.pixelFormat) == -1)
                return false;

            //level check
            var lumaExtendedWidth = imageHeader.getLumaExtendedWidth();
            if (lumaExtendedWidth > Math.pow(2, this.maxBitImageDimension))
                return false;
            if (imageHeader.getLumaExtendedHeight() > Math.pow(2, this.maxBitImageDimension))
                return false;
            if (imageHeader.numberOfHorizontalTiles > Math.pow(2, this.maxBitDimensionInTiles))
                return false;
            for (var i = 0; i < imageHeader.numberOfVerticalTiles - 1; i++)
                if (imageHeader.tileWidthsInMacroblocks[i] * 16 >= Math.pow(2, this.maxBitTileDimension))
                    return false;
            for (var i = 0; i < imageHeader.numberOfHorizontalTiles - 1; i++)
                if (imageHeader.tileHeightsInMacroblocks[i] * 16 >= Math.pow(2, this.maxBitTileDimension))
                    return false;
            if (lumaExtendedWidth - imageHeader.getTileBoundariesTop()[imageHeader.numberOfHorizontalTiles - 1] * 16 >= Math.pow(2, this.maxBitTileDimension))
                return false;
            if (this.MaxBitBufferSize !== undefined) {
                if (this.getImageBufferBytes(ifdEntry, imageHeader, imagePlaneHeader) >= Math.pow(2, this.MaxBitBufferSize))
                    return false;
            }
            else
                if (!imageHeader.hasShortHeader)
                    return false;

            return true;
        }

        private getComponentCount(ifdEntry: IfdEntry, imageHeader: ImageHeader, imagePlaneHeader: ImagePlaneHeader) {
            if (this.isInIfdEntry)
                return ifdEntry.pixelFormat.componentCount;
            else if (!imageHeader.hasAlphaImagePlane)
                return imagePlaneHeader.getComponentCount();//
            else
                return imagePlaneHeader.getComponentCount() + 1;//
        }

        private getImageBufferBytes(ifdEntry: IfdEntry, imageHeader: ImageHeader, imagePlaneHeader: ImagePlaneHeader) {
            var componentCount = this.getComponentCount(ifdEntry, imageHeader, imagePlaneHeader);
            var lumaExtendedPlaneSize = imageHeader.getLumaExtendedWidth() * imageHeader.getLumaExtendedHeight();
            switch (imageHeader.outputBitDepth) {
                case BitDepth.Bit8: return componentCount * lumaExtendedPlaneSize;
                case BitDepth.Bit16:
                case BitDepth.Bit16S:
                case BitDepth.Bit16F:
                    return 2 * componentCount * lumaExtendedPlaneSize;
                case BitDepth.Bit32S:
                case BitDepth.Bit32F:
                    return 4 * componentCount * lumaExtendedPlaneSize;
                case BitDepth.Bit1White1:
                case BitDepth.Bit1Black1:
                    return lumaExtendedPlaneSize / 8;
                case BitDepth.Bit5:
                case BitDepth.Bit565:
                    return 2 * lumaExtendedPlaneSize;
                default: //Bit10
                    if (imageHeader.outputColorFormat == ColorFormat.Rgb)
                        return 4 * lumaExtendedPlaneSize;
                    else
                        return 2 * componentCount * lumaExtendedPlaneSize;
            }
        }
    }

    export class FrequencyBandsPresence {
        constructor(public isDcPresent: boolean, public isLowpassPresent: boolean, public isHighpassPresent: boolean, public isFlexbitsPresent: boolean) {
        }

        static getBandsPresence(presenceNumber: number) {
            switch (presenceNumber) {
                case 0: return new FrequencyBandsPresence(true, true, true, true);
                case 1: return new FrequencyBandsPresence(true, true, true, false);
                case 2: return new FrequencyBandsPresence(true, true, false, false);
                case 3: return new FrequencyBandsPresence(true, false, false, false);
                default: throw new Error(JxrErrorMessage.getUnsupportedValueMessage("BANDS_PRESENT"));
            }
        }
    }
}