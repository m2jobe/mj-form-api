import filterData from "../filterData.js"; // Update the path to your module

describe("filterData", () => {
  test('should filter responses based on the "equals" condition', () => {
    const data = {
      responses: [
        { questions: [{ id: "id1", value: "value1" }] },
        { questions: [{ id: "id1", value: "value2" }] },
      ],
      limit: 10,
      pageCount: 1,
    };
    const requestQueryParams = {
      filters: '[{"id":"id1","condition":"equals","value":"value1"}]',
    };

    const filteredData = filterData(data, requestQueryParams);

    expect(filteredData.responses).toEqual([
      { questions: [{ id: "id1", value: "value1" }] },
    ]);
    expect(filteredData.totalResponses).toBe(1);
    expect(filteredData.pageCount).toBe(1);
  });

  test('should filter responses based on the "does_not_equal" condition', () => {
    const data = {
      responses: [
        { questions: [{ id: "id1", value: "value1" }] },
        { questions: [{ id: "id1", value: "value2" }] },
      ],
      limit: 10,
      pageCount: 1,
    };
    const requestQueryParams = {
      filters: '[{"id":"id1","condition":"does_not_equal","value":"value1"}]',
    };

    const filteredData = filterData(data, requestQueryParams);

    expect(filteredData.responses).toEqual([
      { questions: [{ id: "id1", value: "value2" }] },
    ]);
    expect(filteredData.totalResponses).toBe(1);
    expect(filteredData.pageCount).toBe(1);
  });

  test('should filter responses based on the "greater_than" condition', () => {
    const data = {
      responses: [
        { questions: [{ id: "id1", value: 5 }] },
        { questions: [{ id: "id1", value: 10 }] },
      ],
      limit: 10,
      pageCount: 1,
    };
    const requestQueryParams = {
      filters: '[{"id":"id1","condition":"greater_than","value":7}]',
    };

    const filteredData = filterData(data, requestQueryParams);

    expect(filteredData.responses).toEqual([
      { questions: [{ id: "id1", value: 10 }] },
    ]);
    expect(filteredData.totalResponses).toBe(1);
    expect(filteredData.pageCount).toBe(1);
  });

  test('should filter responses based on the "less_than" condition', () => {
    const data = {
      responses: [
        { questions: [{ id: "id1", value: 5 }] },
        { questions: [{ id: "id1", value: 10 }] },
      ],
      limit: 10,
      pageCount: 1,
    };
    const requestQueryParams = {
      filters: '[{"id":"id1","condition":"less_than","value":7}]',
    };

    const filteredData = filterData(data, requestQueryParams);

    expect(filteredData.responses).toEqual([
      { questions: [{ id: "id1", value: 5 }] },
    ]);
    expect(filteredData.totalResponses).toBe(1);
    expect(filteredData.pageCount).toBe(1);
  });
});
