//! dummy services only for development purposes!!
export const submitCode = async ({ input, output }) => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(`mockToken-${Math.random().toString(36).substr(2)}`),
      200
    );
  });
};

export const verifyToken = async (token) => {
  const isCorrect = Math.random() > 0.2;
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          id: isCorrect ? 3 : 4,
          description: isCorrect ? "Accepted" : "Wrong Answer",
        }),
      400
    );
  });
};

export const runTestCase = async ({ input, output }) => {
  const passed = Math.random() > 0.3;

  return { passed };
};

export const runTestCases = async ({ testCases }) => {
  const results = testCases.map((testCase) => {
    let passed = Math.random() > 0.3 ? true : false;

    return {
      ...testCase,
      passed: passed,
      error: passed ? "Wrong Answer" : null,
    };
  });

  return results;
};
