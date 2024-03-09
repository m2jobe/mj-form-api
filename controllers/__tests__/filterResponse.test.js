import { createHttpClient } from "../../api/apiClient";
import filterResponse from "../filterResponse";
import filterData from "../../services/filterData";
import { EXTERNAL_API_URL, API_KEY, DEMO_FORM_ID } from "../../config";

let req, res, mockFilteredData, mockHttpClient, mockFormId;

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
  mockFormId = "form-id-1";
  mockFilteredData = {
    responses: [
      {
        questions: [
          {
            id: "nameId",
            name: "What's your name?",
            type: "ShortAnswer",
            value: "Timmy",
          },
          {
            id: "birthdayId",
            name: "What is your birthday?",
            type: "DatePicker",
            value: "2024-02-22T05:01:47.691Z",
          },
        ],
        submissionId: "abc",
        submissionTime: "2024-05-16T23:20:05.324Z",
      },
    ],
    totalResponses: 1,
    pageCount: 1,
  };
  req = { query: { limit: 10, status: 200 }, params: { formId: mockFormId } };
  res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("filterResponse", () => {
  it("should filter response data and send JSON response", async () => {
    filterData.mockReturnValue(mockFilteredData);

    await filterResponse(req, res);

    expect(createHttpClient).toHaveBeenCalledWith();
    expect(mockHttpClient.constructURL).toHaveBeenCalledWith(
      `${EXTERNAL_API_URL}/v1/api/forms/${mockFormId}/submissions`,
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
  });
});
