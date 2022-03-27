import {
    BigNumber,
    Contract
} from "ethers"
import { } from "@nomiclabs/hardhat-ethers/internal/type-extensions"
import { ethers } from "hardhat"
import { TradePair } from "../models/dexalot/TradePair"
import { autoInjectable, delay } from "tsyringe"
import { DexalotSmartContractService } from "./DexalotSmartContractService"
import { DexalotRestService } from "./DexalotRestService"
import { BaseSymbol, Spread, Wallet } from "../config"
const utils = ethers.utils

@autoInjectable()
export class DexalotBot {
    private pair: TradePair
    tradePairId: any

    constructor(private dexalotRestService: DexalotRestService, private dexalotSmartContractService: DexalotSmartContractService) {
    }

    async start() {
        const tradePaiedDeployment = await this.dexalotRestService.getTradePairsDeployment();

        const pairs = await this.dexalotRestService.getTradePairs();
        this.pair = pairs.find(e => e.base === BaseSymbol)
        this.tradePairId = this.asciiToHex(this.pair.pair)

        await this.dexalotSmartContractService.initialize(tradePaiedDeployment, this.pair)
        console.log('createOrders')
        await this.createOrders()

        await this.delay(10000)
        console.log('cancelOrdersSequentionally')

        await this.cancelOrdersSequentionally()

        await this.delay(10000)

        console.log('createOrders')
        await this.createOrders()

        await this.delay(10000)

        console.log('cancelAllOrders')
        await this.cancelAllOrders()
    }


    async createOrders() {
        const averagePrice = await this.dexalotSmartContractService.getAveragePrice(this.tradePairId)
        console.log(averagePrice)
        await this.createBuyOrder(averagePrice)
        await this.createSellOrder(averagePrice)
    }

    async createSellOrder(averagePrice: number) {
        console.log(averagePrice)
        let quantity = 10
        let price = averagePrice * (1 - Spread)

        let sellAmount = price * quantity
        if (sellAmount < this.pair.mintrade_amnt) {
            quantity = this.pair.mintrade_amnt / price
        }
        console.log('Creating Buy Order')
        const order = (await this.dexalotSmartContractService.addOrder(this.tradePairId, price, quantity, Side.SELL, OrderType.LIMIT))
        console.log('Sell Order created')
        console.log(order)
        return order
    }

    async createBuyOrder(averagePrice: number) {
        console.log(averagePrice)
        let quantity = 10
        let price = averagePrice * (1 + Spread)

        let sellAmount = price * quantity
        if (sellAmount < this.pair.mintrade_amnt) {
            quantity = this.pair.mintrade_amnt / price
        }
        console.log('Creating Buy Order')
        const order = (await this.dexalotSmartContractService.addOrder(this.tradePairId, price, quantity, Side.SELL, OrderType.LIMIT))
        console.log('Buy Order created')
        console.log(order)
        return order
    }



    async cancelOrdersSequentionally() {
        const openedOrders = await this.dexalotRestService.getOpenOrders(Wallet, this.pair.pair)
        console.log('Cancelling orders sequentaly ')

        await openedOrders.forEach(async order => {
            console.log('Cancelling order with id ' + order.id)
            await this.dexalotSmartContractService.cancelOrder(this.tradePairId, order.id)
            console.log('Order with id ' + order.id + ' cancelled')
        })
        console.log('All orders were cancelled sequentally')
    }

    async cancelAllOrders() {
        const openedOrders = await this.dexalotRestService.getOpenOrders(Wallet, this.pair.pair)
        console.log('Cancelling all orders')
        await this.dexalotSmartContractService.cancelAllOrders(this.tradePairId, openedOrders.map(e => e.id))
        console.log('All orders were cancelled')
    }

    private asciiToHex = (str = '') => {
        const res = [];
        const { length: len } = str;
        for (let n = 0, l = len; n < l; n++) {
            const hex = Number(str.charCodeAt(n)).toString(16);
            res.push(hex);
        };

        let result = '0x' + res.join('')
        while (result.length < 66) {
            result += '00';
        }
        return result
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

export enum Side {
    BUY = 0, SELL = 1
}

export enum OrderType {
    MARKET = 0,
    LIMIT = 1,
    STOP = 2,
    STOPLIMIT = 3,
    LIMITFOK = 4
}

export enum OrderStatus {
    NEW = 0,
    REJECTED = 1,
    PARTIAL = 2,
    FILLED = 3,
    CANCELED = 4,
    EXPIRED = 5,
    KILLED = 6,
    PENDING_NEW = 7
};    
