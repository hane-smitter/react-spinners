# react-loading-indicators

A kit of elegant _loading indicators_ to enhance waiting experience of users when your system has something to do in the background for a while.

Built with Typescript. Type safety and improved DX guaranteed.

## A demo for your insights

A glimpse of what is wrapped 🎁.<br />
See [DEMO](https://react-loading-indicators.netlify.app/) page.

## Installation

```
npm install react-loading-indicators
```

## Components

```jsx
<Atom />
<Commet />
<OrbitProgress />
<BlinkBlur />
<FourSquare />
<TrophySpin />
<ThreeDot />
<LifeLine />
<Mosaic />
<Riple />
<Slab />

```

## Examples

### Importing a loading indicator

```jsx
import { Atom } from "react-loading-indicators";
/* 
| OR directly pull it 😎
| import Atom from "react-loading-indicators/Atom";
*/

const Loading = () => <Atom text="Loading..." />;

export default Loading;
```

<details>
  <summary><strong>Example usage</strong></summary>

```jsx
<Suspense fallback={<Loading />}>
	<Albums artistId={artist.id} />
</Suspense>
```

<strong><small>Side note:</small></strong> You can use <a href="https://dev.to/smitterhane/swap-out-useeffect-with-suspense-for-data-fetching-in-react-2leb#2-data-fetching-usecase">suspense for data fetching</a> other than lazy loading.

</details>

### Lighter build

This library is kept at fairly small. You have an option to even shrink further what you include from this library.<br />
You can directly pull a loading indicator you want:

```jsx
import React from "react";
import OrbitProgress from "react-loading-indicators/OrbitProgress";

const Loading = () => (
	<OrbitProgress variant="track-disc" color="crimson" size="small" />
);

export default Loading;
```

### Props

Each of these components will accept the following _optional props_.

|   Name    |       DataType        |     Default Value     |                                               Possible Values                                               |
| :-------: | :-------------------: | :-------------------: | :---------------------------------------------------------------------------------------------------------: |
|   size    |       `string`        |        medium         |                                            small, medium, large                                             |
|   color   |  `string` or `array`  |       limegreen       |                                              CSS color values                                               |
|   style   |       `object`        |        `null`         |                                CSS styles(<small>in Reactjs format</small>)                                 |
|   text    | `string` or `boolean` |        `false`        |                                           Boolean value or string                                           |
| textColor |       `string`        |      `undefined`      |                                              CSS color values                                               |
| speedPlus |       `number`        |          `0`          |                                    Number in the range `-5` through `5`                                     |
|  easing   |       `string`        | default ease function | CSS [easing function](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function, "Animation easing") |

#### What do these props do?

- `size` - Sets the size of the loading indicator.
- `color` - Sets the color of the loading indicator.
- `style` - Applies CSS to the loading indicator. This will style the outer element that wraps an indicator.
- `text` - Displays message in the loading indicator.
- `textColor` - Sets the color of text message in the loading indicator.
- `speedPlus` - Controls speed of animation. _Negative_ values slows down. _Positive_ numbers speeds up animation. `0` is normal speed.
- `easing` - Controls the smoothness of the animation, altered with values such as `linear`, `ease-in`.

`<OrbitProgress />` and `<ThreeDot />` have more than one variant of loading animation. You can pick an alternative animation using a `variant` prop.

|  Name   | DataType |
| :-----: | :------: |
| variant | `string` |

`<OrbitProgress />` supports the following variants: **`dotted`**, **`spokes`**, **`disc`**, **`split-disc`**, **`track-disc`**. Defaults to `disc`.<br />
`<ThreeDot />` has the following variants: **`pulsate`**, **`bounce`**, **`bob`**, **`brick-stack`**. Defaults to `pulsate`.<br />
You can have an interactive run-through of the variants in the [DEMO](https://react-loading-indicators.netlify.app/) site.

### How to resize

You can resize a loading indicator to fit into your needs with the `size` prop that accepts predefined string values.<br>
For more size customization, you can specify a `fontSize` property in the `style` prop. A valid value for the [`fontSize` property](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#values) will _evenly_ alter the animation's size, <i>for example</i>:

```jsx
const Loading = () => <ThreeDot style={{ fontSize: "8px" }} />;
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

[@smitterhane](https://twitter.com/smitterhane)
