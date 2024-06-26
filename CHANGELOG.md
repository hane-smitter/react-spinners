# 1.0.0

- All components can animate between colors when provided with an array in `color` prop.
- Default color is used when invalid color is passed.
- Shrinking indicator design for the `<OrbitProgress variant="disc" />` indicator.
- `<Atom />`, `<Slab />`, `<Mosaic />` animations updated/improved.
- Renamed indicators:
  - ~~`<OrbitProgress variant="bubble-dotted" />`~~ - `<OrbitProgress variant="spokes" />`.
  - ~~`<ThreeDot variant="windmill" />`~~ - `<ThreeDot variant="bounce" />`.
- Improved algorithmic animation distribution in `<BlinkBlur />`.
- Loading animations packaged directly at root.

# 0.2.0

- New props: `easing` and `speedPlus`.
- Updated readme.
- Renamed indicators:
  - ~~`<CircularProgress />`~~ - `<OrbitProgress />`
  - ~~`<Seek />`~~ - `<ThreeDot />`
  - ~~`<GlidingBlink />`~~ - `<BlinkBlur />`
  - ~~`<Twist />`~~ - `<TrophySpin />`
  - ~~`<Pulse />`~~ - `<LifeLine />`
- New `track-disc` variant to `<OrbitProgress />`.
- Variants prop on `<ThreeDot />`.
- Refactor `<BlinkBlur />`.
- Light build option.
- Less files lib.

# 0.1.1

- Update readme

# 0.1.0

- New indicators `GlidingBlink`, `Twist`, `Pulse` & `Slab`.
- Centralize default _vars_.
- Fine tune `Atom` and `Commet` indicators.
- Code refactor.
- Tree-shaking optimization.

# 0.0.11

- Configure global styles for storybook.
- Fix text display on `FourSquare` loader.
- Remove duplicated `d-i-b` css class and add `rli-d-i-b` as a global style.

# 0.0.10

- Common props for all components.
- New `FourSquare` loading indicator as a contribution.
- Refactor `FourSquare` loader.

# 0.0.9

- Fix `split-disc` component width.
- Add `homepage` property to `package.json`.

# 0.0.8

- Fix Stacking Context issues in `Commet` and `Circular Progress`(Disc variant) components.

# 0.0.7

- Add style fixes to `Atom` Component.
- Update README.md.
- Renamed package from `@hane-smitter/react-loading-indicator` to `react-loading-indicators`.
- Removed `publishConfig` property from `package.json`.
- Added `loaders` keyword to `package.json`.

# 0.0.6

- Modify peer deps to react version **>=16.8.0**

# 0.0.5

- Fix default export not being exported from src/index.ts.

# 0.0.4

- Replace `div` tags with span style them with `display: inline-block;` class(`d-i-b`).
- Add `styles` variable to hold values of `style` prop.

# 0.0.3

- Add `src` folder to `files` option in `package.json`. To fix error
  ![source maps error](https://user-images.githubusercontent.com/49382800/191842094-1565223c-7d88-455b-a2e9-01439a2ae485.png)
- Add `CHANGELOG.md`.
- Add `react` and `react-dom` to both peerDependencies and devDependencies.
- Update `@rollup/plugin-typescript` to version `8.3.3`.
