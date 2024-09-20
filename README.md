# Minimap Plugin for Maplibre-gl Map Engine

This package provides a configurable MiniMap component to use with the MapLibre GL project. It allows you to display a small overview map alongside the main map, with customizable options for size, zoom level, interactions, and styling, making it a flexible tool for enhancing your MapLibre GL applications.

!!!Note: This library is currently in development and not yet ready for production use. Use it at your own risk, and expect potential changes in future releases.!!!

## Instructions
- Install the plugin using your package manager
```bash
$ npm i maplibregl-minimap
```

- import it into your project and use it directly

```js
import MinimapControl from "maplibregl-minimap"


// after the initilize your map
map.on('load', () => {
    map.control(new MinimapControl());
})
```

## MiniMap Configuration

The configuration object for the MiniMap allows you to control its size, visibility, interaction, and style. Below are the available options.
It's possible to 

### Configuration Properties
```typescript
export type MiniMapConfiguration = Partial<{
    showText: string;
    hideText: string;
}> & {
    id: string;
    width: string;
    height: string;
    zoomLevelOffset: 5 | 6 | 7 | 8;
    interactions: MinimapInteractions;
    initialMinimized: boolean;
    minimizableMinimap: boolean;
    collapsedWidth: string;
    collapsedHeight: string;
    borderRadius: string;
    style: StyleSpecification;
};
```

### Property Descriptions
    - `id` (string, required): Set a custom id for the minimap. This must be unique within your application.
    `width` (string, optional, default: 150px): Defines the width of the minimap container.
    `height` (string, optional, default: 150px): Defines the height of the minimap container.
    `zoomLevelOffset` (5 | 6 | 7 | 8, optional, default: 5): Sets the zoom offset for the minimap relative to the parent map.
    `interactions` (MinimapInteractions, optional, default: all disabled): Specifies which interactions (like zoom, drag, etc.) are enabled or disabled on the minimap.
    `initialMinimized` (boolean, optional, default: true): Determines whether the minimap is minimized when it first loads.
    `minimizableMinimap` (boolean, optional, default: true): Whether the minimap can be minimized or not. If set to false, the minimize button will be disabled.
    `collapsedWidth` (string, optional, default: 29px): The width of the minimap when it is minimized.
    `collapsedHeight` (string, optional, default: 29px): The height of the minimap when it is minimized.
    `borderRadius` (string, optional, default: 3px): Sets the border radius for the minimap container.
    `style` (StyleSpecification, optional): Custom style object for further styling the minimap. This allows you to define specific visual properties like colors, borders, etc.


### Usage

```
import type { MiniMapConfiguration } from 'maplibregl-minimap';

const miniMapConfig: MiniMapConfiguration = {
  id: 'myCustomMiniMap',
  width: '200px',
  height: '200px',
  zoomLevelOffset: 6,
  interactions: { drag: true, zoom: false },
  initialMinimized: false,
  minimizableMinimap: true,
  collapsedWidth: '30px',
  collapsedHeight: '30px',
  borderRadius: '5px',
};
```