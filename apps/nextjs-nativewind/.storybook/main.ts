import type { StorybookConfig } from "@storybook/nextjs";
import globby from 'globby';

const stories = globby.sync(
  [
    '!../**/node_modules/**/*',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    // '../../../packages/components/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  {
    cwd: './.storybook',
  }
);

const config: StorybookConfig = {
  stories, 
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
{
      name: '@storybook/addon-react-native-web',
      options: {
        // projectRoot: "../",
        modulesToTranspile: [
          'react-native-reanimated',
          'nativewind',
          'react-native-css-interop',
          'react-native-css-interop',
          '@hwc-software-development/label',
          '@hwc-software-development/components/input',
          '@hwc-software-development/slot',
        ],
        babelPresets: ['nativewind/babel'],
        babelPresetReactOptions: { jsxImportSource: 'nativewind' },
        babelPlugins: [
          'react-native-reanimated/plugin',
           [
            '@babel/plugin-transform-react-jsx',
            {
              runtime: 'automatic',
              importSource: 'nativewind',
            },
          ],
         ],
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    return config
  }
};
export default config;
