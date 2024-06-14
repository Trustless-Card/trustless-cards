import { providers } from "ethers"

interface EthereumEventEmitter {
    on(event: string, listener: (...args: any[]) => void): void;
    removeListener(event: string, listener: (...args: any[]) => void): void;
}

interface EthereumProvider extends EthereumEventEmitter {
    request(args: { method: string, params?: Array<any> }): Promise<any>;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}
