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
                throw new Error(JxrErrorMessage.getInvalidValueMessage("INTERNAL_CLR_FMT", "IMAGE_PLANE_HEADER"));
            var willBeScaled = (bitstream.readBits(1) == 1);
            var bandsPresent: BandsPresent = bitstream.readBits(4);
            if (!BandsPresent[bandsPresent])
                throw new Error(JxrErrorMessage.getInvalidValueMessage("BANDS_PRESENT", "IMAGE_PLANE_HEADER"));
            
            var getBandsNumber = () => {
                return 4 - bandsPresent;//currently fine to use this algorithm
            }; 

        }
    }
}