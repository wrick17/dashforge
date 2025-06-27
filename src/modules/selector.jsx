import { Todo } from "../modules/todo";
import { SVG } from "../modules/svg";
import { Encoder } from "../modules/encoder";
import { Decoder } from "../modules/decoder";
import { useState } from 'react';

const appMap = {
	todo: Todo,
	svg: SVG,
	encoder: Encoder,
	decoder: Decoder,
};
export const Selector = () => {
	const [app, setApp] = useState();

	if (app) {
		const RenderApp = appMap[app];
		return <RenderApp />;
	}

	return (
		<div className="selector h-full flex justify-center items-center">
			<h1 className='mb-4'>Select App</h1>
			<div className="flex flex-col gap-2">
				<button type="button" onClick={() => setApp("todo")}>
					Todo
				</button>
				<button type="button" onClick={() => setApp("svg")}>
					SVG
				</button>
				<button type="button" onClick={() => setApp("encoder")}>
					Encoder
				</button>
				<button type="button" onClick={() => setApp("decoder")}>
					Decoder
				</button>
			</div>
		</div>
	);
};
