module JxrPicturase.SubstrateComponents {
    export class JxrMath {
        static clip(input: number, rangeMin: number, rangeMax: number) {
            return Math.min(Math.max(input, rangeMin), rangeMax);
        }
    }
}