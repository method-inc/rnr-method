# RN Primitives

Universal Style agnostic and accessible react-native components

## Unstyled Nature

Primitives provides unstyled components, offering a high degree of customization freedom. By default, the components come without any predefined styles, allowing developers to seamlessly match their app's aesthetics.

## Accessibility

Accessibility is a significant focus within Primitives. We are dedicated to ensuring our components align with accessibility standards. Our ongoing efforts involve designing and testing components with appropriate labels, roles, and behaviors, aiming to provide an inclusive user experience.


## Pacakges / Libraries
 - React (React Native).
 - NextJs for demo and testing.
 - Expo for demo and testing.
 - react-native-web.
 - radix-ui.
 - TailwindCSS.
 - Nativewind.
 - Tsup for building TypeScript library.
 - Turborepo to manage & scaling monorepos libraries.

1. Install the dependencies with `pnpm`

```bash
pnpm i
```

2. Build and watch all of the primitive packages:

> This builds all of the primitive packages, it watches them for changes. This prevents the need to run the `build` command every time a primitive file is changed.

```bash
pnpm dev:primitives
```

3. Start the app of your choice:

```bash
# Start the Expo NativeWind app
pnpm dev:expo-nativewind
# Or start the Nextjs NativeWind app
pnpm dev:nextjs-nativewind
# Or the Documentation app
pnpm dev:docs
```

### Primitives

#### Core

- `accordion`
- `alert-dialog`
- `aspect-ratio`
- `avatar`
- `checkbox`
- `collapsible`
- `context-menu`
- `dialog`
- `dropdown-menu`
- `hover-card`
- `label`
- `menubar`
- `navigation-menu`
- `popover`
- `progress`
- `radio-group`
- `select`
- `separator`
- `slider`
- `switch`
- `table`
- `tabs`
- `toast`
- `toggle`
- `toggle-group`
- `toolbar`
- `tooltip`

#### Shared

- `hooks`
- `portal`
- `slot`
- `types`
- `utils`
