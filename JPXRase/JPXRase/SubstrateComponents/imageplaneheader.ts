///<reference path="../arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="imageheader.ts"/>
///<reference path="datatypes.ts"/>
module JxrPicturase.SubstrateComponents {
    export class ImagePlaneHeader {
        static Parse(imageSubstream: ArrayedStream, imageHeader: SubstrateComponents.ImageHeader, isAlphaPlane: Boolean) {
            var bitstream = new ArrayedBitStream(imageSubstream);

            var internalColorFormat: InternalColorFormat = bitstream.readBits(3);
            var willBeScaled = (bitstream.readBits(1) == 1);
            var bandsPresent: BandsPresent = bitstream.readBits(4);
            
            var getBandsNumber = () => {

            }; 
        }
    }
}