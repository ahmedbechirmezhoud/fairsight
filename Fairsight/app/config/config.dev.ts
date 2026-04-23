import { Platform } from "react-native"

const getApiUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:3000"
  return "http://localhost:3000" // iOS simulator
}

/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: getApiUrl(),
}
