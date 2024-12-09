// module.exports = {
//   preset: 'jest-puppeteer',
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest',
//   },
//   testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
// };

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 50_000,
};
