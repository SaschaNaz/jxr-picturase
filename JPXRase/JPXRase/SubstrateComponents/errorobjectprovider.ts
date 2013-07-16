///<reference path="imageheader.ts"/>
///<reference path="imageplaneheader.ts"/>
module JxrPicturase.SubstrateComponents {
    /** Validate JPEG XR header as Rec. ITU-T T.832 (01/2012) */
    export class ErrorObjectProvider {
        static getErrorObject(specNumber: String, message: String) {
            return new Error("JXR Picturase: Failed to digest the image which has a problem. "
                + message + ", as JPEG XR specification ITU-T T.832 (01/2012) " + specNumber);
        }
    }

    export class HeaderErrors {
        static get IndexTableError() {
            return ErrorObjectProvider.getErrorObject("8.3.9", "If FREQUENCY_MODE_CODESTREAM_FLAG is equal to TRUE, or NUM_VER_TILES_MINUS1 is greater than 0, or NUM_HOR_TILES_MINUS1 is greater than 0, it is a requirement of codestream conformance that INDEX_TABLE_PRESENT_FLAG shall be equal to TRUE.If FREQUENCY_MODE_CODESTREAM_FLAG is equal to TRUE, or NUM_VER_TILES_MINUS1 is greater than 0, or NUM_HOR_TILES_MINUS1 is greater than 0, it is a requirement of codestream conformance that INDEX_TABLE_PRESENT_FLAG shall be equal to TRUE");
        }
        static get OutputColorFormatError() {
            return ErrorObjectProvider.getErrorObject("8.3.19", "If IsCurrPlaneAlphaFlag is equal to TRUE, the value of OUTPUT_CLR_FMT shall be equal to 0");
        }
        static get WidthError() {
            return ErrorObjectProvider.getErrorObject("8.3.21", "When OUTPUT_CLR_FMT is equal to YUV420 or YUV422, the value of WIDTH_MINUS1 + 1 shall be an integer multiple of 2");
        }
        static get ExtendedWidthError() {
            return ErrorObjectProvider.getErrorObject("8.3.21", "The value of WIDTH_MINUS1 + 1 + LEFT_MARGIN + RIGHT_MARGIN shall be an integer multiple of 16");
        }
        static get HeightError() {
            return ErrorObjectProvider.getErrorObject("8.3.22", "When OUTPUT_CLR_FMT is equal to YUV420, the value of HEIGHT_MINUS1 + 1 shall be an integer multiple of 2");
        }
        static get ExtendedHeightError() {
            return ErrorObjectProvider.getErrorObject("8.3.22", "The value of HEIGHT_MINUS1 + 1 + TOP_MARGIN + BOTTOM_MARGIN shall be an integer multiple of 16");
        }
        static get TileWidthsError() {
            return ErrorObjectProvider.getErrorObject("8.3.25", "When INTERNAL_CLR_FMT is equal to YUV420 or YUV422, OVERLAP_MODE is equal to 2, and HARD_TILING_FLAG is equal to TRUE, TILE_WIDTH_IN_MB[n] shall be greater than or equal to 2 for all tiles");
        }
        static get LastTileWidthError() {
            return ErrorObjectProvider.getErrorObject("8.3.25", "When INTERNAL_CLR_FMT is equal to YUV420 or YUV422, OVERLAP_MODE is equal to 2, and HARD_TILING_FLAG is equal to TRUE, MBWidth − LeftMBIndexOfTile[NUM_VER_TILES_MINUS1] shall be greater than or equal to 2");
        }
        static get TopMarginError() {
            return ErrorObjectProvider.getErrorObject("8.3.27", "When OUTPUT_CLR_FMT is equal to YUV420, the value of TOP_MARGIN shall be an integer multiple of 2");
        }
        static get LeftMarginError() {
            return ErrorObjectProvider.getErrorObject("8.3.28", "When OUTPUT_CLR_FMT is equal to YUV420 or YUV422, the value of LEFT_MARGIN shall be an integer multiple of 2");
        }
        static get BottomMarginError() {
            return ErrorObjectProvider.getErrorObject("8.3.29", "When OUTPUT_CLR_FMT is equal to YUV420, the value of BOTTOM_MARGIN shall be an integer multiple of 2");
        }
        static get RightMarginError() {
            return ErrorObjectProvider.getErrorObject("8.3.30", "When OUTPUT_CLR_FMT is equal to YUV420 or YUV422, the value of RIGHT_MARGIN shall be an integer multiple of 2");
        }
    }
}