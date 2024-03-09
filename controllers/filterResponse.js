import { createHttpClient } from "../api/apiClient.js";
import filterData from "../services/filterData.js";
import { EXTERNAL_API_URL, API_KEY, DEMO_FORM_ID } from "../config.js";

const apiClient = createHttpClient();

async function filterResponse(req, res) {
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
      `${EXTERNAL_API_URL}/v1/api/forms/${DEMO_FORM_ID}/submissions`,
      filteredParams
    );

    const response = await apiClient.get(url, {
      Authorization: `Bearer ${API_KEY}`,
    });

    const filteredData = filterData(response, req.query);
    res.json(filteredData);
  } catch (error) {
    console.error(error);

    // Handle potential validation errors from the external API
    const response = error.response;
    const responseStatus = (response && response.status) ?? 500;
    const errorMessage =
      response.data?.message ?? "Error communicating with external API";

    res.status(responseStatus).json({ message: JSON.parse(errorMessage) });
  }
}

export default filterResponse;
