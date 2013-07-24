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

    export enum NumberType {
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
            public channelCount: number,
            public hasAlpha: Boolean,
            public bitDepthPerChannel: BitDepth,
            public colorDataType: NumberType,
            public colorFormat: ColorFormat
            ) {
        }

        isEqualFormat(format: PixelFormat) {
            return (format.channelCount == this.channelCount
                && format.hasAlpha == this.hasAlpha
                && format.bitDepthPerChannel == this.bitDepthPerChannel
                && format.colorDataType == this.colorDataType
                && format.colorFormat == this.colorFormat);
        }
    }

    export class PixelFormats {
        static get Bpp24Rgb() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp24Bgr() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp32Bgr() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp48Rgb() { return new PixelFormat(3, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp48RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit16S, NumberType.Int, ColorFormat.Rgb); }
        static get Bpp48RgbHalf() { return new PixelFormat(3, false, BitDepth.Bit16F, NumberType.Float, ColorFormat.Rgb); }
        static get Bpp96RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit32S, NumberType.Int, ColorFormat.Rgb); }
        static get Bpp64RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit16S, NumberType.Int, ColorFormat.Rgb); }
        static get Bpp64RgbHalf() { return new PixelFormat(3, false, BitDepth.Bit16F, NumberType.Float, ColorFormat.Rgb); }
        static get Bpp128RgbFixedPoint() { return new PixelFormat(3, false, BitDepth.Bit32S, NumberType.Int, ColorFormat.Rgb); }
        static get Bpp128RgbFloat() { return new PixelFormat(3, false, BitDepth.Bit32F, NumberType.Float, ColorFormat.Rgb); }
        static get Bpp32Bgra() { return new PixelFormat(4, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp64Rgba() { return new PixelFormat(4, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp64RgbaFixedPoint() { return new PixelFormat(4, true, BitDepth.Bit16S, NumberType.Int, ColorFormat.Rgb); }
        static get Bpp64RgbaHalf() { return new PixelFormat(4, true, BitDepth.Bit16F, NumberType.Float, ColorFormat.Rgb); }
        static get Bpp128RgbaFixedPoint() { return new PixelFormat(4, true, BitDepth.Bit32S, NumberType.Int, ColorFormat.Rgb); }
        static get Bpp128RgbaFloat() { return new PixelFormat(4, true, BitDepth.Bit32F, NumberType.Float, ColorFormat.Rgb); }
        static get Bpp32Pbgra() { return new PixelFormat(4, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp64Prgba() { return new PixelFormat(4, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp128PrgbaFloat() { return new PixelFormat(4, true, BitDepth.Bit32F, NumberType.Float, ColorFormat.Rgb); }
        static get Bpp32CMYK() { return new PixelFormat(4, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Cmyk); }
        static get Bpp40CMYKAlpha() { return new PixelFormat(5, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.Cmyk); }
        static get Bpp64CMYK() { return new PixelFormat(4, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.Cmyk); }
        static get Bpp80CMYKAlpha() { return new PixelFormat(5, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.Cmyk); }
        static get Bpp243Channels() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp324Channels() { return new PixelFormat(4, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp405Channels() { return new PixelFormat(5, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp486Channels() { return new PixelFormat(6, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp567Channels() { return new PixelFormat(7, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp648Channels() { return new PixelFormat(8, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp323ChannelsAlpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp404ChannelsAlpha() { return new PixelFormat(5, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp485ChannelsAlpha() { return new PixelFormat(6, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp566ChannelsAlpha() { return new PixelFormat(7, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp647ChannelsAlpha() { return new PixelFormat(8, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp728ChannelsAlpha() { return new PixelFormat(9, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp483Channels() { return new PixelFormat(3, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp644Channels() { return new PixelFormat(4, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp805Channels() { return new PixelFormat(5, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp966Channels() { return new PixelFormat(6, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp1127Channels() { return new PixelFormat(7, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp1288Channels() { return new PixelFormat(8, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp643ChannelsAlpha() { return new PixelFormat(4, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp804ChannelsAlpha() { return new PixelFormat(5, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp965ChannelsAlpha() { return new PixelFormat(6, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp1126ChannelsAlpha() { return new PixelFormat(7, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp1287ChannelsAlpha() { return new PixelFormat(8, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp1448ChannelsAlpha() { return new PixelFormat(9, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.NComponent); }
        static get Bpp8Gray() { return new PixelFormat(1, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.YOnly); }
        static get Bpp16Gray() { return new PixelFormat(1, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.YOnly); }
        static get Bpp16GrayFixedPoint() { return new PixelFormat(1, false, BitDepth.Bit16S, NumberType.Int, ColorFormat.YOnly); }
        static get Bpp16GrayHalf() { return new PixelFormat(1, false, BitDepth.Bit16F, NumberType.Float, ColorFormat.YOnly); }
        static get Bpp32GrayFixedPoint() { return new PixelFormat(1, false, BitDepth.Bit32S, NumberType.Int, ColorFormat.YOnly); }
        static get Bpp32GrayFloat() { return new PixelFormat(1, false, BitDepth.Bit32F, NumberType.Float, ColorFormat.YOnly); }
        static get BlackWhite() { return new PixelFormat(1, false, BitDepth.Bit1White1, NumberType.Uint, ColorFormat.YOnly); }
        static get Bpp16Bgr555() { return new PixelFormat(3, false, BitDepth.Bit5, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp16Bgr565() { return new PixelFormat(3, false, BitDepth.Bit565, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp32Bgr101010() { return new PixelFormat(3, false, BitDepth.Bit10, NumberType.Uint, ColorFormat.Rgb); }
        static get Bpp32RgbE() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Float, ColorFormat.RgbExponent); }
        static get Bpp32CmykDirect() { return new PixelFormat(4, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.CmykDirect); }
        static get Bpp64CmykDirect() { return new PixelFormat(4, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.CmykDirect); }
        static get Bpp40CmykDirectAlpha() { return new PixelFormat(5, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.CmykDirect); }
        static get Bpp80CmykDirectAlpha() { return new PixelFormat(5, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.CmykDirect); }
        static get Bpp12Ycc420() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Yuv420); }
        static get Bpp16Ycc422() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Yuv422); }
        static get Bpp20Ycc422() { return new PixelFormat(3, false, BitDepth.Bit10, NumberType.Uint, ColorFormat.Yuv422); }
        static get Bpp32Ycc422() { return new PixelFormat(3, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.Yuv422); }
        static get Bpp24Ycc444() { return new PixelFormat(3, false, BitDepth.Bit8, NumberType.Uint, ColorFormat.Yuv444); }
        static get Bpp30Ycc444() { return new PixelFormat(3, false, BitDepth.Bit10, NumberType.Uint, ColorFormat.Yuv444); }
        static get Bpp48Ycc444() { return new PixelFormat(3, false, BitDepth.Bit16, NumberType.Uint, ColorFormat.Yuv444); }
        static get Bpp48Ycc444FixedPoint() { return new PixelFormat(3, false, BitDepth.Bit16S, NumberType.Int, ColorFormat.Yuv444); }
        static get Bpp20Ycc420Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.Yuv420); }
        static get Bpp24Ycc422Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.Yuv422); }
        static get Bpp30Ycc422Alpha() { return new PixelFormat(4, true, BitDepth.Bit10, NumberType.Uint, ColorFormat.Yuv422); }
        static get Bpp48Ycc422Alpha() { return new PixelFormat(4, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.Yuv422); }
        static get Bpp32Ycc444Alpha() { return new PixelFormat(4, true, BitDepth.Bit8, NumberType.Uint, ColorFormat.Yuv444); }
        static get Bpp40Ycc444Alpha() { return new PixelFormat(4, true, BitDepth.Bit10, NumberType.Uint, ColorFormat.Yuv444); }
        static get Bpp64Ycc444Alpha() { return new PixelFormat(4, true, BitDepth.Bit16, NumberType.Uint, ColorFormat.Yuv444); }
        static get Bpp64Ycc444AlphaFixedPoint() { return new PixelFormat(4, true, BitDepth.Bit16S, NumberType.Int, ColorFormat.Yuv444); }

        static getPixelFormatByGuid(guid: String) {
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
                case "24C3DD6F034EFE4BB1853D77768DC91C": return PixelFormats.Bpp32CMYK;
                case "24C3DD6F034EFE4BB1853D77768DC92C": return PixelFormats.Bpp40CMYKAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC91F": return PixelFormats.Bpp64CMYK;
                case "24C3DD6F034EFE4BB1853D77768DC92D": return PixelFormats.Bpp80CMYKAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC920": return PixelFormats.Bpp243Channels;
                case "24C3DD6F034EFE4BB1853D77768DC921": return PixelFormats.Bpp324Channels;
                case "24C3DD6F034EFE4BB1853D77768DC922": return PixelFormats.Bpp405Channels;
                case "24C3DD6F034EFE4BB1853D77768DC923": return PixelFormats.Bpp486Channels;
                case "24C3DD6F034EFE4BB1853D77768DC924": return PixelFormats.Bpp567Channels;
                case "24C3DD6F034EFE4BB1853D77768DC925": return PixelFormats.Bpp648Channels;
                case "24C3DD6F034EFE4BB1853D77768DC92E": return PixelFormats.Bpp323ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC92F": return PixelFormats.Bpp404ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC930": return PixelFormats.Bpp485ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC931": return PixelFormats.Bpp566ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC932": return PixelFormats.Bpp647ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC933": return PixelFormats.Bpp728ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC926": return PixelFormats.Bpp483Channels;
                case "24C3DD6F034EFE4BB1853D77768DC927": return PixelFormats.Bpp644Channels;
                case "24C3DD6F034EFE4BB1853D77768DC928": return PixelFormats.Bpp805Channels;
                case "24C3DD6F034EFE4BB1853D77768DC929": return PixelFormats.Bpp966Channels;
                case "24C3DD6F034EFE4BB1853D77768DC92A": return PixelFormats.Bpp1127Channels;
                case "24C3DD6F034EFE4BB1853D77768DC92B": return PixelFormats.Bpp1288Channels;
                case "24C3DD6F034EFE4BB1853D77768DC934": return PixelFormats.Bpp643ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC935": return PixelFormats.Bpp804ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC936": return PixelFormats.Bpp965ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC937": return PixelFormats.Bpp1126ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC938": return PixelFormats.Bpp1287ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC939": return PixelFormats.Bpp1448ChannelsAlpha;
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
                case "24C3DD6F034EFE4BB1853D77768DC93D": return PixelFormats.Bpp32RgbE;
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