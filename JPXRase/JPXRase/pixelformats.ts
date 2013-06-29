module JxrPicturase {
    export enum ColorFormat {
	    YOnly = 0,
        Yuv420 = 1,
        Yuv422 = 2,
        Yuv444 = 3,
        Cmyk = 4,
        //CmykDirect = 5,
        NComponent = 6, 

        //formats for external
        Rgb = 7, 
        RgbExtended = 8
    }

    export enum BitDepth {
        //regular ones
        Bit1, //White is foreground
        Bit8, Bit16, Bit16S, Bit16F, Bit32, Bit32S, Bit32F,

        //irregular ones
        Bit5, Bit10, Bit565,

        Bit1Alt = 0xf //Black is foreground
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
        static get PixelFormatDontCare() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 8, false, false, false); }

        // Gray
        //static get PixelFormat2bppGray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 2, false, false, false); }
        //static get PixelFormat4bppGray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 4, false, false, false); }

        static get PixelFormatBlackWhite() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit1, 1, false, false, false); }
        static get PixelFormat8bppGray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit8, 8, false, false, false); }
        static get PixelFormat16bppGray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit16, 16, false, false, false); }
        static get PixelFormat16bppGrayFixedPoint() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit16S, 16, false, false, false); }
        static get PixelFormat16bppGrayHalf() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit16F, 16, false, false, false); }
        //static get PixelFormat32bppGray() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit32, 32, false, false, false); }
        static get PixelFormat32bppGrayFixedPoint() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit32S, 32, false, false, false); }
        static get PixelFormat32bppGrayFloat() { return new PixelFormat(1, ColorFormat.YOnly, BitDepth.Bit32F, 32, false, false, false); }

        // RGB
        static get PixelFormat24bppRgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 24, false, false, false); }
        static get PixelFormat24bppBgr() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 24, false, false, true); }
        static get PixelFormat32bppRgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 32, false, false, false); }
        static get PixelFormat32bppBgr() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit8, 32, false, false, true); }
        static get PixelFormat48bppRgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16, 48, false, false, false); }
        static get PixelFormat48bppRgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16S, 48, false, false, false); }
        static get PixelFormat48bppRgbHalf() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16F, 48, false, false, false); }
        static get PixelFormat64bppRgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16S, 64, false, false, false); }
        static get PixelFormat64bppRgbHalf() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit16F, 64, false, false, false); }
        //static get PixelFormat96bppRgb() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32, 96, false, false, false); }
        static get PixelFormat96bppRgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32S, 96, false, false, false); }
        static get PixelFormat96bppRgbFloat() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32F, 96, false, false, false); }
        static get PixelFormat128bppRgbFixedPoint() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32S, 128, false, false, false); }
        static get PixelFormat128bppRgbFloat() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit32F, 128, false, false, false); }

        // RGBA
        static get PixelFormat32bppBgra() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, false, true); }
        static get PixelFormat32bppRgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, false, false); }
        static get PixelFormat64bppRgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16, 64, true, false, false); }
        static get PixelFormat64bppRgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16S, 64, true, false, false); }
        static get PixelFormat64bppRgbaHalf() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16F, 64, true, false, false); }
        //static get PixelFormat128bppRgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32, 128, true, false, false); }
        static get PixelFormat128bppRgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32S, 128, true, false, false); }
        static get PixelFormat128bppRgbaFloat() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32F, 128, true, false, false); }

        // PRGBA
        static get PixelFormat32bppPbgra() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, true, true); }
        static get PixelFormat32bppPrgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit8, 32, true, true, false); }
        static get PixelFormat64bppPrgba() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16, 64, true, true, false); }
        //static get PixelFormat64bppPrgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16S, 64, true, false, false); }
        //static get PixelFormat64bppPrgbaHalf() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit16F, 64, true, false, false); }
        //static get PixelFormat128bppPrgbaFixedPoint() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32S, 128, true, false, false); }
        static get PixelFormat128bppPrgbaFloat() { return new PixelFormat(4, ColorFormat.Rgb, BitDepth.Bit32F, 128, true, true, false); }

        // Packed formats
        static get PixelFormat16bppRgb555() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit5, 16, false, false, false); }
        static get PixelFormat16bppRgb565() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit565, 16, false, false, false); }
        static get PixelFormat32bppRgb101010() { return new PixelFormat(3, ColorFormat.Rgb, BitDepth.Bit10, 32, false, false, false); }

        // CMYK
        static get PixelFormat32bppCmyk() { return new PixelFormat(4, ColorFormat.Cmyk, BitDepth.Bit8, 32, false, false, false); }
        static get PixelFormat40bppCmykAlpha() { return new PixelFormat(5, ColorFormat.Cmyk, BitDepth.Bit8, 40, true, false, false); }

        static get PixelFormat64bppCmyk() { return new PixelFormat(4, ColorFormat.Cmyk, BitDepth.Bit16, 64, false, false, false); }
        static get PixelFormat80bppCmykAlpha() { return new PixelFormat(5, ColorFormat.Cmyk, BitDepth.Bit16, 80, true, false, false); }

        // N_CHANNEL
        static get PixelFormat24bpp3Channels() { return new PixelFormat(3, ColorFormat.NComponent, BitDepth.Bit8, 24, false, false, false); }
        static get PixelFormat32bpp4Channels() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit8, 32, false, false, false); }
        static get PixelFormat40bpp5Channels() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit8, 40, false, false, false); }
        static get PixelFormat48bpp6Channels() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit8, 48, false, false, false); }
        static get PixelFormat56bpp7Channels() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit8, 56, false, false, false); }
        static get PixelFormat64bpp8Channels() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit8, 64, false, false, false); }
        
        static get PixelFormat32bpp3ChannelsAlpha() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit8, 32, true, false, false); }
        static get PixelFormat40bpp4ChannelsAlpha() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit8, 40, true, false, false); }
        static get PixelFormat48bpp5ChannelsAlpha() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit8, 48, true, false, false); }
        static get PixelFormat56bpp6ChannelsAlpha() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit8, 56, true, false, false); }
        static get PixelFormat64bpp7ChannelsAlpha() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit8, 64, true, false, false); }
        static get PixelFormat72bpp8ChannelsAlpha() { return new PixelFormat(9, ColorFormat.NComponent, BitDepth.Bit8, 72, true, false, false); }

        static get PixelFormat48bpp3Channels() { return new PixelFormat(3, ColorFormat.NComponent, BitDepth.Bit16, 48, false, false, false); }
        static get PixelFormat64bpp4Channels() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit16, 64, false, false, false); }
        static get PixelFormat80bpp5Channels() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit16, 80, false, false, false); }
        static get PixelFormat96bpp6Channels() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit16, 96, false, false, false); }
        static get PixelFormat112bpp7Channels() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit16, 112, false, false, false); }
        static get PixelFormat128bpp8Channels() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit16, 128, false, false, false); }

        static get PixelFormat64bpp3ChannelsAlpha() { return new PixelFormat(4, ColorFormat.NComponent, BitDepth.Bit16, 64, true, false, false); }
        static get PixelFormat80bpp4ChannelsAlpha() { return new PixelFormat(5, ColorFormat.NComponent, BitDepth.Bit16, 80, true, false, false); }
        static get PixelFormat96bpp5ChannelsAlpha() { return new PixelFormat(6, ColorFormat.NComponent, BitDepth.Bit16, 96, true, false, false); }
        static get PixelFormat112bpp6ChannelsAlpha() { return new PixelFormat(7, ColorFormat.NComponent, BitDepth.Bit16, 112, true, false, false); }
        static get PixelFormat128bpp7ChannelsAlpha() { return new PixelFormat(8, ColorFormat.NComponent, BitDepth.Bit16, 128, true, false, false); }
        static get PixelFormat144bpp8ChannelsAlpha() { return new PixelFormat(9, ColorFormat.NComponent, BitDepth.Bit16, 144, true, false, false); }

        //RGBE
        static get PixelFormat32bppRgbExtended() { return new PixelFormat(4, ColorFormat.RgbExtended, BitDepth.Bit8, 32, false, false, false); }

        //YUV
        static get PixelFormat12bppYuv420() { return new PixelFormat(3, ColorFormat.Yuv420, BitDepth.Bit8, 48, false, false, false); }
        static get PixelFormat16bppYuv422() { return new PixelFormat(3, ColorFormat.Yuv422, BitDepth.Bit8, 32, false, false, false); }
        static get PixelFormat24bppYuv444() { return new PixelFormat(3, ColorFormat.Yuv444, BitDepth.Bit8, 24, false, false, false); }


        static getPixelFormatByGuid(guid: String) {
            switch (guid) {
                case "6FDDC3244E034BFEB1853D77768DC900": return PixelFormats.PixelFormatDontCare;

                /* Indexed formats */
                //case "6FDDC3244E034BFEB1853D77768DC901": return PixelFormats.PixelFormat1bppIndexed
                //case "6FDDC3244E034BFEB1853D77768DC902": return PixelFormats.PixelFormat2bppIndexed
                //case "6FDDC3244E034BFEB1853D77768DC903": return PixelFormats.PixelFormat4bppIndexed
                //case "6FDDC3244E034BFEB1853D77768DC904": return PixelFormats.PixelFormat8bppIndexed

                case "6FDDC3244E034BFEB1853D77768DC905": return PixelFormats.PixelFormatBlackWhite;
                //case "6FDDC3244E034BFEB1853D77768DC906": return PixelFormats.PixelFormat2bppGray
                //case "6FDDC3244E034BFEB1853D77768DC907": return PixelFormats.PixelFormat4bppGray
                case "6FDDC3244E034BFEB1853D77768DC908": return PixelFormats.PixelFormat8bppGray;

                /* sRGB formats (gamma is approx. 2.2) */
                /* For a full definition, see the sRGB spec */

                /* 16bpp formats */
                case "6FDDC3244E034BFEB1853D77768DC909": return PixelFormats.PixelFormat16bppRgb555;
                case "6FDDC3244E034BFEB1853D77768DC90A": return PixelFormats.PixelFormat16bppRgb565;
                case "6FDDC3244E034BFEB1853D77768DC90B": return PixelFormats.PixelFormat16bppGray;

                /* 24bpp formats */
                case "6FDDC3244E034BFEB1853D77768DC90C": return PixelFormats.PixelFormat24bppBgr;
                case "6FDDC3244E034BFEB1853D77768DC90D": return PixelFormats.PixelFormat24bppRgb;

                /* 32bpp format */
                case "6FDDC3244E034BFEB1853D77768DC90E": return PixelFormats.PixelFormat32bppBgr;
                case "6FDDC3244E034BFEB1853D77768DC90F": return PixelFormats.PixelFormat32bppBgra;
                case "6FDDC3244E034BFEB1853D77768DC910": return PixelFormats.PixelFormat32bppPbgra;
                case "6FDDC3244E034BFEB1853D77768DC911": return PixelFormats.PixelFormat32bppGrayFloat;
                case "D98C6B953EFE47D6BB25EB1748AB0CF1": return PixelFormats.PixelFormat32bppRgb;
                case "F5C7AD2D6A8D43DDA7A8A29935261AE9": return PixelFormats.PixelFormat32bppRgba;
                case "3CC4A650A5274D37A9163142C7EBEDBA": return PixelFormats.PixelFormat32bppPrgba;

                /* 48bpp format */
                case "6FDDC3244E034BFEB1853D77768DC912": return PixelFormats.PixelFormat48bppRgbFixedPoint;

                /* scRGB formats. Gamma is 1.0 */
                /* For a full definition, see the scRGB spec */

                /* 16bpp format */
                case "6FDDC3244E034BFEB1853D77768DC913": return PixelFormats.PixelFormat16bppGrayFixedPoint;

                /* 32bpp format */
                case "6FDDC3244E034BFEB1853D77768DC914": return PixelFormats.PixelFormat32bppRgb101010;

                /* 48bpp format */
                case "6FDDC3244E034BFEB1853D77768DC915": return PixelFormats.PixelFormat48bppRgb;

                /* 64bpp format */
                case "6FDDC3244E034BFEB1853D77768DC916": return PixelFormats.PixelFormat64bppRgba;
                case "6FDDC3244E034BFEB1853D77768DC917": return PixelFormats.PixelFormat64bppPrgba;

                /* 96bpp format */
                case "6FDDC3244E034BFEB1853D77768DC918": return PixelFormats.PixelFormat96bppRgbFixedPoint;
                case "E3FED78FE8DB4ACF84C1E97F6136B327": return PixelFormats.PixelFormat96bppRgbFloat;

                /* Floating point scRGB formats */
                case "6FDDC3244E034BFEB1853D77768DC919": return PixelFormats.PixelFormat128bppRgbaFloat;
                case "6FDDC3244E034BFEB1853D77768DC91A": return PixelFormats.PixelFormat128bppPrgbaFloat;
                case "6FDDC3244E034BFEB1853D77768DC91B": return PixelFormats.PixelFormat128bppRgbFloat;

                /* CMYK formats. */
                case "6FDDC3244E034BFEB1853D77768DC91C": return PixelFormats.PixelFormat32bppCmyk;

                /* Photon formats */
                case "6FDDC3244E034BFEB1853D77768DC91D": return PixelFormats.PixelFormat64bppRgbaFixedPoint;
                case "6FDDC3244E034BFEB1853D77768DC940": return PixelFormats.PixelFormat64bppRgbFixedPoint;
                case "6FDDC3244E034BFEB1853D77768DC91E": return PixelFormats.PixelFormat128bppRgbaFixedPoint;
                case "6FDDC3244E034BFEB1853D77768DC941": return PixelFormats.PixelFormat128bppRgbFixedPoint;

                case "6FDDC3244E034BFEB1853D77768DC93A": return PixelFormats.PixelFormat64bppRgbaHalf;
                case "6FDDC3244E034BFEB1853D77768DC942": return PixelFormats.PixelFormat64bppRgbHalf;
                case "6FDDC3244E034BFEB1853D77768DC93B": return PixelFormats.PixelFormat48bppRgbHalf;

                case "6FDDC3244E034BFEB1853D77768DC93D": return PixelFormats.PixelFormat32bppRgbExtended;

                case "6FDDC3244E034BFEB1853D77768DC93E": return PixelFormats.PixelFormat16bppGrayHalf;
                case "6FDDC3244E034BFEB1853D77768DC93F": return PixelFormats.PixelFormat32bppGrayFixedPoint;


                /* More CMYK formats and n-Channel formats */
                case "6FDDC3244E034BFEB1853D77768DC91F": return PixelFormats.PixelFormat64bppCmyk;

                case "6FDDC3244E034BFEB1853D77768DC920": return PixelFormats.PixelFormat24bpp3Channels;
                case "6FDDC3244E034BFEB1853D77768DC921": return PixelFormats.PixelFormat32bpp4Channels;
                case "6FDDC3244E034BFEB1853D77768DC922": return PixelFormats.PixelFormat40bpp5Channels;
                case "6FDDC3244E034BFEB1853D77768DC923": return PixelFormats.PixelFormat48bpp6Channels;
                case "6FDDC3244E034BFEB1853D77768DC924": return PixelFormats.PixelFormat56bpp7Channels;
                case "6FDDC3244E034BFEB1853D77768DC925": return PixelFormats.PixelFormat64bpp8Channels;

                case "6FDDC3244E034BFEB1853D77768DC926": return PixelFormats.PixelFormat48bpp3Channels;
                case "6FDDC3244E034BFEB1853D77768DC927": return PixelFormats.PixelFormat64bpp4Channels;
                case "6FDDC3244E034BFEB1853D77768DC928": return PixelFormats.PixelFormat80bpp5Channels;
                case "6FDDC3244E034BFEB1853D77768DC929": return PixelFormats.PixelFormat96bpp6Channels;
                case "6FDDC3244E034BFEB1853D77768DC92A": return PixelFormats.PixelFormat112bpp7Channels;
                case "6FDDC3244E034BFEB1853D77768DC92B": return PixelFormats.PixelFormat128bpp8Channels;

                case "6FDDC3244E034BFEB1853D77768DC92C": return PixelFormats.PixelFormat40bppCmykAlpha;
                case "6FDDC3244E034BFEB1853D77768DC92D": return PixelFormats.PixelFormat80bppCmykAlpha;

                case "6FDDC3244E034BFEB1853D77768DC92E": return PixelFormats.PixelFormat32bpp3ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC92F": return PixelFormats.PixelFormat40bpp4ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC930": return PixelFormats.PixelFormat48bpp5ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC931": return PixelFormats.PixelFormat56bpp6ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC932": return PixelFormats.PixelFormat64bpp7ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC933": return PixelFormats.PixelFormat72bpp8ChannelsAlpha;

                case "6FDDC3244E034BFEB1853D77768DC934": return PixelFormats.PixelFormat64bpp3ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC935": return PixelFormats.PixelFormat80bpp4ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC936": return PixelFormats.PixelFormat96bpp5ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC937": return PixelFormats.PixelFormat112bpp6ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC938": return PixelFormats.PixelFormat128bpp7ChannelsAlpha;
                case "6FDDC3244E034BFEB1853D77768DC939": return PixelFormats.PixelFormat144bpp8ChannelsAlpha;

                /* YCrCb  from Advanced Profile */
                case "6FDDC3244E034BFEB1853D77768DC944": //return PixelFormats.PixelFormat12bppYcc420
                case "6FDDC3244E034BFEB1853D77768DC945": //return PixelFormats.PixelFormat16bppYcc422
                case "6FDDC3244E034BFEB1853D77768DC946": //return PixelFormats.PixelFormat20bppYcc422
                case "6FDDC3244E034BFEB1853D77768DC947": //return PixelFormats.PixelFormat32bppYcc422
                case "6FDDC3244E034BFEB1853D77768DC948": //return PixelFormats.PixelFormat24bppYcc444
                case "6FDDC3244E034BFEB1853D77768DC949": //return PixelFormats.PixelFormat30bppYcc444
                case "6FDDC3244E034BFEB1853D77768DC94A": //return PixelFormats.PixelFormat48bppYcc444
                case "6FDDC3244E034BFEB1853D77768DC94B": //return PixelFormats.PixelFormat16bpp48bppYcc444FixedPoint
                case "6FDDC3244E034BFEB1853D77768DC94C": //return PixelFormats.PixelFormat20bppYcc420Alpha
                case "6FDDC3244E034BFEB1853D77768DC94D": //return PixelFormats.PixelFormat24bppYcc422Alpha
                case "6FDDC3244E034BFEB1853D77768DC94E": //return PixelFormats.PixelFormat30bppYcc422Alpha
                case "6FDDC3244E034BFEB1853D77768DC94F": //return PixelFormats.PixelFormat48bppYcc422Alpha
                case "6FDDC3244E034BFEB1853D77768DC950": //return PixelFormats.PixelFormat32bppYcc444Alpha
                case "6FDDC3244E034BFEB1853D77768DC951": //return PixelFormats.PixelFormat40bppYcc444Alpha
                case "6FDDC3244E034BFEB1853D77768DC952": //return PixelFormats.PixelFormat64bppYcc444Alpha
                case "6FDDC3244E034BFEB1853D77768DC953": //return PixelFormats.PixelFormat64bppYcc444AlphaFixedPoint

                //YUV
                //#define GUID_PKPixelFormat12bppYuv420 GUID_PKPixelFormat12bppYcc420
                //#define GUID_PKPixelFormat16bppYuv422 GUID_PKPixelFormat16bppYcc422
                //#define GUID_PKPixelFormat24bppYuv444 GUID_PKPixelFormat24bppYcc444

                /* CmykDirect from Advanced Profile */
                case "6FDDC3244E034BFEB1853D77768DC954": //return PixelFormats.PixelFormat32bppCmykDirect
                case "6FDDC3244E034BFEB1853D77768DC955": //return PixelFormats.PixelFormat64bppCmykDirect
                case "6FDDC3244E034BFEB1853D77768DC956": //return PixelFormats.PixelFormat40bppCmykDirectAlpha
                case "6FDDC3244E034BFEB1853D77768DC943": //return PixelFormats.PixelFormat80bppCmykDirectAlpha
                    throw 'The pixel format for the ID is recognized but not supported';
                default:
                    throw 'Unexpected ID for pixel format.';
            }
        }
    }
}