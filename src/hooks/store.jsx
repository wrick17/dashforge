import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { hash, removeTabItems } from '../utils';

export const useEditable = create(
	persist(
		set => ({
			isEditing: true,
			startEditing: () => set({ isEditing: true }),
			stopEditing: () => set({ isEditing: false }),
		}),
		{
			name: 'editable',
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export const useTabs = create(
	persist(
		(set, get) => ({
			tabs: [
				{
					id: hash(),
					name: 'Home',
				},
			],
			activeTab: 0,
			addTab: () => {
				const newTabHash = hash();
				set({
					tabs: [...get().tabs, { id: newTabHash, name: 'New Tab' }],
					activeTab: newTabHash,
				});
			},
			removeTab: id => {
				removeTabItems(id);
				set({
					tabs: get().tabs.filter(tab => tab.id !== id),
					activeTab: get().tabs[0].id,
				});
			},
			renameTab: (id, name) => {
				set({
					tabs: get().tabs.map(tab => (tab.id === id ? { ...tab, name } : tab)),
				});
			},
			setActiveTab: id => {
				set({ activeTab: id });
			},
			saveTabs: () => set({ tabs: get().tabs }),
		}),
		{
			name: 'tabs',
			storage: createJSONStorage(() => localStorage),
		},
	),
);

// this will be used as a common variable to track if the user is dragging any divider in our whole app.
export const useResize = create(set => ({
	isResizing: false,
	setIsResizing: isResizing => set({ isResizing }),
}));
