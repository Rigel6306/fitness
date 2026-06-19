// plugins/withPayHere.js
const {
  withAndroidManifest,
  withSettingsGradle,
  withDangerousMod,
} = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

// ─── Android: inject JitPack into settings.gradle ──────────────────────────
// Expo SDK 50+ uses dependencyResolutionManagement in settings.gradle,
// not allprojects{} in build.gradle.
const withJitpack = (config) => {
  return withSettingsGradle(config, (mod) => {
    const contents = mod.modResults.contents;
    if (contents.includes('https://jitpack.io')) {
      return mod; // already present
    }
    // Insert jitpack into the repositories block inside dependencyResolutionManagement
    mod.modResults.contents = contents.replace(
      /(dependencyResolutionManagement\s*\{[^}]*repositories\s*\{)/s,
      `$1\n        maven { url "https://jitpack.io" }`
    );
    return mod;
  });
};

// ─── Android: add xmlns:tools namespace + tools:replace to AndroidManifest ─
const withPayHereManifest = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;

    // Add xmlns:tools namespace to <manifest>
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Add tools:replace="android:allowBackup" to <application>
    const application = manifest.application?.[0];
    if (application && !application.$['tools:replace']) {
      application.$['tools:replace'] = 'android:allowBackup';
    }

    return mod;
  });
};

// ─── iOS: inject PayHere pods into Podfile ─────────────────────────────────
const withPayHerePods = (config) => {
  return withDangerousMod(config, [
    'ios',
    (mod) => {
      const podfilePath = path.join(
        mod.modRequest.platformProjectRoot,
        'Podfile'
      );

      let contents = fs.readFileSync(podfilePath, 'utf-8');

      if (contents.includes('payHereSDK')) {
        return mod; // already present
      }

      const podLines = [
        "  pod 'payHereSDK', :git => 'https://github.com/PayHereDevs/payhere-mobilesdk-ios-rb.git'",
        "  pod 'payhere-mobilesdk-reactnative', :path => '../node_modules/@payhere/payhere-mobilesdk-reactnative'",
      ].join('\n');

      // Insert after the use_react_native! line
      contents = contents.replace(
        /(use_react_native!.*)/,
        `$1\n${podLines}`
      );

      fs.writeFileSync(podfilePath, contents, 'utf-8');
      return mod;
    },
  ]);
};

// ─── Export combined plugin ─────────────────────────────────────────────────
module.exports = (config) => {
  config = withJitpack(config);
  config = withPayHereManifest(config);
  config = withPayHerePods(config);
  return config;
};