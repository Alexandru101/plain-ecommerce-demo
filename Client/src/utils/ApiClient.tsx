// Types //
import { FetchRequestInfo as ReqInfo } from "./Types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_PORT;

// Fetching API //
function fetchApi(url: string, requestInfo: ReqInfo): Promise<Response> {
    return fetch(url, {
        method: requestInfo.method,
        credentials: "include",
        headers: requestInfo.headers ?? { "Content-Type": "application/json" },
        body: requestInfo.body ? JSON.stringify(requestInfo.body) : undefined
    });
}

// Requesting API Handler //
async function request<T>(url: string, requestInfo: ReqInfo): Promise<T> {
    let response = await fetchApi(url, requestInfo);

    if (response.status === 401) {
        if (!(await refreshAccessToken())) {
            throw new Error("Failed to refresh access token");
        }

        response = await fetchApi(url, requestInfo);
        if (!response.ok) {
            throw new Error("Request failed after token refresh: " + response.status + " -> " + response.statusText);
        }
    }

    if (!response.ok) {
        throw new Error("Request failed: " + response.status + " -> " + response.statusText);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
        return await response.json() as T;
    }

    return await response.text() as T;
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
    const response = await fetch(`${BACKEND_URL}/api/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: undefined // Not required as the refresh token is sent via cookies
    });

    return response.ok;
};

// Creating API Client Object //
const ApiClient = {
    get: GET,
    post: POST
};

export default ApiClient;