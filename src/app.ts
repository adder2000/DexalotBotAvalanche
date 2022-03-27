import "reflect-metadata"
import { container } from "tsyringe";
import { Spread } from "./config";
import { DexalotBot, OrderType, Side } from "./services/DexalotBot";
import { DexalotRestService } from "./services/DexalotRestService";

// console.log('test1')

const start = async () => {
    // container.registerSingleton(DexalotRestService)
    // const service = container.resolve(DexalotRestService)
    const bot = container.resolve(DexalotBot);

    try {
        await bot.start()
    } catch (e: any) {
        console.log(e);

    }
};

export default start;
start()