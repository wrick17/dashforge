import { useState } from "react";

import "./App.css";

import { Choose } from "./components/choose";
import { Layout } from "./components/layout";
import { hash } from "./utils/hash";

const App = () => {
	let home;
	try {
		const cache = localStorage.getItem("home");
		home = cache ? JSON.parse(cache) : null;
	} catch (_e) {}
	const [initialConfig, setInitialConfig] = useState(home);

	const onSelect = (app) => {
		setInitialConfig([
			[
				{
					id: hash(),
					type: "layout",
					config: [
						[
							{
								id: hash(),
								type: app,
							},
						],
					],
				},
			],
		]);
	};

	return (
		<div className="content">
			{initialConfig ? (
				<Layout
					initialConfig={initialConfig}
					onSelect={initialConfig}
					id="home"
				/>
			) : (
				<Choose onSelect={onSelect} />
			)}
		</div>
	);
};

export default App;
