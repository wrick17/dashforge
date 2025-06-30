import { Lock, LockOpen, Trash } from 'lucide-react';
import { useEditable } from '../hooks/store';
import { Tabs } from './Tabs';

export const Header = () => {
	const { isEditing, startEditing, stopEditing } = useEditable();

	const handleLocking = () => {
		if (isEditing) {
			stopEditing();
		} else {
			startEditing();
		}
	};

	const handleReset = () => {
		localStorage.clear();
		window.location.reload();
	};

	return (
		<header className="flex flex-row justify-between items-center p-2 gap-4">
			<span className="text-2xl font-bold px-2">DashForge</span>
			<Tabs />
			{isEditing && (
				<button
					className="rounded-full bg-gray-700 px-4 py-2 flex flex-row items-center justify-center gap-2 text-sm text-red-400"
					onClick={handleReset}
				>
					<Trash size={16} />
					<span>Reset Everything</span>
				</button>
			)}
			<button
				type="button"
				className="rounded-full bg-gray-700 text-white px-2 py-2 flex flex-row items-center justify-center gap-2"
				title={isEditing ? 'Unlocked' : 'Locked'}
				onClick={handleLocking}
			>
				{isEditing ? <LockOpen size={18} /> : <Lock size={18} />}
			</button>
		</header>
	);
};
