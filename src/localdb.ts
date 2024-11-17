import os from "os";
import path from "path";
import fs from "fs";
import type {Transaction, Wallet} from "./types.ts";

type DBSchema = {
    wallets: Wallet[];
    transactions: Transaction[];
    _v: string,
}

class LocalDB {
    async init() : Promise<void> {
        try {
            console.log("Initializing local DB...");
            if (!await fs.promises.exists("./db.json")) {
                await fs.promises.writeFile("./db.json", JSON.stringify({} as DBSchema));
            }
            return;
        } catch (err) {
            console.error(`ERR: ${err}`);
            return;
        }
    }

    async add_wallet() : Promise<void> {
        try {
            const data = await fs.promises.readFile("./db.json");
            let json_data = JSON.parse(data.toString());
            json_data["wallets"]
            await fs.promises.writeFile("./db.json", JSON.stringify({}))
        } catch (err) {
            console.error(`ERR: ${err}`);
            return;
        }
    }

}

export default new LocalDB();