import type {
  MapEventType,
  MapLayerEventType,
  StyleSpecification,
} from "maplibre-gl";

/**
 * The `MapInteractions` type is a union of the possible interactions that can be disabled/enabled on the minimap.
 */
type MapInteractions =
  | "dragPan"
  | "scrollZoom"
  | "boxZoom"
  | "dragRotate"
  | "keyboard"
  | "doubleClickZoom"
  | "touchZoomRotate";

export type MinimapInteractions = Record<MapInteractions, boolean>;

export type MiniMapConfiguration = Partial<{
  showText: string;
  hideText: string;
}> & {
  /**
   * set custom `id` for the minimap
   */
  id: string;
  /**
   * The `width` of the minimap container (default is 150px)
   */
  width: string;
  /**
   * The `height` of the minimap container (default is 150px)
   */
  height: string;
  /**
   * the zoom offset of the minimap regarding the parent map (default is 5)
   */
  zoomLevelOffset: 5 | 6 | 7 | 8;
  /**
   * interactions to be disabled/enabled on the minimap (default is all disabled)
   */
  interactions: MinimapInteractions;
  /**
   * minimize the minimap on initial load (default is true)
   */
  initialMinimized: boolean;
  /**
   * whether the minimap is minimizable (default is true)
   *
   * setting this variable to `false` will disable the minimize button
   */
  minimizableMinimap: boolean;
  /**
   * width of minimized minimap element (default is 29px)
   */
  collapsedWidth: string;
  /**
   * height of minimized minimap element (default is 29px)
   */
  collapsedHeight: string;
  /**
   * radius of the border of the minimap element (default is 3px)
   */
  borderRadius: string;
  /**
   * minimap Style object
   */
  style: StyleSpecification;
};

export type MapLayerEventCallbackType<T extends keyof MapLayerEventType> = (
  event: MapLayerEventType[T] & Object
) => void;

export type MapEventCallbackType<T extends keyof MapEventType> = (
  event: MapEventType[T] & Object
) => void;

export type MiniMapOptions = Partial<
  Omit<MiniMapConfiguration, "interactions"> & {
    interactions: Partial<MinimapInteractions>;
  }
>;
