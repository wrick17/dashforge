import { Lock, LockOpen } from 'lucide-react';
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

	return (
		<header className="flex flex-row justify-between items-center p-2 gap-4">
			<span className="text-2xl font-bold px-2">DashForge</span>
			<Tabs />
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
