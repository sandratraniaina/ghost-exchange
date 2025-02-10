import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    QueryConstraint,
    DocumentData
} from "firebase/firestore";

interface FetchOptions {
    constraints?: QueryConstraint[];
    errorMessage?: string;
}

interface FirebaseError extends Error {
    code?: string;
}

export class FirebaseDataError extends Error {
    constructor(message: string, public originalError?: FirebaseError) {
        super(message);
        this.name = "FirebaseDataError";
    }
}

/**
 * Fetches multiple documents from a collection
 * @param collectionName The name of the collection to fetch from
 * @param options Query constraints and error handling options
 * @returns Array of documents with their IDs
 */
export async function fetchCollection<T = DocumentData>(
    collectionName: string,
    options: FetchOptions = {}
): Promise<(T & { id: string })[]> {
    try {
        const collectionRef = collection(db, collectionName);
        const queryRef = options.constraints
            ? query(collectionRef, ...options.constraints)
            : collectionRef;

        const querySnapshot = await getDocs(queryRef);
        console.log(querySnapshot.docs);
        return querySnapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as T & { id: string })
        );
    } catch (error) {
        throw new FirebaseDataError(
            options.errorMessage ??
                `Failed to fetch ${collectionName} collection`,
            error as FirebaseError
        );
    }
}

/**
 * Fetches a single document by ID
 * @param collectionName The name of the collection
 * @param documentId The ID of the document to fetch
 * @param options Error handling options
 * @returns Document data with ID or null if not found
 */
export async function fetchDocument<T = DocumentData>(
    collectionName: string,
    documentId: string,
    options: Omit<FetchOptions, "constraints"> = {}
): Promise<(T & { id: string }) | null> {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return {
            id: docSnap.id,
            ...docSnap.data(),
        } as T & { id: string };
    } catch (error) {
        throw new FirebaseDataError(
            options.errorMessage ??
                `Failed to fetch document ${documentId} from ${collectionName}`,
            error as FirebaseError
        );
    }
}

/**
 * Fetches documents based on a field value
 * @param collectionName The name of the collection
 * @param field The field to query
 * @param value The value to match
 * @param options Additional query constraints and error handling options
 * @returns Array of matching documents with their IDs
 */
export async function fetchByField<T = DocumentData>(
    collectionName: string,
    field: string,
    value: any,
    options: FetchOptions = {}
): Promise<(T & { id: string })[]> {
    const constraints = [
        where(field, "==", value),
        ...(options.constraints || []),
    ];

    return fetchCollection<T>(collectionName, {
        ...options,
        constraints,
        errorMessage:
            options.errorMessage ??
            `Failed to fetch ${collectionName} by ${field}`,
    });
}

// Example usage types
interface User {
    email: string;
    name: string;
    role: string;
}

interface Post {
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
}


