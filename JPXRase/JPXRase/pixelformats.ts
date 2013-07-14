module JxrPicturase {
    export enum ColorFormat {
	    YOnly = 0,
        Yuv420 = 1,
        Yuv422 = 2,
        Yuv444 = 3,
        Cmyk = 4,
        CmykDirect = 5,
        NComponent = 6,
        Rgb = 7, 
        RgbExtended = 8
    }

    export enum InternalColorFormat {
        YOnly = 0,
        Yuv420 = 1,
        Yuv422 = 2,
        Yuv444 = 3,
        Yuvk = 4,
        NComponent = 6
    }

    export enum BitDepth {
        //regular ones
        Bit1White1, //White is foreground
        Bit8, Bit16, Bit16S, Bit16F, Bit32S = 6, Bit32F = 7,

        //irregular ones
        Bit5 = 8, Bit10 = 9, Bit565 = 10,

        Bit1Black1 = 0xf //Black is foreground
    }
    
    export class PixelFormat {
        constructor(
            public channelCount: number,
            public colorFormat: ColorFormat,
            public bitDepth: BitDepth,
            public bitsPerUnit: number,
            public hasAlpha: Boolean,
            public isPremultiplied: Boolean,
            public isBgr: Boolean) {
        }
        //TIFF
        //interpretation: number;
        //samplePerPixel: number;
        //bitsPerSample: number;
        //sampleFormat: number;
        isEqualFormat(format: PixelFormat) {
            return (format.channelCount == this.channelCount
                && format.colorFormat == this.colorFormat
                && format.bitDepth == this.bitDepth
                && format.bitsPerUnit == this.bitsPerUnit
                && format.hasAlpha == this.hasAlpha
                && format.isPremultiplied == this.isPremultiplied
                && format.isBgr == this.isBgr);
        }
    }

    export class PixelFormats{
        static get DontCare() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 8, false, false, false); }

        // Gray
        //static get Bpp2Gray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 2, false, false, false); }
        //static get Bpp4Gray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 4, false, false, false); }

        static get BlackWhite() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit1White1, 1, false, false, false); }
        static get Bpp8Gray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 8, false, false, false); }
        static get Bpp16Gray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit16, 16, false, false, false); }
        static get Bpp16GrayFixedPoint() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit16S, 16, false, false, false); }
        static get Bpp16GrayHalf() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit16F, 16, false, false, false); }
        //static get Bpp32Gray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit32, 32, false, false, false); }
        static get Bpp32GrayFixedPoint() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit32S, 32, false, false, false); }
        static get Bpp32GrayFloat() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit32F, 32, false, false, false); }

        // RGB
        static get Bpp24Rgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 24, false, false, false); }
        static get Bpp24Bgr() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 24, false, false, true); }
        static get Bpp32Rgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 32, false, false, false); }
        static get Bpp32Bgr() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 32, false, false, true); }
        static get Bpp48Rgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16, 48, false, false, false); }
        static get Bpp48RgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16S, 48, false, false, false); }
        static get Bpp48RgbHalf() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16F, 48, false, false, false); }
        static get Bpp64RgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16S, 64, false, false, false); }
        static get Bpp64RgbHalf() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16F, 64, false, false, false); }
        //static get Bpp96Rgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32, 96, false, false, false); }
        static get Bpp96RgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32S, 96, false, false, false); }
        static get Bpp96RgbFloat() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32F, 96, false, false, false); }
        static get Bpp128RgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32S, 128, false, false, false); }
        static get Bpp128RgbFloat() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32F, 128, false, false, false); }

        // RGBA
        static get Bpp32Bgra() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, false, true); }
        static get Bpp32Rgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, false, false); }
        static get Bpp64Rgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16, 64, true, false, false); }
        static get Bpp64RgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16S, 64, true, false, false); }
        static get Bpp64RgbaHalf() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16F, 64, true, false, false); }
        //static get Bpp128Rgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32, 128, true, false, false); }
        static get Bpp128RgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32S, 128, true, false, false); }
        static get Bpp128RgbaFloat() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32F, 128, true, false, false); }

        // PRGBA
        static get Bpp32Pbgra() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, true, true); }
        static get Bpp32Prgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, true, false); }
        static get Bpp64Prgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16, 64, true, true, false); }
        //static get Bpp64PrgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16S, 64, true, false, false); }
        //static get Bpp64PrgbaHalf() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16F, 64, true, false, false); }
        //static get Bpp128PrgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32S, 128, true, false, false); }
        static get Bpp128PrgbaFloat() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32F, 128, true, true, false); }

        // Packed formats
        static get Bpp16Rgb555() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit5, 16, false, false, false); }
        static get Bpp16Rgb565() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit565, 16, false, false, false); }
        static get Bpp32Rgb101010() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit10, 32, false, false, false); }

        // CMYK
        static get Bpp32Cmyk() { return new PixelFormat(4, ColorFormat.Cmyk, BitDepth.Bit8, 32, false, false, false); }
        static get Bpp40CmykAlpha() { return new PixelFormat(5, ColorFormat.Cmyk, BitDepth.Bit8, 40, true, false, false); }

        static get Bpp64Cmyk() { return new PixelFormat(4, ColorFormat.Cmyk, BitDepth.Bit16, 64, false, false, false); }
        static get Bpp80CmykAlpha() { return new PixelFormat(5, ColorFormat.Cmyk, BitDepth.Bit16, 80, true, false, false); }

        // N_CHANNEL
        static get Bpp243Channels() { return new PixelFormat(3, ColorFormat.NComponent, BitDepth.Bit8, 24, false, false, false); }
        static get Bpp324Channels() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit8, 32, false, false, false); }
        static get Bpp405Channels() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit8, 40, false, false, false); }
        static get Bpp486Channels() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit8, 48, false, false, false); }
        static get Bpp567Channels() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit8, 56, false, false, false); }
        static get Bpp648Channels() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit8, 64, false, false, false); }
        
        static get Bpp323ChannelsAlpha() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit8, 32, true, false, false); }
        static get Bpp404ChannelsAlpha() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit8, 40, true, false, false); }
        static get Bpp485ChannelsAlpha() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit8, 48, true, false, false); }
        static get Bpp566ChannelsAlpha() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit8, 56, true, false, false); }
        static get Bpp647ChannelsAlpha() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit8, 64, true, false, false); }
        static get Bpp728ChannelsAlpha() { return new PixelFormat(9, ColorFormat.NComponent, BitDepth.Bit8, 72, true, false, false); }

        static get Bpp483Channels() { return new PixelFormat(3, ColorFormat.NComponent, BitDepth.Bit16, 48, false, false, false); }
        static get Bpp644Channels() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit16, 64, false, false, false); }
        static get Bpp805Channels() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit16, 80, false, false, false); }
        static get Bpp966Channels() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit16, 96, false, false, false); }
        static get Bpp1127Channels() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit16, 112, false, false, false); }
        static get Bpp1288Channels() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit16, 128, false, false, false); }

        static get Bpp643ChannelsAlpha() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit16, 64, true, false, false); }
        static get Bpp804ChannelsAlpha() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit16, 80, true, false, false); }
        static get Bpp965ChannelsAlpha() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit16, 96, true, false, false); }
        static get Bpp1126ChannelsAlpha() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit16, 112, true, false, false); }
        static get Bpp1287ChannelsAlpha() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit16, 128, true, false, false); }
        static get Bpp1448ChannelsAlpha() { return new PixelFormat(9, ColorFormat.NComponent, BitDepth.Bit16, 144, true, false, false); }

        //RGBE
        static get Bpp32RgbExtended() { return new PixelFormat(4, ColorFormat.RgbExtended, BitDepth.Bit8, 32, false, false, false); }

        //YUV
        static get Bpp12Yuv420() { return new PixelFormat(3, ColorFormat.Yuv420, BitDepth.Bit8, 48, false, false, false); }
        static get Bpp16Yuv422() { return new PixelFormat(3, ColorFormat.Yuv422, BitDepth.Bit8, 32, false, false, false); }
        static get Bpp24Yuv444() { return new PixelFormat(3, ColorFormat.Yuv444, BitDepth.Bit8, 24, false, false, false); }


        static getPixelFormatByGuid(guid: String) {
            switch (guid) {
                case "24C3DD6F034EFE4BB1853D77768DC900": return PixelFormats.DontCare;

                /* Indexed formats */
                //case "24C3DD6F034EFE4BB1853D77768DC901": return PixelFormats.Bpp1Indexed
                //case "24C3DD6F034EFE4BB1853D77768DC902": return PixelFormats.Bpp2Indexed
                //case "24C3DD6F034EFE4BB1853D77768DC903": return PixelFormats.Bpp4Indexed
                //case "24C3DD6F034EFE4BB1853D77768DC904": return PixelFormats.Bpp8Indexed

                case "24C3DD6F034EFE4BB1853D77768DC905": return PixelFormats.BlackWhite;
                //case "24C3DD6F034EFE4BB1853D77768DC906": return PixelFormats.Bpp2Gray
                //case "24C3DD6F034EFE4BB1853D77768DC907": return PixelFormats.Bpp4Gray
                case "24C3DD6F034EFE4BB1853D77768DC908": return PixelFormats.Bpp8Gray;

                /* sRGB formats (gamma is approx. 2.2) */
                /* For a full definition, see the sRGB spec */

                /* 16bpp formats */
                case "24C3DD6F034EFE4BB1853D77768DC909": return PixelFormats.Bpp16Rgb555;
                case "24C3DD6F034EFE4BB1853D77768DC90A": return PixelFormats.Bpp16Rgb565;
                case "24C3DD6F034EFE4BB1853D77768DC90B": return PixelFormats.Bpp16Gray;

                /* 24bpp formats */
                case "24C3DD6F034EFE4BB1853D77768DC90C": return PixelFormats.Bpp24Bgr;
                case "24C3DD6F034EFE4BB1853D77768DC90D": return PixelFormats.Bpp24Rgb;

                /* 32bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC90E": return PixelFormats.Bpp32Bgr;
                case "24C3DD6F034EFE4BB1853D77768DC90F": return PixelFormats.Bpp32Bgra;
                case "24C3DD6F034EFE4BB1853D77768DC910": return PixelFormats.Bpp32Pbgra;
                case "24C3DD6F034EFE4BB1853D77768DC911": return PixelFormats.Bpp32GrayFloat;
                case "956B8CD9FE3ED647BB25EB1748AB0CF1": return PixelFormats.Bpp32Rgb;
                case "2DADC7F58D6ADD43A7A8A29935261AE9": return PixelFormats.Bpp32Rgba;
                case "50A6C43C27A5374DA9163142C7EBEDBA": return PixelFormats.Bpp32Prgba;

                /* 48bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC912": return PixelFormats.Bpp48RgbFixedPoint;

                /* scRGB formats. Gamma is 1.0 */
                /* For a full definition, see the scRGB spec */

                /* 16bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC913": return PixelFormats.Bpp16GrayFixedPoint;

                /* 32bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC914": return PixelFormats.Bpp32Rgb101010;

                /* 48bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC915": return PixelFormats.Bpp48Rgb;

                /* 64bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC916": return PixelFormats.Bpp64Rgba;
                case "24C3DD6F034EFE4BB1853D77768DC917": return PixelFormats.Bpp64Prgba;

                /* 96bpp format */
                case "24C3DD6F034EFE4BB1853D77768DC918": return PixelFormats.Bpp96RgbFixedPoint;
                case "8FD7FEE3DBE8CF4A84C1E97F6136B327": return PixelFormats.Bpp96RgbFloat;

                /* Floating point scRGB formats */
                case "24C3DD6F034EFE4BB1853D77768DC919": return PixelFormats.Bpp128RgbaFloat;
                case "24C3DD6F034EFE4BB1853D77768DC91A": return PixelFormats.Bpp128PrgbaFloat;
                case "24C3DD6F034EFE4BB1853D77768DC91B": return PixelFormats.Bpp128RgbFloat;

                /* CMYK formats. */
                case "24C3DD6F034EFE4BB1853D77768DC91C": return PixelFormats.Bpp32Cmyk;

                /* Photon formats */
                case "24C3DD6F034EFE4BB1853D77768DC91D": return PixelFormats.Bpp64RgbaFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC940": return PixelFormats.Bpp64RgbFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC91E": return PixelFormats.Bpp128RgbaFixedPoint;
                case "24C3DD6F034EFE4BB1853D77768DC941": return PixelFormats.Bpp128RgbFixedPoint;

                case "24C3DD6F034EFE4BB1853D77768DC93A": return PixelFormats.Bpp64RgbaHalf;
                case "24C3DD6F034EFE4BB1853D77768DC942": return PixelFormats.Bpp64RgbHalf;
                case "24C3DD6F034EFE4BB1853D77768DC93B": return PixelFormats.Bpp48RgbHalf;

                case "24C3DD6F034EFE4BB1853D77768DC93D": return PixelFormats.Bpp32RgbExtended;

                case "24C3DD6F034EFE4BB1853D77768DC93E": return PixelFormats.Bpp16GrayHalf;
                case "24C3DD6F034EFE4BB1853D77768DC93F": return PixelFormats.Bpp32GrayFixedPoint;


                /* More CMYK formats and n-Channel formats */
                case "24C3DD6F034EFE4BB1853D77768DC91F": return PixelFormats.Bpp64Cmyk;

                case "24C3DD6F034EFE4BB1853D77768DC920": return PixelFormats.Bpp243Channels;
                case "24C3DD6F034EFE4BB1853D77768DC921": return PixelFormats.Bpp324Channels;
                case "24C3DD6F034EFE4BB1853D77768DC922": return PixelFormats.Bpp405Channels;
                case "24C3DD6F034EFE4BB1853D77768DC923": return PixelFormats.Bpp486Channels;
                case "24C3DD6F034EFE4BB1853D77768DC924": return PixelFormats.Bpp567Channels;
                case "24C3DD6F034EFE4BB1853D77768DC925": return PixelFormats.Bpp648Channels;

                case "24C3DD6F034EFE4BB1853D77768DC926": return PixelFormats.Bpp483Channels;
                case "24C3DD6F034EFE4BB1853D77768DC927": return PixelFormats.Bpp644Channels;
                case "24C3DD6F034EFE4BB1853D77768DC928": return PixelFormats.Bpp805Channels;
                case "24C3DD6F034EFE4BB1853D77768DC929": return PixelFormats.Bpp966Channels;
                case "24C3DD6F034EFE4BB1853D77768DC92A": return PixelFormats.Bpp1127Channels;
                case "24C3DD6F034EFE4BB1853D77768DC92B": return PixelFormats.Bpp1288Channels;

                case "24C3DD6F034EFE4BB1853D77768DC92C": return PixelFormats.Bpp40CmykAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC92D": return PixelFormats.Bpp80CmykAlpha;

                case "24C3DD6F034EFE4BB1853D77768DC92E": return PixelFormats.Bpp323ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC92F": return PixelFormats.Bpp404ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC930": return PixelFormats.Bpp485ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC931": return PixelFormats.Bpp566ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC932": return PixelFormats.Bpp647ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC933": return PixelFormats.Bpp728ChannelsAlpha;

                case "24C3DD6F034EFE4BB1853D77768DC934": return PixelFormats.Bpp643ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC935": return PixelFormats.Bpp804ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC936": return PixelFormats.Bpp965ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC937": return PixelFormats.Bpp1126ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC938": return PixelFormats.Bpp1287ChannelsAlpha;
                case "24C3DD6F034EFE4BB1853D77768DC939": return PixelFormats.Bpp1448ChannelsAlpha;

                /* YCrCb  from Advanced Profile */
                case "24C3DD6F034EFE4BB1853D77768DC944": //return PixelFormats.Bpp12Ycc420
                case "24C3DD6F034EFE4BB1853D77768DC945": //return PixelFormats.Bpp16Ycc422
                case "24C3DD6F034EFE4BB1853D77768DC946": //return PixelFormats.Bpp20Ycc422
                case "24C3DD6F034EFE4BB1853D77768DC947": //return PixelFormats.Bpp32Ycc422
                case "24C3DD6F034EFE4BB1853D77768DC948": //return PixelFormats.Bpp24Ycc444
                case "24C3DD6F034EFE4BB1853D77768DC949": //return PixelFormats.Bpp30Ycc444
                case "24C3DD6F034EFE4BB1853D77768DC94A": //return PixelFormats.Bpp48Ycc444
                case "24C3DD6F034EFE4BB1853D77768DC94B": //return PixelFormats.Bpp1648Ycc444FixedPoint
                case "24C3DD6F034EFE4BB1853D77768DC94C": //return PixelFormats.Bpp20Ycc420Alpha
                case "24C3DD6F034EFE4BB1853D77768DC94D": //return PixelFormats.Bpp24Ycc422Alpha
                case "24C3DD6F034EFE4BB1853D77768DC94E": //return PixelFormats.Bpp30Ycc422Alpha
                case "24C3DD6F034EFE4BB1853D77768DC94F": //return PixelFormats.Bpp48Ycc422Alpha
                case "24C3DD6F034EFE4BB1853D77768DC950": //return PixelFormats.Bpp32Ycc444Alpha
                case "24C3DD6F034EFE4BB1853D77768DC951": //return PixelFormats.Bpp40Ycc444Alpha
                case "24C3DD6F034EFE4BB1853D77768DC952": //return PixelFormats.Bpp64Ycc444Alpha
                case "24C3DD6F034EFE4BB1853D77768DC953": //return PixelFormats.Bpp64Ycc444AlphaFixedPoint

                //YUV
                //#define GUID_PKPixelFormat12Yuv420 GUID_PKPixelFormat12Ycc420
                //#define GUID_PKPixelFormat16Yuv422 GUID_PKPixelFormat16Ycc422
                //#define GUID_PKPixelFormat24Yuv444 GUID_PKPixelFormat24Ycc444

                /* CmykDirect from Advanced Profile */
                case "24C3DD6F034EFE4BB1853D77768DC954": //return PixelFormats.Bpp32CmykDirect
                case "24C3DD6F034EFE4BB1853D77768DC955": //return PixelFormats.Bpp64CmykDirect
                case "24C3DD6F034EFE4BB1853D77768DC956": //return PixelFormats.Bpp40CmykDirectAlpha
                case "24C3DD6F034EFE4BB1853D77768DC943": //return PixelFormats.Bpp80CmykDirectAlpha
                    throw 'The pixel format for the ID is recognized but not supported';
                default:
                    throw 'Unexpected ID for pixel format.';
            }
        }
    }
}