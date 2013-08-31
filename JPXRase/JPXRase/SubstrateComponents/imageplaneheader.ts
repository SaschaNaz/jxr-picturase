///<reference path="../arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="imageheader.ts"/>
///<reference path="datatypes.ts"/>
///<reference path="errorobjectprovider.ts"/>
module JxrPicturase.SubstrateComponents {
    export class ImagePlaneHeader {
        internalColorFormat: InternalColorFormat;
        willBeScaled: boolean;

        chromaCenteringX = 0;

        static Parse(imageSubstream: ArrayedStream, imageHeader: ImageHeader, isAlphaPlane: boolean) {
            var imagePlaneHeader = new ImagePlaneHeader();
            var bitstream = new ArrayedBitStream(imageSubstream);

            imagePlaneHeader.internalColorFormat = bitstream.readBits(3);
            if (!InternalColorFormat[imagePlaneHeader.internalColorFormat])
                throw new Error(JxrErrorMessage.getUnsupportedPropertyMessage("INTERNAL_CLR_FMT", "IMAGE_PLANE_HEADER"));
            imagePlaneHeader.willBeScaled = (bitstream.readBits(1) == 1);
            var bandsPresent = FrequencyBandsPresence.getBandsPresence(bitstream.readBits(4));

            if (imagePlaneHeader.internalColorFormat == InternalColorFormat.Yuv444
                || imagePlaneHeader.internalColorFormat == InternalColorFormat.Yuv420
                || imagePlaneHeader.internalColorFormat == InternalColorFormat.Yuv422) {

                if (imagePlaneHeader.internalColorFormat == InternalColorFormat.Yuv420
                    || imagePlaneHeader.internalColorFormat == InternalColorFormat.Yuv422) {
                    if (bitstream.readBits(1) != 0)
                        throw new Error(JxrErrorMessage.getUnsupportedPropertyMessage("RESERVED_E", "IMAGE_HEADER"));

                    
                }

            }

        }

        getComponentCount() {
            return 0;
        }

        getChromaExtendedWidth(imageHeader: ImageHeader) {
            return 0;//6.2 Table 17
        }

        getChromaExtendedHeight(imageHeader: ImageHeader) {
            return 0;
        }
    }
}