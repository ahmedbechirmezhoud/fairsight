import { Platform } from "react-native"
import {
  Poppins_300Light as poppinsLight,
  Poppins_400Regular as poppinsRegular,
  Poppins_500Medium as poppinsMedium,
  Poppins_600SemiBold as poppinsSemiBold,
  Poppins_700Bold as poppinsBold,
} from "@expo-google-fonts/poppins"

export const customFontsToLoad = {
  poppinsLight,
  poppinsRegular,
  poppinsMedium,
  poppinsSemiBold,
  poppinsBold,
}

const fonts = {
  poppins: {
    light: "poppinsLight",
    normal: "poppinsRegular",
    medium: "poppinsMedium",
    semiBold: "poppinsSemiBold",
    bold: "poppinsBold",
  },
  helveticaNeue: {
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    normal: "Courier",
  },
  sansSerif: {
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    normal: "monospace",
  },
}

export const typography = {
  fonts,
  primary: fonts.poppins,
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}

/**
 * Ready-to-use text presets following the FairFleet type scale.
 * All use Poppins. Apply directly to Text style or spread into StyleSheet.
 *
 * @example
 * import { textPresets } from "@/theme/typography"
 * <Text style={textPresets.h1}>Title</Text>
 */
export const textPresets = {
  /** Hero moments only — 32/40 bold */
  display: { fontFamily: fonts.poppins.bold, fontSize: 32, lineHeight: 40 },
  /** Screen titles — 24/32 bold */
  h1: { fontFamily: fonts.poppins.bold, fontSize: 24, lineHeight: 32 },
  /** Section titles — 20/28 semiBold */
  h2: { fontFamily: fonts.poppins.semiBold, fontSize: 20, lineHeight: 28 },
  /** Card titles — 17/24 semiBold */
  h3: { fontFamily: fonts.poppins.semiBold, fontSize: 17, lineHeight: 24 },
  /** Default body copy — 15/22 regular */
  body: { fontFamily: fonts.poppins.normal, fontSize: 15, lineHeight: 22 },
  /** Captions, metadata — 13/18 regular */
  bodySm: { fontFamily: fonts.poppins.normal, fontSize: 13, lineHeight: 18 },
  /** Labels, badges — 11/16 medium, tracked */
  caption: { fontFamily: fonts.poppins.medium, fontSize: 11, lineHeight: 16, letterSpacing: 0.4 },
} as const
