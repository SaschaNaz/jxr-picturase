module JxrPicturase.SubstrateComponents {
    export enum ImageOverlapMode {
        None, SecondLevel, FirstAndSecondLevel
    }

    export class ImageOrientationState {
        constructor(
            public RotatedClockwise: Boolean,
            public FlippedHorizontally: Boolean,
            public FlippedVertically: Boolean) {
        }

        static getOrientationState(state: number) {
            switch (state) {
                case 0: return new ImageOrientationState(false, false, false);
                case 1: return new ImageOrientationState(false, false, true);
                case 2: return new ImageOrientationState(false, true, false);
                case 3: return new ImageOrientationState(false, true, true);
                case 4: return new ImageOrientationState(true, false, false);
                case 5: return new ImageOrientationState(true, false, true);
                case 6: return new ImageOrientationState(true, true, false);
                case 7: return new ImageOrientationState(true, true, true);
                default: return null;
            }
        }
    }

    export enum ResolutionTiffUnit {
        Inches = 2, Centimeters = 3
    }
}