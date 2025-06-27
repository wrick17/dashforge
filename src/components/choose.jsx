import { Selector } from "../modules/selector";

export const Choose = ({ onSelect }) => {
	return (
		<div className="choose fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border-1 border-gray-600 rounded-md p-2 z-100">
			<Selector onSelect={onSelect} />
		</div>
	);
};
