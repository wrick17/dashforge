import { useState } from "react";
import { Renderer } from "./renderer";

export const Layout = () => {
	const [layout, setLayout] = useState([["selector"]]);

	const onAdd = (side) => {
		if (side === "top") {
			setLayout((oldLayout) => [["layout"], ...oldLayout]);
		} else if (side === "left") {
			setLayout((oldLayout) => [["layout", ...oldLayout[0]]]);
		} else if (side === "right") {
			setLayout((oldLayout) => [[...oldLayout[0], "layout"]]);
		} else if (side === "bottom") {
			setLayout((oldLayout) => [...oldLayout, ["layout"]]);
		}
	};

	return (
		<div className="layout">
			<button type="button" onClick={() => onAdd("top")}>
				+
			</button>
			<div className="layout-content">
				<button type="button" onClick={() => onAdd("left")}>
					+
				</button>
				{<Renderer layout={layout} />}
				<button type="button" onClick={() => onAdd("right")}>
					+
				</button>
			</div>
			<button type="button" onClick={() => onAdd("bottom")}>
				+
			</button>
		</div>
	);
};
