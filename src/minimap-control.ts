import maplibregl from 'maplibre-gl';
import { getRandomUUID } from './utils';

import type { StyleSpecification, ControlPosition, IControl } from "maplibre-gl";
import type { MiniMapConfiguration, MiniMapOptions, MinimapInteractions } from "./type.d";

import appendToggleButtonToParentEL from './toggle-button';

const custom_style: StyleSpecification = {
	version: 8,
	sources: {
		openstreetmap: {
			type: 'raster',
			tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
			tileSize: 256,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}
	},
	layers: [
		{
			id: 'openstreetmap',
			type: 'raster',
			source: 'openstreetmap',
			minzoom: 0,
			maxzoom: 22
		}
	]
};

class MinimapControl implements IControl {
	readonly _options: MiniMapConfiguration;

	private Minimap: typeof maplibregl.Map;
	private _minimap!: maplibregl.Map;
	private _parentMap!: maplibregl.Map;
	private _minimapContainer!: HTMLDivElement;

	private _cleanupCallbacks: Array<() => void> = [];

	constructor(config: MiniMapOptions = {}) {
		this._options = {
			id: `mapbox-minimap-${getRandomUUID()}`,
			width: '150px',
			height: '150px',
			borderRadius: '3px',
			style: custom_style,

			zoomLevelOffset: 6,

			// minimap interactions
			interactions: {
				dragPan: false,
				boxZoom: false,
				keyboard: false,
				scrollZoom: false,
				dragRotate: false,
				doubleClickZoom: false,
				touchZoomRotate: false,
			},

			initialMinimized: false,
			minimizableMinimap: true,
			collapsedWidth: '29px',
			collapsedHeight: '29px',
		};

		(Object.keys(config) as Array<keyof MiniMapOptions>).forEach(_key => {
			if (!this._options[_key]) return;
			if (typeof this._options[_key] === 'object' && typeof config[_key] === 'object') {
				Object.assign(this._options[_key], config[_key]);
				delete config[_key];
			}
		})

		if (config.width) {
			if (!CSS.supports('width', config.width)) config.width = '150px';
		}
		if (config.height) {
			if (!CSS.supports('height', config.height)) config.height = '150px';
		}
		if (config.collapsedWidth) {
			if (!CSS.supports('width', config.collapsedWidth)) config.collapsedWidth = '29px'
		}
		if (config.collapsedHeight) {
			if (!CSS.supports('height', config.collapsedHeight)) config.collapsedHeight = '29px';
		}
		if (config.borderRadius) {
			if (!CSS.supports('border-radius', config.borderRadius)) config.borderRadius = '3px';
		}

		this.Minimap = new Proxy(maplibregl.Map, {
			construct: (target, args) => {
				const instance = Reflect.construct(target, args);

				instance.on = new Proxy(instance.on, {
					apply: (target, thisArg, argArray) => {
						this._cleanupCallbacks.push(() => instance.off(argArray[0], argArray[1], argArray[2]));
						return Reflect.apply(target, thisArg, argArray);
					}
				});


				instance.remove = new Proxy(instance.remove, {
					apply: (target, thisArg, argArray) => {
						for (let idx in this._cleanupCallbacks) {
							this._cleanupCallbacks[idx]();
						};
						return Reflect.apply(target, thisArg, argArray);
					}
				})

				return instance;
			}

		})

		Object.assign(this._options, config);
	}

	onAdd(map: maplibregl.Map): HTMLElement {
		this._parentMap = map;

		this._parentMap.on = new Proxy(this._parentMap.on, {
			apply: (target, thisArg, argArray) => {
				this._cleanupCallbacks.push(() => {
					this._parentMap.off(argArray[0], argArray[1], argArray[2]);
				})
				return Reflect.apply(target, thisArg, argArray);
			}
		})


		this._minimapContainer = this._createMinimapContainer(map);

		this._minimap = new this.Minimap({
			attributionControl: false,
			container: this._minimapContainer,
			style: this._options.style,
			center: this._parentMap.getCenter(),
		});

		this._load = this._load.bind(this);
		this._update = this._update.bind(this);

		this._minimap.on('load', this._load)

		this._parentMap.on('move', this._update);
		this._parentMap.on('moveend', this._update);

		return this._minimapContainer;
	}

	_createMinimapContainer(parentMap: maplibregl.Map): HTMLDivElement {
		const minimapEl = document.createElement('div');
		minimapEl.setAttribute('id', this._options.id);
		minimapEl.className = `maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group  maplibregl-ctrl custom-ctrl-minimap`;

		const minimapStyleEl = document.createElement('style');
		minimapStyleEl.innerHTML = `
		.custom-ctrl-minimap {
			cursor: default !important;
			box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
			transition: all 0.6s ease-in, border-color 0s ease-in;
			border-style: solid;
			border-radius: ${this._options.borderRadius ?? '3px'};
			border-width: 4px;
			border-color: white;
			width: ${this._options.width};
			height: ${this._options.height};
		}

		#${this._options.id}.minimized {
			border-radius: 3px !important;
			width: ${this._options.collapsedWidth};
			height: ${this._options.collapsedHeight};
		}
	
		@media (prefers-color-scheme: dark) {
			div.custom-ctrl-minimap {
				border-color: hsl(0, 0%, 15.2%);
			}
		}`;

		if (this._options.minimizableMinimap && this._options.initialMinimized) {
			minimapEl.classList.toggle('minimized');
		}


		// 100px will be matched to ['100px', '100', 'px'];
		// 10% will be matched to ['10%', '10', '%'];
		const { 1: widthValue, 2: widthUnit } = this._options.width.match(/(\d+)(.*)/) ?? [, '50', 'px'];
		const { 1: heightValue, 2: heightUnit } = this._options.height.match(/(\d+)(.*)/) ?? [, '50', 'px'];

		const trackingRectangle = document.createElement('div');
		trackingRectangle.setAttribute('id', 'rect-test');
		const trackingRectangleStyle = document.createElement('style');
		trackingRectangleStyle.innerHTML = `
			div#rect-test {
				position: absolute;
				left: 50%;
				top: 50%;
				width: ${parseFloat(widthValue) / 4}${widthUnit};
				height: ${parseFloat(heightValue) / 4}${heightUnit};
				transform: translate(-50%, -50%);
				background: oklch(80% 0.1 79.41 / 0.3);
				outline: 1px solid oklch(70% 0.4 90);
				z-index: 1;
			}
		`
		trackingRectangle.appendChild(trackingRectangleStyle);

		const preventDefault = (e: MouseEvent) => e.preventDefault();

		minimapEl.addEventListener('contextmenu', preventDefault);
		this._cleanupCallbacks.push(() => minimapEl.removeEventListener('contextmenu', preventDefault));

		minimapEl.appendChild(minimapStyleEl);
		minimapEl.appendChild(trackingRectangle);
		parentMap.getContainer().appendChild(minimapEl);

		return minimapEl;
	}

	_load(): void {
		this._update();

		if (this._options.interactions) {
			const { interactions } = this._options;
			(Object.keys(interactions) as Array<keyof MinimapInteractions>).forEach((i) => !interactions[i] && this._minimap[i].disable());
		}

		if (this._options.minimizableMinimap) {
			const minimap_position = (Object.entries(this._parentMap._controlPositions) as Array<[ControlPosition, HTMLElement]>)
				.find(([_, el]: [unknown, HTMLElement]) => el === this._minimapContainer.parentElement)?.[0];

			if (!minimap_position) {
				throw new Error('Toggle button wasn\'t created due to a missing/invalid variable `minimap_position`')
			}

			const toggleButtonHandler = () => {
				this._minimapContainer.classList.toggle('minimized');
				this._update();
			}


			this._cleanupCallbacks.push(appendToggleButtonToParentEL({
				position: minimap_position,
				fn: toggleButtonHandler,
			}, this._minimapContainer));
		}

	}

	_update(): void {
		/* if the minimap is minimized, no need to update it */
		if (this._options.minimizableMinimap && this._minimapContainer.classList.contains('minimized')) return;

		this._syncZoom();
		this._minimap.setCenter(this._parentMap.getCenter());
	}

	_syncZoom(): void {
		// zoomLevelOffset must be within the range of 5 to 8... otherwise tracking rect won't be visible on the minimap
		if (this._options.zoomLevelOffset < 5) {
			this._options.zoomLevelOffset = 5;
		}

		if (this._options.zoomLevelOffset > 8) {
			this._options.zoomLevelOffset = 8
		}

		this._minimap.setZoom(this._parentMap.getZoom() - this._options.zoomLevelOffset);
	}

	onRemove(_: maplibregl.Map): void {
		this._minimap.remove();
		this._minimapContainer.remove();
	}

	getDefaultPosition(): ControlPosition {
		return 'bottom-right';
	}
}

export default MinimapControl;