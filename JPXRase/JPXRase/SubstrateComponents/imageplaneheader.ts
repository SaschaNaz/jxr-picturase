///<reference path="../arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="imageheader.ts"/>
///<reference path="datatypes.ts"/>
///<reference path="errorobjectprovider.ts"/>
module JxrPicturase.SubstrateComponents {
    export class ImagePlaneHeader {
        static Parse(imageSubstream: ArrayedStream, imageHeader: ImageHeader, isAlphaPlane: boolean) {
            var bitstream = new ArrayedBitStream(imageSubstream);

            var internalColorFormat: InternalColorFormat = bitstream.readBits(3);
            if (!InternalColorFormat[internalColorFormat])
                throw new Error(JxrErrorMessage.getUnsupportedPropertyMessage("INTERNAL_CLR_FMT", "IMAGE_PLANE_HEADER"));
            var willBeScaled = (bitstream.readBits(1) == 1);
            var bandsPresent = FrequencyBandsPresence.getBandsPresence(bitstream.readBits(4));

            
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