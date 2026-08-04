// Types //
import { FetchRequestInfo as ReqInfo } from "./Types";

// Fetching API //
function fetchApi(url: string, requestInfo: ReqInfo): Promise<Response> {
    return fetch(url, {
        method: requestInfo.method,
        headers: requestInfo.headers ?? { "Content-Type": "application/json" },
        body: requestInfo.body ? JSON.stringify(requestInfo.body) : undefined
    });
}

// Requesting API Handler //
async function request<T>(url: string, requestInfo: ReqInfo): Promise<T> {
    let response = await fetchApi(url, requestInfo);

    if (response.status === 401) {
        await refreshAccessToken();

        response = await fetchApi(url, requestInfo);
        if (!response.ok) {
            throw new Error("Request failed after token refresh: " + response.status + " -> " + response.statusText);
        }
    }

    if (!response.ok) {
        throw new Error("Request failed: " + response.status + " -> " + response.statusText);
    }

    return await response.json() as T;
};

// Requesting API Methods //
async function GET<T>(url: string, requestInfo: ReqInfo): Promise<T> {
    return request<T>(url, { ...requestInfo, method: "GET" });
};

async function POST<T>(url: string, requestInfo: ReqInfo): Promise<T> {
    return request<T>(url, { ...requestInfo, method: "POST" });
};

// Refreshing access token using refresh token //
async function refreshAccessToken() {

    // ------------------------------------------ //
    // Next implement refresh token logic here    //
    // and complete backend API for refresh token //
    // ------------------------------------------ //
};

// Creating API Client Object //
const ApiClient = {
    get: GET,
    post: POST
};

export default ApiClient;