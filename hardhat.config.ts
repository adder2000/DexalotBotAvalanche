// import {task} from "hardhat/config"
// import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers"
// import {BigNumber} from "ethers"
import "@nomiclabs/hardhat-waffle"

// When using the hardhat network, you may choose to fork Fuji or Avalanche Mainnet
// This will allow you to debug contracts using the hardhat network while keeping the current network state
// To enable forking, turn one of these booleans on, and then run your tasks/scripts using ``--network hardhat``
// For more information go to the hardhat guide
// https://hardhat.org/hardhat-network/
// https://hardhat.org/guides/mainnet-forking.html
const FORK_FUJI = false
const FORK_MAINNET = false
const forkingData = FORK_FUJI ? {
    url: 'https://api.avax-test.network/ext/bc/C/rpc',
} : FORK_MAINNET ? {
    url: 'https://api.avax.network/ext/bc/C/rpc'
} : undefined

export default {
    solidity: {
        compilers: [
            {
                version: "0.5.16"
            },
            {
                version: "0.6.2"
            },
            {
                version: "0.6.4"
            },
            {
                version: "0.7.0"
            },
            {
                version: "0.8.0"
            },
            {
                version: "0.8.3"
            }, {
                version: "0.8.4"
            }

        ]
    },
    networks: {
        hardhat: {
            gasPrice: 225000000000,
            chainId: !forkingData ? 43112 : undefined, //Only specify a chainId if we are not forking
            forking: forkingData
        },
        dexalot: {
            url: 'https://node.dexalot-dev.com/ext/bc/C/rpc',
            gasPrice: 2500000000000,
            gas:8000000,
            blockGasLimit: 40000000,
            chainId: 43112,
            accounts: ["0xc984c04175d5ef31ae0a6447ee526e487d7d4f74002afd0f04bb5048316bcde6"]
        },
    }
}
