import { Suspense, useState } from 'react';

export const Selector = ({ onSelect, appMap }) => {
	const [app, setApp] = useState();

	const handleSelect = app => {
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
				<Suspense fallback={<div>Loading...</div>}>
					{Object.keys(appMap).map(app => (
						<button
							type="button"
							className="text-left px-2 py-2 rounded-md cursor-pointer hover:bg-gray-700"
							onClick={() => handleSelect(app)}
						>
							{app}
						</button>
					))}
				</Suspense>
			</div>
		</div>
	);
};
