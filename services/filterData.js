function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}
export default function filterData(data, requestQueryParams) {
  const filtersJSONString = requestQueryParams.filters;
  const filtersFromReq = filtersJSONString ? JSON.parse(filtersJSONString) : [];

  let filteredResponses = data.responses.filter((response) => {
    return filtersFromReq.every(({ id, condition, value }) => {
      const question = response.questions.find((q) => q.id === id);

      if (!question) return false; // Question ID not found in response

      const questionValue = question.value;
      const isDate = isValidDate(value) && isValidDate(questionValue);

      switch (condition) {
        case "equals":
          return isDate
            ? new Date(questionValue).getTime() === new Date(value).getTime()
            : questionValue === value;
        case "does_not_equal":
          return isDate
            ? new Date(questionValue).getTime() !== new Date(value).getTime()
            : questionValue !== value; // Corrected comparison logic
        case "greater_than":
          return isDate
            ? new Date(questionValue).getTime() > new Date(value).getTime()
            : questionValue > value;
        case "less_than":
          return isDate
            ? new Date(questionValue).getTime() < new Date(value).getTime()
            : questionValue < value;
        default:
          return false; // Invalid condition
      }
    });
  });
  data.responses = filteredResponses;
  data.totalResponses = filteredResponses.length;

  return data;
}
