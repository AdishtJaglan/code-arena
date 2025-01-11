import { ENV } from "../config/env-config.js";
import axios from "axios";

export const submitCode = async ({ sourceCode, languageId, input, output }) => {
  try {
    const response = await axios.request({
      method: "POST",
      url: `https://${ENV.JUDGE0_API_URL}/submissions`,
      params: { fields: "*" },
      headers: {
        "x-rapidapi-key": ENV.JUDGE0_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        language_id: languageId,
        source_code: sourceCode,
        stdin: input,
        expected_output: output,
      },
    });

    return response.data.token;
  } catch (error) {
    console.error("Error during submission:", error.message);
    throw new Error("Failed to submit code.");
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `https://${ENV.JUDGE0_API_URL}/submissions/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "x-rapidapi-key": ENV.JUDGE0_API_KEY,
      },
    });

    const { status } = response.data || {};

    return status;
  } catch (error) {
    console.error("Error during verification:", error.message);
    throw new Error("Failed to verify submission.");
  }
};

export const runTestCase = async ({
  sourceCode,
  languageId,
  input,
  output,
}) => {
  try {
    const token = await submitCode({ languageId, sourceCode, input, output });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await verifyToken(token);

    const passed = result.id === 3 && result.description === "Accepted";
    return { passed };
  } catch (error) {
    return {
      passed: false,
      error: error.message || "Error during test case execution",
    };
  }
};

export const runTestCases = async ({ sourceCode, languageId, testCases }) => {
  const results = await Promise.all(
    testCases.map(async (testCase) => {
      const testResult = await runTestCase({
        sourceCode,
        languageId,
        input: testCase.input,
        output: testCase.output,
      });

      return {
        ...testCase,
        passed: testResult.passed,
        error: testResult.error || null,
      };
    })
  );

  return results;
};
