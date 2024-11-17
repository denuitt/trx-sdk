
import TronWalletHD from "tron-wallet-hd";
import type {Wallet} from "./types.ts";



class TronWallet {
    private keystore: any;

    constructor () {
        this.keystore= TronWalletHD.keyStore;
    }

    async generate() : Promise<Wallet | undefined> {
        try {
            const mnemonic = TronWalletHD.utils.generateMnemonic();
            const accounts = await TronWalletHD.utils.generateAccountsWithMnemonic(mnemonic);
            const account = accounts[0];
            const address = account["address"];
            const private_key = account["privateKey"];
            return {
                mnemonic: mnemonic,
                address: address,
                private_key: private_key,
                public_key: "",
            } as Wallet;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }
}

export default new TronWallet();