import { Map } from "maplibre-gl";

import type { MiniMapConfiguration, MiniMapOptions, MapLayerEventCallbackType, MapEventCallbackType } from "./type"
import type { LngLatBoundsLike, GeoJSONSource, LngLatLike, LngLatBounds, MapLayerEventType, MapEventType } from "maplibre-gl";

/**
 * A minimap control for Maplibre GL JS
 * This class needs to implement IControl interface to be used as a control:
 * https://maplibre.org/maplibre-gl-js/docs/API/interfaces/IControl/
 */
declare class Minimap {
    readonly _options: MiniMapConfiguration;

    _minimap: Map;
    _parentMap: Map;
    _minimapContainer: HTMLDivElement;

    _currentPoint: LngLatLike | undefined;
    _previousPoint: LngLatLike;
    _isTrackingRectangleHovered: boolean;

    _trackingRectangleCoords: Array<Array<number>>;
    _trackingRectangleID;

    _newBounds: LngLatBoundsLike | undefined;
    _trackingRectangle: GeoJSONSource | undefined;
    _toggleDisplayButton: HTMLButtonElement | undefined;

    _cleanupCallbacks: Array<() => void>;

    constructor(options: MiniMapOptions);


    _createMinimapContainer(parentmap: Map): HTMLDivElement;
    _load(): void;

    _addTrackingRectangleLayer();

    _attachListenerToMap<T extends keyof MapLayerEventType>(targetMap: maplibregl.Map, type: T, layer: string, fn: MapLayerEventCallbackType<T>): void;
    _attachListenerToMap<T extends keyof MapEventType>(targetMap: maplibregl.Map, type: T, fn: MapEventCallbackType<T>): void;
    _attachListenerToMap(targetMap: maplibregl.Map, arg1: unknown, arg2: unknown, arg3?: unknown): void;

    _update(): void;
    _syncZoom(): void;
    _getBoundsAfterDisplacement(displacement: number[]): LngLatBoundsLike | undefined;
    _adjustTrackingReactangle();
    _updateTrackingRectangleCoords(bounds: LngLatBounds): void;
    _cleanup(): void;
}