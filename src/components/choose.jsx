import { X } from 'lucide-react';
import { Selector } from "../modules/selector";

export const Choose = ({ onSelect }) => {
	return (
		<div className="choose fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border-1 border-gray-600 rounded-md p-2 z-100">
			<Selector onSelect={onSelect} />
			<button
				type="button"
				className="text-left px-2 py-2 rounded-md cursor-pointer hover:bg-gray-700 absolute top-1 right-1"
				onClick={() => onSelect()}
			>
				<X />
			</button>
		</div>
	);
};
