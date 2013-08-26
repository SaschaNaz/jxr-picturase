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
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("WIDTH_MINUS1", "IMAGE_HEADER"));
            if (imageHeader.height % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("HEIGHT_MINUS1", "IMAGE_HEADER"));
            
            //JPEG XR validity test, 8.3.9
            if ((!imageHeader.hasIndexTable &&
                (imageHeader.isFrequencyMode ||
                imageHeader.numberOfVerticalTiles > 1 ||
                imageHeader.numberOfHorizontalTiles > 1)))
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("INDEX_TABLE_PRESENT_FLAG", "IMAGE_HEADER"));
            
            //JPEG XR validity test, 8.3.27
            if (imageHeader.marginTop % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("TOP_MARGIN", "IMAGE_HEADER"));
            //JPEG XR validity test, 8.3.28
            if (imageHeader.marginLeft % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("LEFT_MARGIN", "IMAGE_HEADER"));
            //JPEG XR validity test, 8.3.29
            if (imageHeader.marginBottom % 2 != 0 && imageHeader.outputColorFormat == ColorFormat.Yuv420)
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("BOTTOM_MARGIN", "IMAGE_HEADER"));
            //JPEG XR validity test, 8.3.30
            if (imageHeader.marginRight % 2 != 0 && (imageHeader.outputColorFormat == ColorFormat.Yuv420 || imageHeader.outputColorFormat == ColorFormat.Yuv422))
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("RIGHT_MARGIN", "IMAGE_HEADER"));
            
            //JPEG XR validity test, 8.3.21 and 8.3.22
            if (imageHeader.getLumaExtendedWidth() % 16 != 0)
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("WIDTH_MINUS1", "IMAGE_HEADER"));
            if (imageHeader.getLumaExtendedHeight() % 16 != 0)
                throw new Error(JxrErrorMessage.getIncompatibleValuesMessage("HEIGHT_MINUS1", "IMAGE_HEADER"));
        }
    }
}