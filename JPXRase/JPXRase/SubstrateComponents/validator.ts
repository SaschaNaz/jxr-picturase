///<reference path="ifdentry.ts"/>
///<reference path="imageheader.ts"/>
///<reference path="imageplaneheader.ts"/>
///<reference path="ifdentry.ts"/>
///<reference path="imageheader.ts"/>
///<reference path="imageplaneheader.ts"/>
module JxrPicturase.SubstrateComponents {
    export class Validator {
        //validate는 천천히 만들자...
        static ValidateImageHeader(imageHeader: ImageHeader, imagePlaneHeader: ImagePlaneHeader) {
            //JPEG XR validity test, 8.3.21 and 8.3.22
            if (imageHeader.width % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw new Error(JxrErrorMessage.getInvalidValueMessage("WIDTH_MINUS1", "IMAGE_HEADER"));
            if (imageHeader.height % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("HEIGHT_MINUS1", "IMAGE_HEADER"));
            
            //JPEG XR validity test, 8.3.9
            if ((!imageHeader.hasIndexTable &&
                (imageHeader.isFrequencyMode ||
                imageHeader.numberOfVerticalTiles > 1 ||
                imageHeader.numberOfHorizontalTiles > 1)))
                throw new Error(JxrErrorMessage.getInvalidValueMessage("INDEX_TABLE_PRESENT_FLAG", "IMAGE_HEADER"));
            
            //JPEG XR validity test, 8.3.27
            if (imageHeader.marginTop % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("TOP_MARGIN", "IMAGE_HEADER"));
            //JPEG XR validity test, 8.3.28
            if (imageHeader.marginLeft % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw new Error(JxrErrorMessage.getInvalidValueMessage("LEFT_MARGIN", "IMAGE_HEADER"));
            //JPEG XR validity test, 8.3.29
            if (imageHeader.marginBottom % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("BOTTOM_MARGIN", "IMAGE_HEADER"));
            //JPEG XR validity test, 8.3.30
            if (imageHeader.marginRight % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw new Error(JxrErrorMessage.getInvalidValueMessage("RIGHT_MARGIN", "IMAGE_HEADER"));
            
            //JPEG XR validity test, 8.3.21 and 8.3.22
            if (imageHeader.getExtendedWidth() % 16 != 0)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("WIDTH_MINUS1", "IMAGE_HEADER"));
            if (imageHeader.getExtendedHeight() % 16 != 0)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("HEIGHT_MINUS1", "IMAGE_HEADER"));
        }
    }
}