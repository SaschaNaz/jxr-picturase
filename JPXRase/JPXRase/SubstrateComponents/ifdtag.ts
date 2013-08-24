module JxrPicturase.SubstrateComponents {
    export enum IfdTag {
        /** Returns 0x010D. This is descriptive metadata tag. */ DocumentName = 0x010D,
        /** Returns 0x010E. This is descriptive metadata tag. */ ImageDescription = 0x010E,
        /** Returns 0x010F. This is descriptive metadata tag. */ DeviceManufacturer = 0x010F,
        /** Returns 0x0110. This is descriptive metadata tag. */ DeviceModel = 0x0110,
        /** Returns 0x011D. This is descriptive metadata tag. */ PageName = 0x011D,
        /** Returns 0x0129. This is descriptive metadata tag. */ PageNumber = 0x0129,
        /** Returns 0x0131. This is descriptive metadata tag. */ Software = 0x131,
        /** Returns 0x0132. This is descriptive metadata tag. */ DateAndTime = 0x132,
        /** Returns 0x013B. This is descriptive metadata tag. */ ArtistName = 0x013B,
        /** Returns 0x013C. This is descriptive metadata tag. */ HostComputer = 0x013C,
        /** Returns 0x8298. This is descriptive metadata tag. */ CopyrightNotice = 0x8298,

        /** Returns 0xA001 */ ColorSpace = 0xA001,
        /** Returns 0xBC01 */ PixelFormat = 0xBC01,
        /** Returns 0xBC02 */ Transformation = 0xBC02,
        /** Returns 0xBC04 */ ImageType = 0xBC04,
        /** Returns 0xBC05 */ ColorInformation = 0xBC05,
        /** Returns 0xBC06 */ ProfileAndLevelContainer = 0xBC06,

        /** Returns 0xBC80 */ ImageSizeX = 0xBC80,
        /** Returns 0xBC81 */ ImageSizeY = 0xBC81,
        /** Returns 0xBC82 */ ResolutionX = 0xBC82,
        /** Returns 0xBC83 */ ResolutionY = 0xBC83,

        /** Returns 0xBCC0 */ ImageOffset = 0xBCC0,
        /** Returns 0xBCC1 */ ImageByteCount = 0xBCC1,
        /** Returns 0xBCC2 */ AlphaOffset = 0xBCC2,
        /** Returns 0xBCC3 */ AlphaByteCount = 0xBCC3,
        /** Returns 0xBCC4 */ ImageBandPresence = 0xBCC4,
        /** Returns 0xBCC5 */ AlphaBandPresence = 0xBCC5,
        /** Returns 0xEA1C */ PaddingData = 0xEA1C,

        /** Returns 0x02BC */ XmpMetadata = 0x02BC,
        /** Returns 0x8769 */ ExifMetadata = 0x8769,
        /** Returns 0x8825. Belongs to EXIF 2.2 specification. */ GpsInfoMetadata = 0x8825,
        /** Returns 0x83BB */ IptcNaaMetadata = 0x83BB,
        /** Returns 0x8649 */ PhotoshopMetadata = 0x8649,
        /** Returns 0xA005. Belongs to EXIF 2.2 specification. */ //InteroperabilityIfd = 0xA005,
        /** Returns 0x8773 */ IccProfile = 0x8773,
        
        /** Returns 0x4746. This is descriptive metadata tag. */ //RatingStars = 0x4746,
        /** Returns 0x4749. This is descriptive metadata tag. */ //RatingValue = 0x4749,
        /** Returns 0x9C9B. This is descriptive metadata tag. */ //Title = 0x9C9B,
        /** Returns 0x9C9C. This is descriptive metadata tag. */ //Comment = 0x9C9C,
        /** Returns 0x9C9D. This is descriptive metadata tag. */ //Author = 0x9C9D,
        /** Returns 0x9C9E. This is descriptive metadata tag. */ //Keywords = 0x9C9E,
        /** Returns 0x9C9F. This is descriptive metadata tag. */ //Subject = 0x9C9F,

        /** Returns 0x011A */ //ResolutionTiffX = 0x011A,
        /** Returns 0x011B */ //ResolutionTiffY = 0x011B,
        /** Returns 0x0128 */ //ResolutionTiffUnit = 0x0128
    }

    export enum DataType {
        Byte = 1,
        TextUtf8 = 2,
        Uint16 = 3,
        Uint32 = 4,
        URationalNumber = 5,
        Int8 = 6,
        Undefined = 7,
        Int16 = 8,
        Int32 = 9,
        RationalNumber = 10,
        Float = 11,
        Double = 12
    }
}