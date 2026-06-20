
const {
  withAndroidManifest,
  withSettingsGradle,
  withDangerousMod,
} = require('expo/config-plugins');

const path = require('path');
const fs   = require('fs');

// PayHere: add JitPack to settings.gradle 
function withJitpack(config) {
  return withSettingsGradle(config, function (mod) {
    if (mod.modResults.contents.includes('jitpack.io')) return mod;
    mod.modResults.contents = mod.modResults.contents.replace(
      /(dependencyResolutionManagement[\s\S]*?repositories\s*\{)/,
      '$1\n        maven { url "https://jitpack.io" }'
    );
    return mod;
  });
}

// PayHere: fix AndroidManifest allowBackup conflict 
function withPayHereManifest(config) {
  return withAndroidManifest(config, function (mod) {
    var manifest    = mod.modResults.manifest;
    var application = manifest.application && manifest.application[0];
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }
    if (application && !application.$['tools:replace']) {
      application.$['tools:replace'] = 'android:allowBackup';
    }
    return mod;
  });
}

//PayHere: add pods to iOS Podfile 
function withPayHerePods(config) {
  return withDangerousMod(config, [
    'ios',
    function (mod) {
      var podfilePath = path.join(mod.modRequest.platformProjectRoot, 'Podfile');
      var contents    = fs.readFileSync(podfilePath, 'utf-8');
      if (contents.includes('payHereSDK')) return mod;
      var podLines =
        "\n  pod 'payHereSDK', " +
        ":git => 'https://github.com/PayHereDevs/payhere-mobilesdk-ios-rb.git'" +
        "\n  pod 'payhere-mobilesdk-reactnative', " +
        ":path => '../node_modules/@payhere/payhere-mobilesdk-reactnative'";
      contents = contents.replace(/(use_react_native!.*)/, '$1' + podLines);
      fs.writeFileSync(podfilePath, contents, 'utf-8');
      return mod;
    },
  ]);
}


var baseConfig = {
  expo: {
    name: "fitness",
    slug: "fitness",
    version: "1.0.0",
    sdkVersion: "56.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "fitness",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.chari1993.fitness",
      deploymentTarget: "13.4"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/adaptive-icon.png"
      },
      predictiveBackGestureEnabled: false,
      package: "com.chari1993.fitness"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-dev-client",
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: { backgroundColor: "#000000" }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "c629ec48-7fca-4f81-851d-15a0405f2793"
      }
    },
    owner: "chari1993"
  }
};

// Apply PayHere native modifications and export
module.exports = function (params) {
  var config = baseConfig;
  config = withJitpack(config);
  config = withPayHereManifest(config);
  config = withPayHerePods(config);
  return config;
};