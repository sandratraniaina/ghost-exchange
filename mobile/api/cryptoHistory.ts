import { db } from "../firebase";
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

export interface Cryptocurrency {
    id: number;
    name: string;
    symbol: string;
    fiatPrice: string;
}

export interface XeHistory {
    cryptoCurrency: Cryptocurrency;
    id: number;
    fiatPrice: string;
    timestamp: string;
}

export class CryptoService {
    private static readonly CRYPTO_COLLECTION = "cryptocurrency";
    private static readonly HISTORY_COLLECTION = "xe_history";

    /**
     * Generates a random color in hex format
     */
    static generateRandomColor(): string {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * Fetches all available cryptocurrencies
     */
    static async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
        try {
            const cryptoRef = collection(db, this.CRYPTO_COLLECTION);
            const querySnapshot = await getDocs(cryptoRef);

            const cryptocurrencies: Cryptocurrency[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Cryptocurrency;
                cryptocurrencies.push({
                    id: data.id,
                    name: data.name,
                    symbol: data.symbol,
                    fiatPrice: data.fiatPrice,
                });
            });

            return cryptocurrencies;
        } catch (error) {
            console.error("Error fetching cryptocurrencies:", error);
            throw new Error("Failed to fetch cryptocurrencies");
        }
    }

    /**
     * Fetches latest 10 history records for a specific cryptocurrency
     */
    static async getLatestHistoryForCrypto(
        cryptoId: number
    ): Promise<XeHistory[]> {
        try {
            const historyRef = collection(db, this.HISTORY_COLLECTION);
            const historyQuery = query(
                historyRef,
                where("cryptocurrency.id", "==", cryptoId)
            );

            const querySnapshot = await getDocs(historyQuery);

            const history: XeHistory[] = [];
            console.log(querySnapshot);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                history.push({
                    id: data.id,
                    cryptoCurrency: data.cryptoCurrency,
                    fiatPrice: data.fiatPrice,
                    timestamp: data.timestamp,
                });
            });
            return history;
        } catch (error) {
            console.error(
                `Error fetching history for crypto ID ${cryptoId}:`,
                error
            );
            throw new Error(
                `Failed to fetch history for crypto ID ${cryptoId}`
            );
        }
    }
}
