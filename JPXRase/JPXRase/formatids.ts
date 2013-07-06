module JxrPicturase {
    export class TagIds {
        /** Returns 0x010D. This is descriptive metadata tag.  */ static get DocumentName() { return 0x010D; }
        /** Returns 0x010E. This is descriptive metadata tag.  */ static get ImageDescription() { return 0x010E; }
        /** Returns 0x010F. This is descriptive metadata tag.  */ static get CameraManufacturer() { return 0x010F; }
        /** Returns 0x0110. This is descriptive metadata tag.  */ static get CameraModel() { return 0x0110; }
        /** Returns 0x011D. This is descriptive metadata tag.  */ static get PageName() { return 0x011D; }
        /** Returns 0x0129. This is descriptive metadata tag.  */ static get PageNumber() { return 0x0129; }
        /** Returns 0x0131. This is descriptive metadata tag.  */ static get Software() { return 0x131; }
        /** Returns 0x0132. This is descriptive metadata tag.  */ static get DateAndTime() { return 0x132; }
        /** Returns 0x013B. This is descriptive metadata tag.  */ static get ArtistName() { return 0x013B; }
        /** Returns 0x013C. This is descriptive metadata tag.  */ static get HostComputer() { return 0x013C; }

        /** Returns 0x02BC */ static get XmpMetadata() { return 0x02BC; }

        /** Returns 0x4746. This is descriptive metadata tag. */ static get RatingStars() { return 0x4746; }
        /** Returns 0x4749. This is descriptive metadata tag. */ static get RatingValue() { return 0x4749; }
        /** Returns 0x8298. This is descriptive metadata tag. */ static get CopyrightNotice() { return 0x8298; }

        /** Returns 0x8769 */ static get ExifMetadata() { return 0x8769; }
        /** Returns 0x8825. Belongs to EXIF 2.2 specification. */ static get GpsInfoMetadata() { return 0x8825; }
        /** Returns 0x83BB */ static get IptcNaaMetadata() { return 0x83BB; }
        /** Returns 0x8649 */ static get PhotoshopMetadata() { return 0x8649; }
        /** Returns 0xA005. Belongs to EXIF 2.2 specification. */ static get InteroperabilityIfd() { return 0xA005; }
        /** Returns 0x8773 */ static get IccProfile() { return 0x8773; }

        /** Returns 0x9C9B. This is descriptive metadata tag. */ static get Title() { return 0x9C9B; }
        /** Returns 0x9C9B. This is descriptive metadata tag. */ static get Comment() { return 0x9C9C; }
        /** Returns 0x9C9B. This is descriptive metadata tag. */ static get Author() { return 0x9C9D; }
        /** Returns 0x9C9B. This is descriptive metadata tag. */ static get Keywords() { return 0x9C9E; }
        /** Returns 0x9C9B. This is descriptive metadata tag. */ static get Subject() { return 0x9C9F; }

        /** Returns 0xBC01 */ static get PixelFormat() { return 0xBC01; }
        /** Returns 0xBC02 */ static get Transformation() { return 0xBC02; }
        /** Returns 0xBC03 */ static get Compression() { return 0xBC03; }
        /** Returns 0xBC04 */ static get ImageType() { return 0xBC04; }

        /** Returns 0xBC80 */ static get ImageSizeX() { return 0xBC80; }
        /** Returns 0xBC81 */ static get ImageSizeY() { return 0xBC81; }

        /** Returns 0xBC82 */ static get ResolutionX() { return 0xBC82; }
        /** Returns 0xBC83 */ static get ResolutionY() { return 0xBC83; }

        /** Returns 0xBCC0 */ static get ImageOffset() { return 0xBCC0; }
        /** Returns 0xBCC1 */ static get ImageByteCount() { return 0xBCC1; }
        /** Returns 0xBCC2 */ static get AlphaOffset() { return 0xBCC2; }
        /** Returns 0xBCC3 */ static get AlphaByteCount() { return 0xBCC3; }
        /** Returns 0xBCC4 */ static get ImageDataDiscarded() { return 0xBCC4; }
        /** Returns 0xBCC5 */ static get AlphaDataDiscarded() { return 0xBCC5; }
    }

    export class DataTypeIds {
        static get Byte() { return 1 }
        static get TextUtf8() { return 2; }
        static get Uint16() { return 3; }
        static get Uint32() { return 4; }
        static get URationalNumber() { return 5; }
        static get Int8() { return 6; }
        static get Undefined() { return 7; }
        static get Int16() { return 8; }
        static get Int32() { return 9; }
        static get RationalNumber() { return 10; }
        static get Float() { return 11; }
        static get Double() { return 12; }
    }
}