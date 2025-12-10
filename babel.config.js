module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Mantiene la configuración de NativeWind
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // AGREGAR ESTA SECCIÓN:
    plugins: [
      "react-native-reanimated/plugin", // ESTE ES EL PLUGIN QUE FALTABA
    ],
  };
};