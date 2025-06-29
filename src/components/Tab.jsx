import { Check, Pencil, Trash, X } from 'lucide-react';
import { useState } from 'react';

export const Tab = ({ tab, otherProps, active, ...props }) => {
	const { isEditing, removeTab, renameTab } = otherProps;
	const [newName, setNewName] = useState(tab.name);
	const [isRenaming, setIsRenaming] = useState(false);

	return (
		<div
			key={tab.id}
			className={`flex flex-row items-center gap-2 text-white px-3 py-1 rounded-full cursor-pointer ${active ? 'bg-gray-700' : 'bg-gray-900'}`}
			{...props}
		>
			{isRenaming ? (
				<form
					onSubmit={e => {
						e.preventDefault();
						renameTab(tab.id, newName);
						setIsRenaming(false);
					}}
					className="flex flex-row items-center"
				>
					<input
						type="text"
						value={newName}
						onChange={e => setNewName(e.target.value)}
						autoFocus
						className="outline-none"
					/>
					<button type="submit" className="bg-gray-700 rounded-full p-1">
						<Check size={16} />
					</button>
					<button
						type="button"
						onClick={() => setIsRenaming(false)}
						className="bg-gray-700 rounded-full p-1"
					>
						<X size={16} />
					</button>
				</form>
			) : (
				<>
					<span className="mr-2">{tab.name}</span>
					{isEditing && (
						<button type="button" onClick={() => setIsRenaming(true)}>
							<Pencil size={16} />
						</button>
					)}
				</>
			)}
			{isEditing && !isRenaming && !active && (
				<button
					type="button"
					onClick={e => {
						e.stopPropagation();
						removeTab(tab.id);
					}}
				>
					<Trash size={16} />
				</button>
			)}
		</div>
	);
};
