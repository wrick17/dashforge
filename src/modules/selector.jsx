import { useState } from "react";
import { Decoder } from "../modules/decoder";
import { Encoder } from "../modules/encoder";
import { SVG } from "../modules/svg";
import { Todo } from "../modules/todo";

export const appMap = {
	todo: Todo,
	svg: SVG,
	encoder: Encoder,
	decoder: Decoder,
};

export const Selector = ({ onSelect }) => {
	const [app, setApp] = useState();

	const handleSelect = (app) => {
		onSelect(app);
		setApp(app);
	};

	if (app) {
		const RenderApp = appMap[app];
		return <RenderApp />;
	}

	return (
		<div className="selector h-full flex justify-center items-center">
			<h1 className="mb-4">Select App</h1>
			<div className="flex flex-col gap-2">
				<button type="button" onClick={() => handleSelect("todo")}>
					Todo
				</button>
				<button type="button" onClick={() => handleSelect("svg")}>
					SVG
				</button>
				<button type="button" onClick={() => handleSelect("encoder")}>
					Encoder
				</button>
				<button type="button" onClick={() => handleSelect("decoder")}>
					Decoder
				</button>
			</div>
		</div>
	);
};
