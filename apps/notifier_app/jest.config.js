module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|react-native-css-interop|nativewind|react-native-svg|lucide-react-native)/)',
  ],
};
