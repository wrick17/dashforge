import { Check, Pencil } from "lucide-react";
import { useEditable } from "../hooks/store";
import { Tabs } from './Tabs';

export const Header = () => {
	const { isEditing, startEditing, stopEditing } = useEditable();
	return (
		<header className="flex flex-row justify-between items-center p-2 gap-4">
			<span className="text-2xl font-bold px-2">DashForge</span>
			<Tabs />
			<button
				type="button"
				className="rounded-full bg-gray-700 text-white px-4 py-2 flex flex-row items-center justify-center gap-2 min-w-24"
				onClick={() => {
					if (isEditing) {
						stopEditing();
					} else {
						startEditing();
					}
				}}
			>
				{isEditing ? <Check size={18} /> : <Pencil size={16} />}
				{isEditing ? "Save" : "Edit"}
			</button>
		</header>
	);
};
