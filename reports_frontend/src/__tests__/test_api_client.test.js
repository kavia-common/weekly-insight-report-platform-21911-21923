import {
  getApiBaseUrl,
  apiRequest,
  setAuthToken,
  setExtraHeaders,
  getExtraHeaders,
} from "../api/client";

describe("api/client", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockReset();
    setAuthToken(null);
    setExtraHeaders({});
  });

  test("getApiBaseUrl reads REACT_APP_API_BASE_URL and trims trailing slash", () => {
    process.env.REACT_APP_API_BASE_URL = "https://api.example.com/base/";
    expect(getApiBaseUrl()).toBe("https://api.example.com/base");
  });

  test("injects Authorization header when token set", async () => {
    setAuthToken("abc123");
    global.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    await apiRequest("/users/me");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [_url, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc123");
  });

  test("merges extra headers", async () => {
    setExtraHeaders({ "X-Project": "Weekly" });
    expect(getExtraHeaders()).toEqual({ "X-Project": "Weekly" });
    global.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    await apiRequest("/ping");
    const [_url, options] = global.fetch.mock.calls[0];
    expect(options.headers["X-Project"]).toBe("Weekly");
  });

  test("returns JSON when content-type is application/json", async () => {
    global.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ hello: "world" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    const res = await apiRequest("/json");
    expect(res).toEqual({ hello: "world" });
  });

  test("returns text for non-json responses", async () => {
    global.fetch.mockResolvedValueOnce(
      new Response("OK", {
        status: 200,
        headers: { "content-type": "text/plain" },
      })
    );
    const res = await apiRequest("/text");
    expect(res).toBe("OK");
  });

  test("normalizes HTTP error with json body", async () => {
    global.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Bad things" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    );
    await expect(apiRequest("/bad")).rejects.toMatchObject({
      ok: false,
      status: 400,
      message: "Bad things",
    });
  });

  test("normalizes HTTP error with text body", async () => {
    global.fetch.mockResolvedValueOnce(
      new Response("Not allowed", {
        status: 403,
        headers: { "content-type": "text/plain" },
      })
    );
    await expect(apiRequest("/forbidden")).rejects.toMatchObject({
      ok: false,
      status: 403,
      message: "Not allowed",
    });
  });

  test("throws network error when fetch rejects", async () => {
    global.fetch.mockRejectedValueOnce(new Error("network down"));
    await expect(apiRequest("/x")).rejects.toMatchObject({
      status: 0,
      code: "NETWORK_ERROR",
      message: "network down",
    });
  });

  test("raw mode returns Response and throws on !ok", async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response("file", { status: 200, headers: { "content-type": "application/octet-stream" } })
      )
      .mockResolvedValueOnce(new Response("nope", { status: 404 }));
    const res = await apiRequest("/download", { raw: true });
    expect(res).toBeInstanceOf(Response);
    await expect(apiRequest("/missing", { raw: true })).rejects.toMatchObject({ status: 404 });
  });
});
