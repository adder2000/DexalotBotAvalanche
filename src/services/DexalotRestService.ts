import axios = require('axios');
import { injectable } from 'tsyringe';
import { DexalotRestApiUrl } from '../config';
import { Deployment, OpenedOrder, TradePair } from '../models/dexalot/TradePair';

@injectable()
export class DexalotRestService {

    async getTradePairsDeployment(): Promise<Deployment> {
        const result = await (await axios.default.get<Deployment>(DexalotRestApiUrl + "/trading/deploymentabi/TradePairs"))
        return result.data
    }

    async getTradePairs(): Promise<TradePair[]> {
        const result = await (await axios.default.get<TradePair[]>(DexalotRestApiUrl + "/trading/pairs"))
        return result.data
    }

    async getOpenOrders(wallet:String, pair:String): Promise<OpenedOrder[]> {
        const result = await (await axios.default.get(DexalotRestApiUrl + `/trading/openorders/params?traderaddress=${wallet}&pair=${pair}`))
        return result.data.rows
    }

}