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
