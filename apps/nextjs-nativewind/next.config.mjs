/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    'nativewind',
    'react-native-css-interop',
    'react-native-reanimated',
    '@method-inc/accordion',
    '@method-inc/alert-dialog',
    '@method-inc/aspect-ratio',
    '@method-inc/avatar',
    '@method-inc/checkbox',
    '@method-inc/collapsible',
    '@method-inc/context-menu',
    '@method-inc/dialog',
    '@method-inc/dropdown-menu',
    '@method-inc/hover-card',
    '@method-inc/label',
    '@method-inc/menubar',
    '@method-inc/navigation-menu',
    '@method-inc/popover',
    '@method-inc/portal',
    '@method-inc/progress',
    '@method-inc/radio-group',
    '@method-inc/select',
    '@method-inc/separator',
    '@method-inc/slider',
    '@method-inc/slot',
    '@method-inc/switch',
    '@method-inc/table',
    '@method-inc/tabs',
    '@method-inc/toast',
    '@method-inc/toggle',
    '@method-inc/toggle-group',
    '@method-inc/toolbar',
    '@method-inc/tooltip',
    '@method-inc/types',
  ],

  experimental: {
    forceSwcTransforms: true,
  },
};

export default withExpo(nextConfig);

// https://github.com/expo/expo-webpack-integrations/blob/main/packages/next-adapter/src/index.ts
function withExpo(nextConfig) {
  return {
    ...nextConfig,
    webpack(config, options) {
      // Mix in aliases
      if (!config.resolve) {
        config.resolve = {};
      }

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Alias direct react-native imports to react-native-web
        'react-native$': 'react-native-web',
        // Alias internal react-native modules to react-native-web
        'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
          'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
        'react-native/Libraries/vendor/emitter/EventEmitter$':
          'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
        'react-native/Libraries/EventEmitter/NativeEventEmitter$':
          'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      };

      config.resolve.extensions = [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        ...(config.resolve?.extensions ?? []),
      ];

      if (!config.plugins) {
        config.plugins = [];
      }

      // Expose __DEV__ from Metro.
      config.plugins.push(
        new options.webpack.DefinePlugin({
          __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
        })
      );

      // Execute the user-defined webpack config.
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}
