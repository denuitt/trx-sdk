import os from "os";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";
import fetch from "node-fetch";
import dotenv from "dotenv";
import express from "express";
import { errors } from "./src/errors.ts";
import TronWalletHD from "tron-wallet-hd";
import type {Wallet} from "./src/types.ts";
import {TronWeb} from "tronweb";


const AUTH_TOKEN = process.env.AUTH_TOKEN;

let PORT = process.env.PORT;
if (PORT == undefined) {
    PORT = "3000";
}

if (!AUTH_TOKEN) {}

if (AUTH_TOKEN == undefined) {
    console.error("AUTH_TOKEN is missing");
    process.exit(1);
}



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

const tronwallet = new TronWallet();

// const tronWeb = new TronWeb({
//     fullHost: 'https://api.trongrid.io',
//     headers: {
//         'TRON-PRO-API-KEY': '4896d3f6-e7c3-4929-bbdd-31111b934c43\n',
//     },
//     privateKey: 'YOUR_PRIVATE_KEY',
// });


const router = express();

router.use(express.json());

router.get("/v1/generate", async (req: any, res: any) => {
    try {
        const wallet = await tronwallet.generate();
        if (wallet == undefined) {
            res.json({
                status: "error",
                error: errors.FAILED,
            });
            return;
        }
        res.json({
            status: "OK",
            wallet: wallet,
        });
    } catch (err) {
        console.error(`ERR: ${err}`);
        res.json({
            status: "error",
            error: errors.INTERNAL_SERVER_ERROR,
        });
    }
});

router.post("/v1/transaction/send", async (req: any, res: any) => {
    try {
        const request_data = req.body;
        const mnemonic: string = request_data.mnemonic;
        const private_key: string = request_data.private_key;
        const from_address: string = request_data.from_address;
        const to_address: string = request_data.to_address;
        const amount: number = request_data.amount;

        const tronweb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            headers: {
                'TRON-PRO-API-KEY': '4896d3f6-e7c3-4929-bbdd-31111b934c43',
            },
            privateKey: private_key,
        });

        const transaction = await tronweb.trx.sendTransaction(from_address, amount, {
            // feeLimit: 100_000_000, // adjust the fee limit as needed
            // callValue: 0,
            // shouldPollResponse: true, // wait for transaction confirmation
        });

        res.json({
            status: "OK",
            transaction: transaction,
        });
    } catch (err) {
        console.error(err);
        res.json({
            status: "error",
            error: errors.INTERNAL_SERVER_ERROR,
        })
    }
});

router.listen(3000, async () => {
    console.log("Server listening on localhost:8000");
});


