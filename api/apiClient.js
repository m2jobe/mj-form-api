import axios from "axios";

export default class AxiosHttpClient {
  async get(url, headers) {
    const response = await axios.get(url, { headers });
    return response.data;
  }

  constructURL(baseURL, queryParams) {
    const url = new URL(baseURL);
    const params = new URLSearchParams();

    for (const [key, values] of Object.entries(queryParams)) {
      params.append(key, values.length === 1 ? values[0] : values.join(","));
    }

    url.search = params.toString();
    return url;
  }
}

export function createHttpClient() {
  return new AxiosHttpClient();
}
