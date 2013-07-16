var JxrPicturase;
(function (JxrPicturase) {
    (function (ColorFormat) {
        ColorFormat[ColorFormat["YOnly"] = 0] = "YOnly";
        ColorFormat[ColorFormat["Yuv420"] = 1] = "Yuv420";
        ColorFormat[ColorFormat["Yuv422"] = 2] = "Yuv422";
        ColorFormat[ColorFormat["Yuv444"] = 3] = "Yuv444";
        ColorFormat[ColorFormat["Cmyk"] = 4] = "Cmyk";

        ColorFormat[ColorFormat["Ncomponent"] = 6] = "Ncomponent";

        ColorFormat[ColorFormat["Rgb"] = 7] = "Rgb";

        ColorFormat[ColorFormat["RgbExtended"] = 8] = "RgbExtended";
    })(JxrPicturase.ColorFormat || (JxrPicturase.ColorFormat = {}));
    var ColorFormat = JxrPicturase.ColorFormat;

    (function (BitDepth) {
        BitDepth[BitDepth["Bit1"] = 0] = "Bit1";
        BitDepth[BitDepth["Bit8"] = 1] = "Bit8";
        BitDepth[BitDepth["Bit16"] = 2] = "Bit16";
        BitDepth[BitDepth["Bit16S"] = 3] = "Bit16S";
        BitDepth[BitDepth["Bit16F"] = 4] = "Bit16F";
        BitDepth[BitDepth["Bit32"] = 5] = "Bit32";
        BitDepth[BitDepth["Bit32S"] = 6] = "Bit32S";
        BitDepth[BitDepth["Bit32F"] = 7] = "Bit32F";

        BitDepth[BitDepth["Bit5"] = 8] = "Bit5";
        BitDepth[BitDepth["Bit10"] = 9] = "Bit10";
        BitDepth[BitDepth["Bit565"] = 10] = "Bit565";

        BitDepth[BitDepth["Bit1Alt"] = 0xf] = "Bit1Alt";
    })(JxrPicturase.BitDepth || (JxrPicturase.BitDepth = {}));
    var BitDepth = JxrPicturase.BitDepth;

    var PixelFormat = (function () {
        function PixelFormat() {
        }
        return PixelFormat;
    })();
    JxrPicturase.PixelFormat = PixelFormat;

    var PixelFormatDatabase = (function () {
        function PixelFormatDatabase() {
        }
        PixelFormatDatabase.prototype.getPixelFormatByGuid = function (guid) {
        };
        return PixelFormatDatabase;
    })();
    JxrPicturase.PixelFormatDatabase = PixelFormatDatabase;
})(JxrPicturase || (JxrPicturase = {}));
//@ sourceMappingURL=pixelformats.js.map
