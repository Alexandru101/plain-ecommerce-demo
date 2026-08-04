import { FetchRequestInfo as ReqInfo } from "./Types";

async function GET<T>(url: string, requestInfo: ReqInfo): Promise<T> {
    const response = await fetch(url, {
        method: "GET",
        headers: requestInfo?.headers || { "Content-Type": "application/json" },
        body: null
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} -> ${response.statusText}`)
    }

    return response.json() as T;
}

async function POST<T>(url: string, requestInfo: ReqInfo): Promise<T> {
    const response = await fetch(url, {
        method: "POST",
        headers: requestInfo?.headers || { "Content-Type": "application/json" },
        body: requestInfo?.body ? JSON.stringify(requestInfo.body) : null
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} -> ${response.statusText}`)
    }

    return response.json() as T;
}

// ----------------------------------------- //
// Create refresh access token function next //
// ----------------------------------------- //

const ApiClient = {
    get: GET,
    post: POST
};

export default ApiClient;