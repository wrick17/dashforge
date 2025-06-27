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
		<div className="selector h-full flex">
			<h1 className="mb-4 text-xl p-2 text-left">Select App</h1>
			<div className="flex flex-col w-full min-w-xs">
				<button type="button" className='text-left px-2 py-2 rounded-md cursor-pointer hover:bg-gray-700' onClick={() => handleSelect("todo")}>
					Todo
				</button>
				<button type="button" className='text-left px-2 py-2 rounded-md cursor-pointer hover:bg-gray-700' onClick={() => handleSelect("svg")}>
					SVG
				</button>
				<button type="button" className='text-left px-2 py-2 rounded-md cursor-pointer hover:bg-gray-700' onClick={() => handleSelect("encoder")}>
					Encoder
				</button>
				<button type="button" className='text-left px-2 py-2 rounded-md cursor-pointer hover:bg-gray-700' onClick={() => handleSelect("decoder")}>
					Decoder
				</button>
			</div>
		</div>
	);
};
