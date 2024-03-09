import axios from "axios";
jest.mock("axios");

import { createHttpClient } from "../apiClient";

describe("createHttpClient", () => {
  describe("get", () => {
    // Test the 'get' functionality returned by createHttpClient
    it("should make a GET request with provided headers", async () => {
      const testData = { message: "Success" };
      axios.get.mockResolvedValue({ data: testData });

      const httpClient = createHttpClient();

      const url = "https://api.example.com";
      const headers = { "Content-Type": "application/json" };

      const result = await httpClient.get(url, headers);

      expect(axios.get).toHaveBeenCalledWith(url, { headers });
      expect(result).toEqual(testData);
    });
  });
});
