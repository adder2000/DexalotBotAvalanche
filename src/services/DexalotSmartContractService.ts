import {
    BigNumber,
    Contract
} from "ethers"
import { } from "@nomiclabs/hardhat-ethers/internal/type-extensions"
import { ethers } from "hardhat"
import { OrderType, Side } from "./DexalotBot"
import { Deployment, TradePair } from "../models/dexalot/TradePair"
import { InitialPrice } from "../config"
const utils = ethers.utils

export class DexalotSmartContractService {

    private tradePairsContract: Contract;
    private quoteDisplayDecimals: number
    private quoteDecimals: number
    private baseDisplayDecimals: number
    private baseDecimals: number


    async initialize(deployment: Deployment, pair: TradePair) {
        this.tradePairsContract = await ethers.getContractAt(deployment.contract, deployment.address)
        this.quoteDisplayDecimals = pair.quotedisplaydecimals;
        this.quoteDecimals = pair.quote_evmdecimals;
        this.baseDisplayDecimals = pair.basedisplaydecimals;
        this.baseDecimals = pair.base_evmdecimals
    }

    async getTradePairs(): Promise<string[]> {
        const tradePairs = (await this.tradePairsContract.getTradePairs()) as string[]
        return tradePairs
    }

    async getMakerRate(tradePairId: String): Promise<any> {
        return (await this.tradePairsContract.getMakerRate(tradePairId))
    }

    async getTakerRate(tradePairId: String): Promise<any> {
        return (await this.tradePairsContract.getTakerRate(tradePairId))
    }

    async getBookfromChain(tradePairId: String): Promise<{ buyBook: { price: number, quantity: number }[], sellBook: { price: number, quantity: number }[] }> {
        var borders = await this.tradePairsContract.getNBuyBook(tradePairId, 1, 1, 0, '0x0000000000000000000000000000000000000000000000000000000000000000');
        var sorders = await this.tradePairsContract.getNSellBook(tradePairId, 1, 1, 0, '0x0000000000000000000000000000000000000000000000000000000000000000')
        var buyOrderArray: { price: number, quantity: number }[] = [];
        var sellOrderArray: { price: number, quantity: number }[] = [];
        console.log('borders')
        console.log(borders)
        console.log('sorders')
        console.log(sorders)
        sellOrderArray.push({ price: sorders[0].toString(), quantity: sorders[1].toString() });
        buyOrderArray.push({ price: borders[0].toString(), quantity: borders[1].toString() });
        return { buyBook: buyOrderArray, sellBook: sellOrderArray };
    }

    async getAveragePrice(tradePairId: String): Promise<number> {
        const books = await this.getBookfromChain(tradePairId);

        console.log(books)
        // let buyPrice = +utils.formatUnits((books.buyBook[0].price), this.quoteDecimals)
        // let sellPrice = +utils.formatUnits((books.sellBook[0].price), this.baseDecimals)

        let buyPrice = +utils.formatUnits((books.buyBook[0].price), this.baseDecimals)
        let sellPrice = +utils.formatUnits((books.sellBook[0].price), this.quoteDecimals)
        console.log(buyPrice)
        console.log(sellPrice)
        // buyPrice = sellPrice = InitialPrice //Math.max(buyPrice, sellPrice)

        if (buyPrice === 0 || sellPrice === 0) {
            buyPrice = sellPrice = Math.max(buyPrice, sellPrice)
            if (buyPrice === 0) {
                buyPrice = sellPrice = InitialPrice
            }
        }

        return (buyPrice + sellPrice) / 2
    }


    async addOrder(tradePairId: string, price: number, quantity: number, side: Side, type: OrderType) {
        const priceFormatted = utils.parseUnits(price.toFixed(this.quoteDisplayDecimals), this.quoteDecimals)
        const quantityFormatted = utils.parseUnits(quantity.toFixed(this.baseDisplayDecimals), this.baseDecimals)
        const tx = await this.tradePairsContract.addOrder(tradePairId, priceFormatted, quantityFormatted, side, type)

        const res = await tx.wait()
        return res
    }

    async cancelOrder(tradePairId: string, orderId: string): Promise<any> {
        const tx = await this.tradePairsContract.cancelOrder(tradePairId, orderId)

        const res = await tx.wait()

        return res
    }

    async cancelAllOrders(tradePairId: string, orderIds: string[]) {
        if (orderIds.length > 0) {
            const tx = await this.tradePairsContract.cancelAllOrders(tradePairId, orderIds)

            const res = await tx.wait()

            return res
        }
    }

    private _hexToA(hex: string): string {
        return Buffer.from(hex.substring(2), 'hex').filter(e => e != 0).toString()
    }
}