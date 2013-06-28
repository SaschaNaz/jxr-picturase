module JxrPicturase {
    export enum ColorFormat {
	    YOnly = 0,
        Yuv420 = 1,
        Yuv422 = 2,
        Yuv444 = 3,
        Cmyk = 4,
        //CmykDirect = 5,
        Ncomponent = 6, 

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
        formatGuid: number;
        channelCount: number;
        colorFormat: ColorFormat;
        bitDepth: BitDepth;
        bitUnit: number;
        grBit: number;

        //TIFF
        //interpretation: number;
        //samplePerPixel: number;
        //bitsPerSample: number;
        //sampleFormat: number;
    }

    export class PixelFormatDatabase{
        getPixelFormatByGuid(guid: number) {
            //switch {
            //    case 0x6FDDC324
            //}
        }
    }
}