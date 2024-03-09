import { createHttpClient } from "../../api/apiClient";
import filterResponse from "../filterResponse";
import filterData from "../../services/filterData";
import { EXTERNAL_API_URL, API_KEY, DEMO_FORM_ID } from "../../config";

let req, res, next, mockHttpClient;

// Mocking the dependencies
jest.mock("../../services/filterData");

// Mocking createHttpClient to return an object with the necessary methods
jest.mock("../../api/apiClient", () => {
  const originalModule = jest.requireActual("../../api/apiClient");
  mockHttpClient = {
    constructURL: jest.fn().mockReturnValue("mocked-url"),
    get: jest.fn().mockResolvedValue([{ id: 1, status: 200 }]),
  };
  return {
    ...originalModule,
    createHttpClient: jest.fn().mockReturnValue(mockHttpClient),
  };
});

beforeEach(() => {
  req = { query: { limit: 10, status: 200 } };
  res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  next = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("filterResponse", () => {
  it("should filter response data and send JSON response", async () => {
    const mockFilteredData = [{ id: 1 }];

    filterData.mockReturnValue(mockFilteredData);

    await filterResponse(req, res, next);

    expect(createHttpClient).toHaveBeenCalledWith();
    expect(mockHttpClient.constructURL).toHaveBeenCalledWith(
      `${EXTERNAL_API_URL}/v1/api/forms/${DEMO_FORM_ID}/submissions`,
      { limit: [10], status: [200] }
    );
    expect(mockHttpClient.get).toHaveBeenCalledWith("mocked-url", {
      Authorization: `Bearer ${API_KEY}`,
    });
    expect(filterData).toHaveBeenCalledWith(
      [{ id: 1, status: 200 }],
      req.query
    );
    expect(res.json).toHaveBeenCalledWith(mockFilteredData);
    expect(res.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
