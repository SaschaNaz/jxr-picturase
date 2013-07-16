///<reference path="../arrayedstream.ts"/>
///<reference path="formatids.ts"/>
module JxrPicturase.SubstrateComponents {
    export class PropertyReader {
        constructor(public basestream: ArrayedStream, public type: number, public count: number, public valueAsSubstream: ArrayedStream) {
            //if count is larger than 4, then the value is an offset rather than the property value.
            if (PropertyReader.getPropertyDataSize(this.type, this.count) > 4) {
                var offset = this.valueAsSubstream.readAsUint32();
                this.valueAsSubstream = this.basestream.duplicateStream();
                this.valueAsSubstream.seek(offset);
            }
        }
        
        static getPropertyDataSize(type: number, count: number) {
            var datasize: number;
            switch (type) {
                //case 0://reserved, not specified
                case DataTypeIds.Byte://byte
                case DataTypeIds.TextUtf8://utf8text
                case DataTypeIds.Int8://Signed byte
                case DataTypeIds.Undefined://Undefined
                    datasize = 1 * count; break;
                case DataTypeIds.Uint16://Uint16
                case DataTypeIds.Int16://Int16
                    datasize = 2 * count; break;
                case DataTypeIds.Uint32://UInt32
                case DataTypeIds.Int32://Int32
                case DataTypeIds.Float://Float
                    datasize = 4 * count; break;
                case DataTypeIds.URationalNumber://URationalNumber
                case DataTypeIds.RationalNumber://RationalNumber
                case DataTypeIds.Double://Double
                    datasize = 8 * count; break;
            }
            return datasize;
        }

        getTextPropertyFromStream() {
            if (this.type != DataTypeIds.TextUtf8 && this.type != DataTypeIds.Byte) {
                console.log('Text is expected, but type ' + this.type.toString() + ' is observed. The only type exceptionally accepted is \'Byte\'.');
                return;
            }

            var text: String;
            if (this.type == DataTypeIds.TextUtf8)
                text = this.valueAsSubstream.readAsUtf8Text(this.count);
            else
                text = this.valueAsSubstream.readAsUtf16Text(this.count);

            if (text.charCodeAt(text.length - 1) != 0)
                console.log('Possibly invalid text property, as it is not properly terminated.');
            else
                text = text.substr(0, text.length - 1);
            
            return text;
        }

        getAnyUintPropertyFromStream() {
            if (this.type != DataTypeIds.Byte && this.type != DataTypeIds.Uint16 && this.type != DataTypeIds.Uint32) {
                console.log('Number is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != 1) {
                console.log('length 1 is expected, but length ' + this.count + ' is observed');
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

        getUint16PropertyFromStream() {
            if (this.type != DataTypeIds.Uint16) {
                console.log('Uint16 is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != 1) {
                console.log('length 1 is expected, but length ' + this.count + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsUint16();
        }

        getUint32PropertyFromStream() {
            if (this.type != DataTypeIds.Uint32) {
                console.log('Uint32 is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != 1) {
                console.log('length 1 is expected, but length ' + this.count + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsUint32();
        }

        getUint16ArrayFromStream() {
            if (this.type != DataTypeIds.Uint16) {
                console.log('Uint16 is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsUint16Array(this.count);
        }

        getUint16ArrayFromStreamFixedLength(length: number) {
            if (this.type != DataTypeIds.Uint16) {
                console.log('Uint16 is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != length) {
                console.log('length ' + length.toString() + ' is expected, but length ' + this.count + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsUint16Array(this.count);
        }

        getFloatPropertyFromStream() {
            if (this.type != DataTypeIds.Float) {
                console.log('Float is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != 1) {
                console.log('length 1 is expected, but length ' + this.count + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsFloat();
        }

        getURationalPropertyFromStream() {
            if (this.type != DataTypeIds.URationalNumber) {
                console.log('URationalNumber is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != 1) {
                console.log('length 1 is expected, but length ' + this.count + ' is observed');
                return;
            }

            return this.valueAsSubstream.readAsURationalNumber();
        }

        getByteStreamFromStream() {
            return this.valueAsSubstream.readAsSubstream(this.count);
        }

        getByteStreamFromStreamFixedLength(length: number) {
            if (this.type != DataTypeIds.Byte) {
                console.log('Byte is expected, but type ' + this.type.toString() + ' is observed');
                return;
            }
            if (this.count != length) {
                console.log('length ' + length.toString() + ' is expected, but length ' + this.count + ' is observed');
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