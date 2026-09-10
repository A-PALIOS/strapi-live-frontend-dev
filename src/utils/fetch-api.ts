type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface FetchAPIOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  authToken?: string;
  body?: Record<string, unknown>;
  next?: NextFetchRequestConfig;
}

export async function fetchAPI(url: string, options: FetchAPIOptions) {
  const { method, authToken, body, next } = options;

  const headers: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(next && { next }),
  };

  try {
    const response = await fetch(url, headers);
    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      contentType.includes("application/json") &&
      response.ok
    ) {
      console.log("Response OK:", response);
      return await response.json();
    } else {
      // Surface WHY the request failed. Without this a Strapi 400 (e.g. an
      // unknown component key under populate[blocks][on]) is indistinguishable
      // from "no such page": callers only see a missing `data` and call
      // notFound(), so the browser shows a clean 404 and the real cause is lost.
      let details = "";
      try {
        details = (await response.text()).slice(0, 800);
      } catch {
        details = "<no response body>";
      }
      console.error(
        `[fetchAPI] ${method} ${response.status} ${response.statusText}\n  url: ${url}\n  body: ${details}`
      );
      return { status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error(`Error ${method} data:`, error);
    throw error;
  }
}