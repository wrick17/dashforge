import { Plus } from 'lucide-react';
import { useEditable, useTabs } from '../hooks/store';
import { Tab } from './Tab';
import { useEffect } from 'react';

export const Tabs = () => {
	const { isEditing } = useEditable();
	const { tabs, addTab, removeTab, renameTab, saveTabs, setActiveTab, activeTab } = useTabs();

	useEffect(() => {
		setActiveTab(activeTab || tabs[0].id);
		saveTabs();
	}, [activeTab, tabs]);

	return (
		<div className="flex-1 flex flex-row items-center gap-2">
			<div className="flex flex-row items-center gap-2 ">
				{tabs.map((tab) => (
					<Tab
						key={tab.id}
						tab={tab}
						onClick={() => setActiveTab(tab.id)}
						otherProps={{
							isEditing,
							removeTab,
							renameTab,
						}}
						active={activeTab === tab.id}
					/>
				))}
				{isEditing && (
					<button
						type="button"
						className="rounded-full bg-gray-700 text-white p-2 flex flex-row items-center justify-center"
						onClick={() => {
							addTab();
						}}
					>
						<Plus size={16} />
					</button>
				)}
			</div>
		</div>
	);
};
