import { useState } from "react";

import "./App.css";

import { Choose } from "./components/choose";
import { Layout } from "./components/layout";
import { hash } from "./utils/hash";

const App = () => {
	let home;
	try {
		const cache = localStorage.getItem("layout_home");
		if (cache) {
			home = JSON.parse(cache);
		}
	} catch (_e) {}
	const [initialData, setInitialConfig] = useState(home);

	const onSelect = (app) => {
		setInitialConfig({
			splits: {},
			config: [
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
			],
		});
	};

	return (
		<div className="content">
			{initialData ? (
				<Layout initialData={initialData} onSelect={initialData} id="home" />
			) : (
				<Choose onSelect={onSelect} />
			)}
		</div>
	);
};

export default App;
