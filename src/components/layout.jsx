import { useState } from "react";
import { Renderer } from "./renderer";
import { Plus } from "lucide-react";

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
			<div className="button-container">
				<button
					type="button"
					onClick={() => onAdd("top")}
					className="rounded-full rounded-t-none"
				>
					<Plus />
				</button>
			</div>
			<div className="layout-content">
				<div className="button-container">
					<button
						type="button"
						onClick={() => onAdd("left")}
						className="rounded-full rounded-l-none"
					>
						<Plus />
					</button>
				</div>
				{<Renderer layout={layout} />}
				<div className="button-container">
					<button
						type="button"
						onClick={() => onAdd("right")}
						className="rounded-full rounded-r-none"
					>
						<Plus />
					</button>
				</div>
			</div>
			<div className="button-container">
				<button
					type="button"
					onClick={() => onAdd("bottom")}
					className="rounded-full rounded-b-none"
				>
					<Plus />
				</button>
			</div>
		</div>
	);
};
