import { createHttpClient } from "../api/apiClient.js";
import filterData from "../services/filterData.js";
import { EXTERNAL_API_URL, API_KEY } from "../config.js";

const apiClient = createHttpClient();

async function filterResponse(req, res) {
  const formId = req.params.formId;

  try {
    const validQueryParams = [
      "limit",
      "afterDate",
      "beforeDate",
      "offset",
      "status",
      "includeEditLink",
      "sort",
    ];

    const filteredParams = Object.entries(req.query)
      .filter(([key]) => validQueryParams.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = acc[key] ? [...acc[key], value] : [value];
        return acc;
      }, {});

    const url = apiClient.constructURL(
      `${EXTERNAL_API_URL}/v1/api/forms/${formId}/submissions`,
      filteredParams
    );

    const response = await apiClient.get(url, {
      Authorization: `Bearer ${API_KEY}`,
    });

    const filteredData = filterData(response, req.query);
    res.json(filteredData);
  } catch (error) {
    // Handle potential validation errors from the external API
    const response = error.response;
    const responseStatus = (response && response.status) ?? 500;
    let errorMessage =
      response?.data?.message ?? "Error communicating with external API";

    // Check if errorMessage is a string
    if (typeof errorMessage === "string") {
      try {
        // Attempt to parse if it's a string
        errorMessage = JSON.parse(errorMessage);
      } catch (parseError) {
        // If parsing fails, indicate that the message likely wasn't JSON
        console.error("Error parsing error message as JSON:", parseError);
      }
    }

    res.status(responseStatus).json({ message: errorMessage });
  }
}

export default filterResponse;
