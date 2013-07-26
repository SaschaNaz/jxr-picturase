module JxrPicturase.SubstrateComponents {
    export enum ImageOverlapMode {
        None, SecondLevel, FirstAndSecondLevel
    }

    export class TransformationState {
        constructor(
            public RotatedClockwise: Boolean,
            public FlippedHorizontally: Boolean,
            public FlippedVertically: Boolean) {
        }

        static getTransformationState(state: number) {
            switch (state) {
                default://should be equal to value 0
                case 0: return new TransformationState(false, false, false);

                case 1: return new TransformationState(false, false, true);
                case 2: return new TransformationState(false, true, false);
                case 3: return new TransformationState(false, true, true);
                case 4: return new TransformationState(true, false, false);
                case 5: return new TransformationState(true, false, true);
                case 6: return new TransformationState(true, true, false);
                case 7: return new TransformationState(true, true, true);
            }
        }
    }
    
    export enum ColorSpace {
        sRGB = 1, Other = 0xFFFF
    }

    export enum ResolutionTiffUnit {
        Inches = 2, Centimeters = 3
    }
}