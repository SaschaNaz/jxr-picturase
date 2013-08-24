module JxrPicturase.SubstrateComponents {
    export enum ColorFormat {
	    YOnly = 0,
        Yuv420 = 1,
        Yuv422 = 2,
        Yuv444 = 3,
        Cmyk = 4,
        CmykDirect = 5,
        NComponent = 6,
        Rgb = 7, 
        RgbExponent = 8
    }

    export enum InternalColorFormat {
        YOnly = 0,
        Yuv420 = 1,
        Yuv422 = 2,
        Yuv444 = 3,
        Yuvk = 4,
        NComponent = 6
    }

    export enum NumberDataType {
        Uint, Int, Float
    }

    export enum BitDepth {
        //regular ones
        Bit1White1, //White is foreground
        Bit8, Bit16, Bit16S, Bit16F, Bit32S = 6, Bit32F = 7,

        //irregular ones
        Bit5 = 8, Bit10 = 9, Bit565 = 10,

        Bit1Black1 = 0xf //Black is foreground
    }

    export enum BandsPresent {
        All, NoFlexbits, NoHighpass, DcOnly
    }

    export class PixelFormat {
        constructor(
            public componentCount: number,
            public hasAlpha: boolean,
            public bitDepthPerChannel: BitDepth,
            public colorDataType: NumberDataType,
            public colorFormat: ColorFormat
            ) {
        }

        isEqualFormat(format: PixelFormat) {
            return (format.componentCount == this.componentCount
                && format.hasAlpha == this.hasAlpha
                && format.bitDepthPerChannel == this.bitDepthPerChannel
                && format.colorDataType == this.colorDataType
                && format.colorFormat == this.colorFormat);
        }
    }

    export class PixelFormats {
        static get Bpp24Rgb() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp24Bgr() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp32Bgr() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp48Rgb() { return new PixelFormat(3, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp48RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit16S, NumberDataType.Int, ColorFormat.Rgb); }
        static get Bpp48RgbHalf() { return new PixelFormat(3, false, BitDepth.Bit16F, NumberDataType.Float, ColorFormat.Rgb); }
        static get Bpp96RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit32S, NumberDataType.Int, ColorFormat.Rgb); }
        static get Bpp64RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit16S, NumberDataType.Int, ColorFormat.Rgb); }
        static get Bpp64RgbHalf() { return new PixelFormat(3, false, BitDepth.Bit16F, NumberDataType.Float, ColorFormat.Rgb); }
        static get Bpp128RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit32S, NumberDataType.Int, ColorFormat.Rgb); }
        static get Bpp128RgbFloat() { return new PixelFormat(3, false, BitDepth.Bit32F, NumberDataType.Float, ColorFormat.Rgb); }
        static get Bpp32Bgra() { return new PixelFormat(4, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp64Rgba() { return new PixelFormat(4, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp64RgbaFixedPoint() { return new PixelFormat(4, true, BitDepth.Bit16S, NumberDataType.Int, ColorFormat.Rgb); }
        static get Bpp64RgbaHalf() { return new PixelFormat(4, true, BitDepth.Bit16F, NumberDataType.Float, ColorFormat.Rgb); }
        static get Bpp128RgbaFixedPoint() { return new PixelFormat(4, true, BitDepth.Bit32S, NumberDataType.Int, ColorFormat.Rgb); }
        static get Bpp128RgbaFloat() { return new PixelFormat(4, true, BitDepth.Bit32F, NumberDataType.Float, ColorFormat.Rgb); }
        static get Bpp32Pbgra() { return new PixelFormat(4, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp64Prgba() { return new PixelFormat(4, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp128PrgbaFloat() { return new PixelFormat(4, true, BitDepth.Bit32F, NumberDataType.Float, ColorFormat.Rgb); }
        static get Bpp32Cmyk() { return new PixelFormat(4, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Cmyk); }
        static get Bpp40CmykAlpha() { return new PixelFormat(5, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Cmyk); }
        static get Bpp64Cmyk() { return new PixelFormat(4, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Cmyk); }
        static get Bpp80CmykAlpha() { return new PixelFormat(5, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Cmyk); }
        static get Bpp24Channels3() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp32Channels4() { return new PixelFormat(4, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp40Channels5() { return new PixelFormat(5, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp48Channels6() { return new PixelFormat(6, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp56Channels7() { return new PixelFormat(7, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp64Channels8() { return new PixelFormat(8, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp32Channels3Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp40Channels4Alpha() { return new PixelFormat(5, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp48Channels5Alpha() { return new PixelFormat(6, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp56Channels6Alpha() { return new PixelFormat(7, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp64Channels7Alpha() { return new PixelFormat(8, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp72Channels8Alpha() { return new PixelFormat(9, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp48Channels3() { return new PixelFormat(3, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp64Channels4() { return new PixelFormat(4, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp80Channels5() { return new PixelFormat(5, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp96Channels6() { return new PixelFormat(6, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp112Channels7() { return new PixelFormat(7, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp128Channels8() { return new PixelFormat(8, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp64Channels3Alpha() { return new PixelFormat(4, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp80Channels4Alpha() { return new PixelFormat(5, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp96Channels5Alpha() { return new PixelFormat(6, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp112Channels6Alpha() { return new PixelFormat(7, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp128Channels7Alpha() { return new PixelFormat(8, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp144Channels8Alpha() { return new PixelFormat(9, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.NComponent); }
        static get Bpp8Gray() { return new PixelFormat(1, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.YOnly); }
        static get Bpp16Gray() { return new PixelFormat(1, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.YOnly); }
        static get Bpp16GrayFixedPoint() { return new PixelFormat(1, false, BitDepth.Bit16S, NumberDataType.Int, ColorFormat.YOnly); }
        static get Bpp16GrayHalf() { return new PixelFormat(1, false, BitDepth.Bit16F, NumberDataType.Float, ColorFormat.YOnly); }
        static get Bpp32GrayFixedPoint() { return new PixelFormat(1, false, BitDepth.Bit32S, NumberDataType.Int, ColorFormat.YOnly); }
        static get Bpp32GrayFloat() { return new PixelFormat(1, false, BitDepth.Bit32F, NumberDataType.Float, ColorFormat.YOnly); }
        static get BlackWhite() { return new PixelFormat(1, false, BitDepth.Bit1White1, NumberDataType.Uint, ColorFormat.YOnly); }
        static get Bpp16Bgr555() { return new PixelFormat(3, false, BitDepth.Bit5, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp16Bgr565() { return new PixelFormat(3, false, BitDepth.Bit565, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp32Bgr101010() { return new PixelFormat(3, false, BitDepth.Bit10, NumberDataType.Uint, ColorFormat.Rgb); }
        static get Bpp32RgbExponent() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Float, ColorFormat.RgbExponent); }
        static get Bpp32CmykDirect() { return new PixelFormat(4, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.CmykDirect); }
        static get Bpp64CmykDirect() { return new PixelFormat(4, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.CmykDirect); }
        static get Bpp40CmykDirectAlpha() { return new PixelFormat(5, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.CmykDirect); }
        static get Bpp80CmykDirectAlpha() { return new PixelFormat(5, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.CmykDirect); }
        static get Bpp12Ycc420() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Yuv420); }
        static get Bpp16Ycc422() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Yuv422); }
        static get Bpp20Ycc422() { return new PixelFormat(3, false, BitDepth.Bit10, NumberDataType.Uint, ColorFormat.Yuv422); }
        static get Bpp32Ycc422() { return new PixelFormat(3, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Yuv422); }
        static get Bpp24Ycc444() { return new PixelFormat(3, false, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Yuv444); }
        static get Bpp30Ycc444() { return new PixelFormat(3, false, BitDepth.Bit10, NumberDataType.Uint, ColorFormat.Yuv444); }
        static get Bpp48Ycc444() { return new PixelFormat(3, false, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Yuv444); }
        static get Bpp48Ycc444FixedPoint() { return new PixelFormat(3, false, BitDepth.Bit16S, NumberDataType.Int, ColorFormat.Yuv444); }
        static get Bpp20Ycc420Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Yuv420); }
        static get Bpp24Ycc422Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Yuv422); }
        static get Bpp30Ycc422Alpha() { return new PixelFormat(4, true, BitDepth.Bit10, NumberDataType.Uint, ColorFormat.Yuv422); }
        static get Bpp48Ycc422Alpha() { return new PixelFormat(4, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Yuv422); }
        static get Bpp32Ycc444Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberDataType.Uint, ColorFormat.Yuv444); }
        static get Bpp40Ycc444Alpha() { return new PixelFormat(4, true, BitDepth.Bit10, NumberDataType.Uint, ColorFormat.Yuv444); }
        static get Bpp64Ycc444Alpha() { return new PixelFormat(4, true, BitDepth.Bit16, NumberDataType.Uint, ColorFormat.Yuv444); }
        static get Bpp64Ycc444AlphaFixedPoint() { return new PixelFormat(4, true, BitDepth.Bit16S, NumberDataType.Int, ColorFormat.Yuv444); }

        static getPixelFormatByGuid(guid: string) {
            switch (guid) {
                case "24C3DD6F034EFE4BB1853D77768DC90D": return PixelFormats.Bpp24Rgb;
                case "24C3DD6F034EFE4BB1853D77768DC90C": return PixelFormats.Bpp24Bgr;
                case "24C3DD6F034EFE4BB1853D77768DC90E": return PixelFormats.Bpp32Bgr;
                case "24C3DD6F034EFE4BB1853D77768DC915": return PixelFormats.Bpp48Rgb;
                case "24C3DD6F034EFE4BB1853D77768DC912": return PixelFormats.Bpp48RgbFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC93B": return PixelFormats.Bpp48RgbHalf;
                case "24C3DD6F034EFE4BB1853D77768DC918": return PixelFormats.Bpp96RgbFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC940": return PixelFormats.Bpp64RgbFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC942": return PixelFormats.Bpp64RgbHalf;
                case "24C3DD6F034EFE4BB1853D77768DC941": return PixelFormats.Bpp128RgbFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC91B": return PixelFormats.Bpp128RgbFloat;
                case "24C3DD6F034EFE4BB1853D77768DC90F": return PixelFormats.Bpp32Bgra;
                case "24C3DD6F034EFE4BB1853D77768DC916": return PixelFormats.Bpp64Rgba;
                case "24C3DD6F034EFE4BB1853D77768DC91D": return PixelFormats.Bpp64RgbaFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC93A": return PixelFormats.Bpp64RgbaHalf;
                case "24C3DD6F034EFE4BB1853D77768DC91E": return PixelFormats.Bpp128RgbaFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC919": return PixelFormats.Bpp128RgbaFloat;
                case "24C3DD6F034EFE4BB1853D77768DC910": return PixelFormats.Bpp32Pbgra;
                case "24C3DD6F034EFE4BB1853D77768DC917": return PixelFormats.Bpp64Prgba;
                case "24C3DD6F034EFE4BB1853D77768DC91A": return PixelFormats.Bpp128PrgbaFloat;
                case "24C3DD6F034EFE4BB1853D77768DC91C": return PixelFormats.Bpp32Cmyk;
                case "24C3DD6F034EFE4BB1853D77768DC92C": return PixelFormats.Bpp40CmykAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC91F": return PixelFormats.Bpp64Cmyk;
                case "24C3DD6F034EFE4BB1853D77768DC92D": return PixelFormats.Bpp80CmykAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC920": return PixelFormats.Bpp24Channels3;
                case "24C3DD6F034EFE4BB1853D77768DC921": return PixelFormats.Bpp32Channels4;
                case "24C3DD6F034EFE4BB1853D77768DC922": return PixelFormats.Bpp40Channels5;
                case "24C3DD6F034EFE4BB1853D77768DC923": return PixelFormats.Bpp48Channels6;
                case "24C3DD6F034EFE4BB1853D77768DC924": return PixelFormats.Bpp56Channels7;
                case "24C3DD6F034EFE4BB1853D77768DC925": return PixelFormats.Bpp64Channels8;
                case "24C3DD6F034EFE4BB1853D77768DC92E": return PixelFormats.Bpp32Channels3Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC92F": return PixelFormats.Bpp40Channels4Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC930": return PixelFormats.Bpp48Channels5Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC931": return PixelFormats.Bpp56Channels6Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC932": return PixelFormats.Bpp64Channels7Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC933": return PixelFormats.Bpp72Channels8Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC926": return PixelFormats.Bpp48Channels3;
                case "24C3DD6F034EFE4BB1853D77768DC927": return PixelFormats.Bpp64Channels4;
                case "24C3DD6F034EFE4BB1853D77768DC928": return PixelFormats.Bpp80Channels5;
                case "24C3DD6F034EFE4BB1853D77768DC929": return PixelFormats.Bpp96Channels6;
                case "24C3DD6F034EFE4BB1853D77768DC92A": return PixelFormats.Bpp112Channels7;
                case "24C3DD6F034EFE4BB1853D77768DC92B": return PixelFormats.Bpp128Channels8;
                case "24C3DD6F034EFE4BB1853D77768DC934": return PixelFormats.Bpp64Channels3Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC935": return PixelFormats.Bpp80Channels4Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC936": return PixelFormats.Bpp96Channels5Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC937": return PixelFormats.Bpp112Channels6Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC938": return PixelFormats.Bpp128Channels7Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC939": return PixelFormats.Bpp144Channels8Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC908": return PixelFormats.Bpp8Gray;
                case "24C3DD6F034EFE4BB1853D77768DC90B": return PixelFormats.Bpp16Gray;
                case "24C3DD6F034EFE4BB1853D77768DC913": return PixelFormats.Bpp16GrayFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC93E": return PixelFormats.Bpp16GrayHalf;
                case "24C3DD6F034EFE4BB1853D77768DC93F": return PixelFormats.Bpp32GrayFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC911": return PixelFormats.Bpp32GrayFloat;
                case "24C3DD6F034EFE4BB1853D77768DC905": return PixelFormats.BlackWhite;
                case "24C3DD6F034EFE4BB1853D77768DC909": return PixelFormats.Bpp16Bgr555;
                case "24C3DD6F034EFE4BB1853D77768DC90A": return PixelFormats.Bpp16Bgr565;
                case "24C3DD6F034EFE4BB1853D77768DC914": return PixelFormats.Bpp32Bgr101010;
                case "24C3DD6F034EFE4BB1853D77768DC93D": return PixelFormats.Bpp32RgbExponent;
                case "24C3DD6F034EFE4BB1853D77768DC954": return PixelFormats.Bpp32CmykDirect;
                case "24C3DD6F034EFE4BB1853D77768DC955": return PixelFormats.Bpp64CmykDirect;
                case "24C3DD6F034EFE4BB1853D77768DC956": return PixelFormats.Bpp40CmykDirectAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC943": return PixelFormats.Bpp80CmykDirectAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC944": return PixelFormats.Bpp12Ycc420;
                case "24C3DD6F034EFE4BB1853D77768DC945": return PixelFormats.Bpp16Ycc422;
                case "24C3DD6F034EFE4BB1853D77768DC946": return PixelFormats.Bpp20Ycc422;
                case "24C3DD6F034EFE4BB1853D77768DC947": return PixelFormats.Bpp32Ycc422;
                case "24C3DD6F034EFE4BB1853D77768DC948": return PixelFormats.Bpp24Ycc444;
                case "24C3DD6F034EFE4BB1853D77768DC949": return PixelFormats.Bpp30Ycc444;
                case "24C3DD6F034EFE4BB1853D77768DC94A": return PixelFormats.Bpp48Ycc444;
                case "24C3DD6F034EFE4BB1853D77768DC94B": return PixelFormats.Bpp48Ycc444FixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC94C": return PixelFormats.Bpp20Ycc420Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC94D": return PixelFormats.Bpp24Ycc422Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC94E": return PixelFormats.Bpp30Ycc422Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC94F": return PixelFormats.Bpp48Ycc422Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC950": return PixelFormats.Bpp32Ycc444Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC951": return PixelFormats.Bpp40Ycc444Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC952": return PixelFormats.Bpp64Ycc444Alpha;
                case "24C3DD6F034EFE4BB1853D77768DC953": return PixelFormats.Bpp64Ycc444AlphaFixedPoint;
                default:
                    throw 'Unexpected ID for pixel format.';
            }
        }
    }
}