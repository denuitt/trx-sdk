


export type Wallet = {
    mnemonic: string;
    public_key: string;
    private_key: string;
    address: string;
    network: string;
}

export type Transaction = {
    id: string;
    hash: string;
    from: string;
    to: string;
    amount: number;
    network: string;
}

