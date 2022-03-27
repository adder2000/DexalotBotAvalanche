export interface TradePair {
    pair: string,
    base: string,
    quote: string,
    basedisplaydecimals: number,
    quotedisplaydecimals: number,
    baseaddress: string,
    quoteaddress?: string,
    mintrade_amnt: number,
    maxtrade_amnt: number,
    base_evmdecimals: number,
    quote_evmdecimals: number,
    auctionmode: number,
    auctionendtime: Date,
    status: string
}

export enum TradePairStatus {
    deployed
}

export interface OpenedOrder {
    id: string,
    // "pair": "LFG/SER",
    // "traderaddress": "0x720b7b6af5228a733ac1419d7b4f6b8ced62db45",
    // "tx": "0xb9e048ef1d88f46a187574c654f675467ffaddec8ea7f3f871435d3f7d534b50",
    // "type": 1,
    // "type2": 0,
    // "side": 0,
    // "price": "16.700000000000000000",
    // "quantity": "0.800000000000000000",
    // "totalamount": "0.000000000000000000",
    // "status": 0,
    // "ts": "2022-02-21T17:33:45.000Z",
    // "quantityfilled": "0.000000000000000000",
    // "totalfee": "0.000000000000000000",
    // "update_ts": "2022-02-21T17:33:45.000Z"
}

export interface Deployment {
    contract: string,
    address: string
}