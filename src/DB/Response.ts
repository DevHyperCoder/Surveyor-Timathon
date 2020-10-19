import { db } from "../firebase";
import type { IResponse } from "../types/IAnswer";

export async function getResponse(id:string) {

    const doc = await db.collection("responses").doc(id).get();
    const reposone = doc.data() as IResponse;
    return reposone
    
}