export interface Streaming {
    id:      number;
    results: Results;
}

export interface Results {
    AD: PuneHedgehog;
    AE: TartuGecko;
    AG: TartuGecko;
    AL: TartuGecko;
    AR: TartuGecko;
    AT: TartuGecko;
    AU: TartuGecko;
    BA: TartuGecko;
    BB: PuneHedgehog;
    BE: TartuGecko;
    BG: TartuGecko;
    BH: PuneHedgehog;
    BO: TartuGecko;
    BR: TartuGecko;
    CA: TartuGecko;
    CH: TartuGecko;
    CI: TartuGecko;
    CL: TartuGecko;
    CO: TartuGecko;
    CR: TartuGecko;
    CV: TartuGecko;
    CZ: TartuGecko;
    DE: TartuGecko;
    DK: TartuGecko;
    DO: TartuGecko;
    DZ: PuneHedgehog;
    EC: TartuGecko;
    EE: TartuGecko;
    EG: TartuGecko;
    ES: TartuGecko;
    FI: TartuGecko;
    FJ: TartuGecko;
    FR: TartuGecko;
    GB: TartuGecko;
    GF: PuneHedgehog;
    GH: TartuGecko;
    GI: PuneHedgehog;
    GQ: PuneHedgehog;
    GR: TartuGecko;
    GT: TartuGecko;
    HK: TartuGecko;
    HN: TartuGecko;
    HR: TartuGecko;
    HU: TartuGecko;
    ID: TartuGecko;
    IE: TartuGecko;
    IL: TartuGecko;
    IN: TartuGecko;
    IQ: PuneHedgehog;
    IS: TartuGecko;
    IT: TartuGecko;
    JM: TartuGecko;
    JO: PuneHedgehog;
    JP: TartuGecko;
    KE: PuneHedgehog;
    KR: TartuGecko;
    KW: PuneHedgehog;
    LB: PuneHedgehog;
    LC: PuneHedgehog;
    LT: TartuGecko;
    LV: TartuGecko;
    LY: PuneHedgehog;
    MA: PuneHedgehog;
    MC: PuneHedgehog;
    MD: TartuGecko;
    MK: TartuGecko;
    MT: TartuGecko;
    MU: TartuGecko;
    MX: TartuGecko;
    MY: TartuGecko;
    MZ: TartuGecko;
    NE: TartuGecko;
    NG: PuneHedgehog;
    NL: TartuGecko;
    NO: TartuGecko;
    NZ: TartuGecko;
    OM: PuneHedgehog;
    PA: TartuGecko;
    PE: TartuGecko;
    PF: PuneHedgehog;
    PH: TartuGecko;
    PK: PuneHedgehog;
    PL: TartuGecko;
    PS: PuneHedgehog;
    PT: TartuGecko;
    PY: TartuGecko;
    QA: PuneHedgehog;
    RO: PuneHedgehog;
    RS: PuneHedgehog;
    RU: TartuGecko;
    SA: TartuGecko;
    SC: PuneHedgehog;
    SE: TartuGecko;
    SG: TartuGecko;
    SI: TartuGecko;
    SK: TartuGecko;
    SM: PuneHedgehog;
    SN: TartuGecko;
    SV: TartuGecko;
    TC: PuneHedgehog;
    TH: TartuGecko;
    TN: PuneHedgehog;
    TR: TartuGecko;
    TT: TartuGecko;
    TW: TartuGecko;
    TZ: TartuGecko;
    UG: TartuGecko;
    US: TartuGecko;
    UY: TartuGecko;
    VE: TartuGecko;
    YE: PuneHedgehog;
    ZA: TartuGecko;
    ZM: TartuGecko;
}

export interface PuneHedgehog {
    link:     string;
    flatrate: Flatrate[];
}

export interface Flatrate {
    logo_path:        string;
    provider_id:      number;
    provider_name:    string;
    display_priority: number;
}

export interface TartuGecko {
    link:      string;
    flatrate?: Flatrate[];
    buy?:      Flatrate[];
    rent:      Flatrate[];
    ads?:      Flatrate[];
}
