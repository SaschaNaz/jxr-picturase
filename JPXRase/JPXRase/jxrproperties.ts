///<reference path="arrayedstream.ts"/>
///<reference path="formatids.ts"/>
module JxrPicturase {
    export class PropertyExporter {
        constructor(public stream: ArrayedStream, public type: number, public count: number, public valueAsSubstream: ArrayedStream) {
            //if count is larger than 4, then the value is an offset rather than the property value.
            if (this.count > 4) {
                var offset = this.valueAsSubstream.readAsUint32();
                this.valueAsSubstream = this.stream.duplicateStream();
                this.valueAsSubstream.seek(offset);
            }
        }

        getTextPropertyFromStream() {
            if (this.type != DataTypeIds.TextUtf8) {
                console.log('Text is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsUtf8Text(this.count);
        }

        getUintPropertyFromStream() {
            if (this.type != DataTypeIds.Byte && this.type != DataTypeIds.Uint16 && this.type != DataTypeIds.Uint32) {
                console.log('Number is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }

            switch (this.type) {
                case DataTypeIds.Byte:
                    return this.valueAsSubstream.readAsUint8();
                case DataTypeIds.Uint16:
                    return this.valueAsSubstream.readAsUint16();
                case DataTypeIds.Uint32:
                    return this.valueAsSubstream.readAsUint32();
            }
        }

        getUint16ArrayFromStream() {
            if (this.type != DataTypeIds.Uint16) {
                console.log('Uint16 is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsUint16Array(this.count);
        }

        getFloatPropertyFromStream() {
            if (this.type != DataTypeIds.Float) {
                console.log('Float is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsFloat();
        }

        getByteStreamFromStream() {
            if (this.type != DataTypeIds.Byte) {
                console.log('Byte is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsSubstream(this.count);
        }

        //should be able to receive all kinds of types
        //getAnyPropertyFromStream() {
        //    if (this.count == 0)
        //        return null;

        //    switch (this.type) {
        //        case DataTypeIds.TextUtf8: {
        //            return this.valueAsSubstream.readAsUtf8Text(this.count);
        //        }
        //        case DataTypeIds.Byte: {
        //            if (this.count == 1)
        //                return this.valueAsSubstream.readAsUint8();
        //            else
        //                return this.valueAsSubstream.readAsSubstream(this.count);
        //            break;
        //        }
        //        case DataTypeIds.Undefined: {
        //            return this.valueAsSubstream.readAsSubstream(this.count);
        //        }
        //        case DataTypeIds.Uint16: {
        //            if (this.count == 1) {
        //                return this.valueAsSubstream.readAsUint16();
        //            }
        //            else
        //                return this.valueAsSubstream.readAsUint16Array(this.count);//no it's not uint32, it shouln't be as A.7.11 PAGE NUMBER uses real TWO numbers. Is it to be devided later?
        //        }
        //        default: {
        //            throw 'This property type is not supported yet.';
        //        }
        //    }
        //}
    }
}