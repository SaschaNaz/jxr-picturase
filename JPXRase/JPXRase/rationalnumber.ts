module JxrPicturase {
    export class RationalNumber {
        constructor(public numerator: number, public denominator: number) {
        }

        getValue() {
            return this.numerator / this.denominator;
        }
    }
}