export const fetcher = (url: string) =>
  fetch(url).then((res) =>
    res.headers.get("content-type")?.includes("json") ? res.json() : res.text()
  );
