module JxrPicturase.SubstrateComponents {
    /** Validate JPEG XR header as Rec. ITU-T T.832 (01/2012) */
    //export class ErrorObjectProvider {
    //    static getErrorObject(specNumber: string, message: string) {
    //        return new Error("Failed to digest the image which has a problem. "
    //            + message + ", as JPEG XR specification ITU-T T.832 (01/2012) " + specNumber);
    //    }
    //}
    export class JxrErrorMessage {
        /** returns "Failed to digest the image which " + message */
        //static getFailedBecauseMessage(message: string) {
        //    return "Failed to digest the image which " + message;//최상단 console.error로 전환
        //}
        /** returns "May fail to digest the image which " + message */
        //static getMayFailBecauseUnsupportedEnumMessage(varname: string) {
        //    return "May fail to digest the image which has unsupported type of "
        //        + varname + " by JPEG XR specification ITU-T T.832 (01/2012)";//부르는 곳에서 console.warn으로 전환. May fail은 warn 자체로 대체 가능하니 이 메시지는 필요 없을 듯
        //}


        static getUnsupportedValueMessage(dataname: string) {
            return "Unsupported value for data " + dataname + " is detected";
        }

        static getUnsupportedPropertyMessage(paramname: string, structurename: string) {
            return "Unsupported value for parameter " + paramname + " is detected in " + structurename;
        }

        static getIncompatibleValuesMessage(varname: string, structurename: string) {
            return "Values incompatible with " + varname + " in " + structurename + " are detected";
        }
    }

    //export class JxrInvalidParameterError {
    //    name = "JxrInvalidParameterError";
    //    message: string;
    //    constructor(specNumber: string, message: string) {
    //        this.message = JxrErrorMessage.getFailedBecauseMessage("has a problem. "
    //            + message + ", as JPEG XR specification ITU-T T.832 (01/2012) " + specNumber);
    //    }
    //}

    //export class JxrInvalidSignatureError {
    //    name = "JxrInvalidSignatureError";
    //    message: string;
    //    constructor(signaturename: string) {
    //        this.message = JxrErrorMessage.getFailedBecauseMessage("has invalid" + signaturename + "signature");
    //    }
    //}

    //export class JxrUnsupportedEnumError {
    //    name = "JxrUnsupportedEnumError";
    //    message: string;
    //    constructor(varname: string) {
    //        this.message = JxrErrorMessage.getFailedBecauseMessage("has unsupported type of "
    //            + varname + " by JPEG XR specification ITU-T T.832 (01/2012)");
    //    }
    //}

    //export class JxrIfdEntryErrors {
    //    //static get error() {
    //    //}
    //}

    //export class JxrHeaderErrors {
    //    static get IndexTableError() {
    //        return new JxrInvalidParameterError("8.3.9", "If FREQUENCY_MODE_CODESTREAM_FLAG is equal to TRUE, or NUM_VER_TILES_MINUS1 is greater than 0, or NUM_HOR_TILES_MINUS1 is greater than 0, INDEX_TABLE_PRESENT_FLAG shall be equal to TRUE.");
    //    }
    //    static get OutputColorFormatError() {
    //        return new JxrInvalidParameterError("8.3.19", "If IsCurrPlaneAlphaFlag is equal to TRUE, the value of OUTPUT_CLR_FMT shall be equal to 0");
    //    }
    //    static get WidthError() {
    //        return new JxrInvalidParameterError("8.3.21", "When OUTPUT_CLR_FMT is equal to YUV420 or YUV422, the value of WIDTH_MINUS1 + 1 shall be an integer multiple of 2");
    //    }
    //    static get ExtendedWidthError() {
    //        return new JxrInvalidParameterError("8.3.21", "The value of WIDTH_MINUS1 + 1 + LEFT_MARGIN + RIGHT_MARGIN shall be an integer multiple of 16");
    //    }
    //    static get HeightError() {
    //        return new JxrInvalidParameterError("8.3.22", "When OUTPUT_CLR_FMT is equal to YUV420, the value of HEIGHT_MINUS1 + 1 shall be an integer multiple of 2");
    //    }
    //    static get ExtendedHeightError() {
    //        return new JxrInvalidParameterError("8.3.22", "The value of HEIGHT_MINUS1 + 1 + TOP_MARGIN + BOTTOM_MARGIN shall be an integer multiple of 16");
    //    }
    //    static get TileWidthsError() {
    //        return new JxrInvalidParameterError("8.3.25", "When INTERNAL_CLR_FMT is equal to YUV420 or YUV422, OVERLAP_MODE is equal to 2, and HARD_TILING_FLAG is equal to TRUE, TILE_WIDTH_IN_MB[n] shall be greater than or equal to 2 for all tiles");
    //    }
    //    static get LastTileWidthError() {
    //        return new JxrInvalidParameterError("8.3.25", "When INTERNAL_CLR_FMT is equal to YUV420 or YUV422, OVERLAP_MODE is equal to 2, and HARD_TILING_FLAG is equal to TRUE, MBWidth − LeftMBIndexOfTile[NUM_VER_TILES_MINUS1] shall be greater than or equal to 2");
    //    }
    //    static get TopMarginError() {
    //        return new JxrInvalidParameterError("8.3.27", "When OUTPUT_CLR_FMT is equal to YUV420, the value of TOP_MARGIN shall be an integer multiple of 2");
    //    }
    //    static get LeftMarginError() {
    //        return new JxrInvalidParameterError("8.3.28", "When OUTPUT_CLR_FMT is equal to YUV420 or YUV422, the value of LEFT_MARGIN shall be an integer multiple of 2");
    //    }
    //    static get BottomMarginError() {
    //        return new JxrInvalidParameterError("8.3.29", "When OUTPUT_CLR_FMT is equal to YUV420, the value of BOTTOM_MARGIN shall be an integer multiple of 2");
    //    }
    //    static get RightMarginError() {
    //        return new JxrInvalidParameterError("8.3.30", "When OUTPUT_CLR_FMT is equal to YUV420 or YUV422, the value of RIGHT_MARGIN shall be an integer multiple of 2");
    //    }
    //}
}