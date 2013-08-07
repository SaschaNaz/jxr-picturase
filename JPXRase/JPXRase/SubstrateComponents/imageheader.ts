///<reference path="../arrayedstream.ts"/>
///<reference path="pixelformats.ts"/>
///<reference path="datatypes.ts"/>
///<reference path="errorobjectprovider.ts"/>
module JxrPicturase.SubstrateComponents {
    export class ImageHeader {
        isHardTileUsed: boolean;
        hasMultipleTiles: boolean;
        isFrequencyMode: boolean;
        spatialTransformation: TransformationState;
        hasIndexTable: boolean;

        overlapMode: ImageOverlapMode;

        useLongValues: boolean;
        hasTrimFlexbits: boolean;

        isNotBgr: boolean;
        isAlphaPremultiplied: boolean;
        hasAlphaImagePlane: boolean;
        outputColorFormat: ColorFormat;
        outputBitDepth: BitDepth;
        width: number;
        height: number;
        getExtendedWidth() {
            return this.width + this.marginLeft + this.marginRight;
        }
        getExtendedHeight() {
            return this.height + this.marginTop + this.marginBottom;
        }

        numberOfVerticalTiles = 1;
        numberOfHorizontalTiles = 1;
        tileWidthsInMacroblocks: number[] = [];
        tileHeightsInMacroblocks: number[] = [];
        getTileBoundariesLeft() {
            var tileBoundariesLeft: number[] = [0];
            for (var i = 0; i < this.numberOfVerticalTiles; i++)
                tileBoundariesLeft.push(
                    this.tileWidthsInMacroblocks[i]
                    + tileBoundariesLeft[i]);//actually adding tileBoundariesRight
        }
        getTileBoundariesTop() {
            var tileBoundariesTop: number[] = [0];
            for (var i = 0; i < this.numberOfHorizontalTiles; i++)
                tileBoundariesTop.push(
                    this.tileHeightsInMacroblocks[i]
                    + tileBoundariesTop[i]);
        }
        getMacroblocksInEachTile() {
            var macroblocksInEachTile: number[] = [];
            for (var i = 0; i < this.numberOfHorizontalTiles; i++) {
                for (var i2 = 0; i2 < this.numberOfVerticalTiles; i2++) {
                    macroblocksInEachTile.push(
                        this.tileWidthsInMacroblocks[i] * this.tileHeightsInMacroblocks[i]);
                }
            }
            return macroblocksInEachTile;
        }

        marginTop = 0;
        marginLeft = 0;
        marginBottom: number;
        marginRight: number;

        static Parse(imageSubstream: ArrayedStream) {
            var imageHeader = new ImageHeader();

            //signature
            if (imageSubstream.readAsUtf8Text(8) !== 'WMPHOTO\0')
                throw new Error(JxrErrorMessage.getInvalidValueMessage("GDI_SIGNATURE", "IMAGE_HEADER"));

            var bitstream = new ArrayedBitStream(imageSubstream);

            //reserved B
            if (bitstream.readBits(4) != 1)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("RESERVED_B", "IMAGE_HEADER"));

            imageHeader.isHardTileUsed = (bitstream.readBits(1) == 1);

            //codec version check 2
            if (bitstream.readBits(3) != 1)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("RESERVED_C", "IMAGE_HEADER"));

            imageHeader.hasMultipleTiles = (bitstream.readBits(1) == 1);
            imageHeader.isFrequencyMode = (bitstream.readBits(1) == 1);
            imageHeader.spatialTransformation
            = new TransformationState(
                (bitstream.readBits(1) == 1),
                (bitstream.readBits(1) == 1),
                (bitstream.readBits(1) == 1));
            imageHeader.hasIndexTable = (bitstream.readBits(1) == 1);

            imageHeader.overlapMode = bitstream.readBits(2);
            if (!ImageOverlapMode[imageHeader.overlapMode])
                throw new Error(JxrErrorMessage.getInvalidValueMessage("OVERLAP_MODE", "IMAGE_HEADER"));

            var hasShortHeader = (bitstream.readBits(1) == 1);
            imageHeader.useLongValues = (bitstream.readBits(1) == 1);
            var useWindowing = (bitstream.readBits(1) == 1);
            imageHeader.hasTrimFlexbits = (bitstream.readBits(1) == 1);

            //codec version check 3
            if (bitstream.readBits(1) != 0)
                throw new Error(JxrErrorMessage.getInvalidValueMessage("RESERVED_D", "IMAGE_HEADER"));

            imageHeader.isNotBgr = (bitstream.readBits(1) == 1);
            imageHeader.isAlphaPremultiplied = (bitstream.readBits(1) == 1);
            imageHeader.hasAlphaImagePlane = (bitstream.readBits(1) == 1);
            imageHeader.outputColorFormat = bitstream.readBits(4);
            if (!ColorFormat[imageHeader.outputColorFormat])
                throw new Error(JxrErrorMessage.getInvalidValueMessage("OUTPUT_CLR_FMT", "IMAGE_HEADER"));
            imageHeader.outputBitDepth = bitstream.readBits(4);
            if (!BitDepth[imageHeader.outputBitDepth])
                throw new Error(JxrErrorMessage.getInvalidValueMessage("OUTPUT_BITDEPTH", "IMAGE_HEADER"));
            if (hasShortHeader) {
                imageHeader.width = bitstream.readBits(16) + 1;
                imageHeader.height = bitstream.readBits(16) + 1;
            }
            else {
                imageHeader.width = bitstream.readBits(32) + 1;
                imageHeader.height = bitstream.readBits(32) + 1;
            }

            if (imageHeader.hasMultipleTiles) {
                imageHeader.numberOfVerticalTiles = bitstream.readBits(12) + 1;
                imageHeader.numberOfHorizontalTiles = bitstream.readBits(12) + 1;
            }

            for (var i = 0; i < imageHeader.numberOfVerticalTiles - 1; i++)
                imageHeader.tileWidthsInMacroblocks.push(
                    bitstream.readBits(hasShortHeader ? 8 : 16));
            for (var i = 0; i < imageHeader.numberOfHorizontalTiles - 1; i++)
                imageHeader.tileHeightsInMacroblocks.push(
                    bitstream.readBits(hasShortHeader ? 8 : 16));

            if (useWindowing) {
                imageHeader.marginTop = bitstream.readBits(6);
                imageHeader.marginLeft = bitstream.readBits(6);
                imageHeader.marginBottom = bitstream.readBits(6);
                imageHeader.marginRight = bitstream.readBits(6);
            }
            else {
                imageHeader.marginBottom = (16 - (imageHeader.height % 16)) % 16;
                imageHeader.marginRight = (16 - (imageHeader.width % 16)) % 16;
            }

            imageHeader.tileWidthsInMacroblocks.push(imageHeader.getExtendedWidth() / 16 - imageHeader.tileWidthsInMacroblocks.reduce(function (a, b) { return a + b; }, 0));
            imageHeader.tileHeightsInMacroblocks.push(imageHeader.getExtendedHeight() / 16 - imageHeader.tileHeightsInMacroblocks.reduce(function (a, b) { return a + b; }, 0));

            return imageHeader;
        }
    }
}