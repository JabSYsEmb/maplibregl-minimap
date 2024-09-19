import { ControlPosition } from "maplibre-gl";
import { getRandomUUID } from "./utils";

/**
 * 
 * @param props takes a position and a function to be called when the button is clicked
 * @param parentNode the parent node to which the button will be appended
 * @returns a cleanup function that frees up the resources used by the button
 */
export default function appendToggleButtonToParentEl(props: { position: ControlPosition; fn: () => void; }, parentNode: HTMLElement) {
	if (!props.position || !props.fn || !parentNode) throw new Error("Invalid arguments");


	const el = document.createElement("button");
	const el_id = `btn-${getRandomUUID()}`;
	el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M17.6 18L8 8.4V17H6V5h12v2H9.4l9.6 9.6l-1.4 1.4Z" /></svg
	>`;

	el.setAttribute('id', el_id);

	switch (props.position) {
		case "top-left":
			el.classList.toggle(`minimap-toggle-display-top-left`);
			break;
		case "bottom-left":
			el.classList.toggle(`minimap-toggle-display-bottom-left`);
			break;
		case "top-right":
			el.classList.toggle(`minimap-toggle-display-top-right`);
			break;
		case "bottom-right":
			el.classList.toggle(`minimap-toggle-display-bottom-right`);
			break;
	}

	const clickHandler = () => {
		props.fn();
	}

	el.addEventListener('click', clickHandler);

	const css_style = document.createElement('style');
	css_style.innerHTML = `
	button#${el_id} {
		border-radius: 0 !important;

		color: black;
		background-color: white;

		border: none;
		display: flex;
		cursor: pointer;
		transition: all 0.2s ease-in;
		position: absolute;

		width: 24px;
		height: 24px;
		border-start-end-radius: 0.2rem !important;
		z-index: 2;
	}

    button#${el_id}:hover {
        background-color: #e5e7e3 !important;
    }

	button#${el_id}.minimap-toggle-display-bottom-right {
		rotate: -180deg;
		left: 0;
		top: 0;
	}

	button#${el_id}.minimap-toggle-display-bottom-left {
		rotate: -90deg;
		right: 0;
		top: 0;
	}

	button#${el_id}.minimap-toggle-display-top-left {
		rotate: 0deg;
		bottom: 0;
		right: 0;
	}

	button#${el_id}.minimap-toggle-display-top-right {
		rotate: 90deg;
		bottom: 0;
		left: 0;
	}

	.minimized > button#${el_id} {
		border-radius: 0 !important;
		height: 21px;
		width: 21px;
	}

	button#${el_id} svg {
		transition: transform 0.5s ease-in;
		fill: black;
	}

	.minimized > button#${el_id} > svg {
		transform: rotate(-180deg);
	}

	@media (prefers-color-scheme: dark) {
		button#${el_id} {
			background-color: hsl(0, 0%, 15.2%);
			color: white;
		}
		button#${el_id}:hover {
			background-color: #2c2c2be7 !important;
		}
	}

	@media (prefers-color-scheme: dark) {
		button#${el_id} > svg {
			fill: white;
		}
	}`;

	el.appendChild(css_style);
	parentNode.appendChild(el);

	return () => {
		el.removeEventListener('click', clickHandler);
		el.removeChild(css_style);
		css_style.remove();
		parentNode.removeChild(el);
		el.remove();
	}
}