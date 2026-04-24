import { ExpoConfig, ConfigContext } from "@expo/config"
import { withStringsXml, AndroidConfig } from "@expo/config-plugins"

/**
 * Use tsx/cjs here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript.
 *
 * See https://docs.expo.dev/config-plugins/plugins/#add-typescript-support-and-convert-to-dynamic-app-config
 */
import "tsx/cjs"

/**
 * Writes the Mapbox public access token to Android's strings.xml so the
 * native MapView constructor can read it before the JS bridge is ready.
 *
 * Without this, MapboxConfigurationException is thrown at startup because
 * MapboxGL.setAccessToken() (JS-side) fires too late.
 *
 * Token source: EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.
 */
function withMapboxAccessToken(c: ExpoConfig, token: string): ExpoConfig {
  return withStringsXml(c, (cfg) => {
    cfg.modResults = AndroidConfig.Strings.setStringItem(
      [{ $: { name: "mapbox_access_token", translatable: "false" }, _: token }],
      cfg.modResults,
    )
    return cfg
  }) as ExpoConfig
}

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  let result: Partial<ExpoConfig> = {
    ...config,
    ios: {
      ...config.ios,
      // This privacyManifests is to get you started.
      // See Expo's guide on apple privacy manifests here:
      // https://docs.expo.dev/guides/apple-privacy/
      // You may need to add more privacy manifests depending on your app's usage of APIs.
      // More details and a list of "required reason" APIs can be found in the Apple Developer Documentation.
      // https://developer.apple.com/documentation/bundleresources/privacy-manifest-files
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"], // CA92.1 = "Access info from same app, per documentation"
          },
        ],
      },
    },
    plugins: [
      ...existingPlugins,
      // @rnmapbox/maps plugin handles the Maven download token (Android build-time).
      // The deprecated RNMapboxMapsDownloadToken prop is intentionally omitted here —
      // set RNMAPBOX_MAPS_DOWNLOAD_TOKEN as an env var instead (SDK v11 usually doesn't need it).
      "@rnmapbox/maps",
    ],
  }

  // Write the Mapbox public access token to android/app/src/main/res/values/strings.xml
  // so the native MapView can read it at init time (before JS bridge is available).
  const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
  if (mapboxToken) {
    result = withMapboxAccessToken(result as ExpoConfig, mapboxToken)
  }

  return result
}
