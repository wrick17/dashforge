import { Plus } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useEditable } from '../hooks/store';
import { hash } from '../utils';
import { Choose } from './Choose';
import { Renderer } from './Renderer';

export const Layout = ({ id, initialData, onEmpty, tabId, appMap }) => {
	let cache = initialData;
	try {
		const cacheString = localStorage.getItem(`tab_${tabId}_layout_${id}`);
		if (cacheString) {
			cache = { ...cache, ...JSON.parse(cacheString) };
		}
	} catch (_e) {}
	const [layout, setLayout] = useState(cache?.config);
	const [choose, setChoose] = useState(!cache);

	const mainLayoutIndex = useRef(0);
	const { isEditing } = useEditable();

	const chooseNewWidget = id => {
		setChoose({
			type: 'change',
			id,
		});
	};

	useEffect(() => {
		if (layout && layout.length > 0 && !layout.every(row => row.length === 0)) {
			localStorage.setItem(
				`tab_${tabId}_layout_${id}`,
				JSON.stringify({
					splits: cache?.splits,
					config: layout,
				}),
			);
		} else if (layout && (layout.length === 0 || layout.every(row => row.length === 0))) {
			// Remove from localStorage if layout is empty
			localStorage.removeItem(`tab_${tabId}_layout_${id}`);
		}
	}, [layout, id, tabId]);

	const onAdd = side => {
		setChoose(side);
	};

	const onSelect = (app, initial) => {
		if (!app) {
			setChoose();
			return;
		}
		if (choose?.type === 'change') {
			setLayout(oldLayout => {
				return oldLayout.map(row => {
					return row.map(item => {
						if (item.id === choose?.id) {
							return { ...item, type: app };
						}
					});
				});
			});
			localStorage.removeItem(`widget_${choose?.id}`);
			setChoose();
			return;
		}
		if (!cache) {
			setLayout([
				[
					{
						id: hash(),
						type: 'layout',
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
			]);
			setChoose();
			return;
		}
		if (initial) {
			setLayout([
				[
					{
						id: hash(),
						type: app,
					},
				],
			]);
		} else {
			if (choose === 'top') {
				mainLayoutIndex.current++;
				setLayout(oldLayout => [
					[
						{
							id: hash(),
							type: 'layout',
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
					...oldLayout,
				]);
			} else if (choose === 'left') {
				setLayout(oldLayout =>
					oldLayout.map((row, rowIndex) => {
						if (rowIndex === mainLayoutIndex.current) {
							return [
								{
									id: hash(),
									type: 'layout',
									config: [
										[
											{
												id: hash(),
												type: app,
											},
										],
									],
								},
								...row,
							];
						}
						return row;
					}),
				);
			} else if (choose === 'right') {
				setLayout(oldLayout =>
					oldLayout.map((row, rowIndex) => {
						if (rowIndex === mainLayoutIndex.current) {
							return [
								...row,
								{
									id: hash(),
									type: 'layout',
									config: [
										[
											{
												id: hash(),
												type: app,
											},
										],
									],
								},
							];
						}
						return row;
					}),
				);
			} else if (choose === 'bottom') {
				setLayout(oldLayout => [
					...oldLayout,
					[
						{
							id: hash(),
							type: 'layout',
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
				]);
			}
			setChoose();
		}
	};

	const postResize = (paneSizes, rowHeights) => {
		localStorage.setItem(
			`tab_${tabId}_layout_${id}`,
			JSON.stringify({
				splits: { paneSizes, rowHeights },
				config: layout,
			}),
		);
	};

	const onRemove = id => {
		setLayout(oldLayout => {
			const removeFromLayout = layout => {
				return layout
					.map(row => {
						return row.filter(item => {
							// If this item has the id we want to remove, remove it
							if (item.id === id) {
								// Clean up localStorage for removed layout items
								if (item.type === 'layout') {
									localStorage.removeItem(`tab_${tabId}_layout_${item.id}`);
								}
								return false;
							}

							// If this is a layout item, recursively process its config
							if (item.type === 'layout' && item.config) {
								const newConfig = removeFromLayout(item.config);

								// If the config becomes empty or has no items, remove this layout item
								if (
									newConfig.length === 0 ||
									newConfig.every(r => r.length === 0)
								) {
									// Clean up localStorage for the layout that's being removed
									localStorage.removeItem(`tab_${tabId}_layout_${item.id}`);
									return false;
								}

								// Return a new item object to ensure immutability
								return {
									...item,
									config: newConfig,
								};
							}

							return true;
						});
					})
					.filter(row => row.length > 0); // Remove empty rows
			};

			const newLayout = removeFromLayout(oldLayout);

			// Check if this layout is now empty and notify parent
			if (newLayout.length === 0 || newLayout.every(row => row.length === 0)) {
				if (onEmpty) {
					// Use setTimeout to avoid calling onEmpty during render
					setTimeout(() => onEmpty(id), 0);
				}
			}

			// Return a completely new array to ensure React detects the change
			return JSON.parse(JSON.stringify(newLayout));
		});
	};

	const getWidgetConfig = itemId => {
		const cacheString = localStorage.getItem(`widget_${itemId}`);
		if (cacheString) {
			return JSON.parse(cacheString);
		}
		return;
	};

	const updateWidgetConfig = (itemId, updatedConfig) => {
		localStorage.setItem(`widget_${itemId}`, JSON.stringify(updatedConfig));
	};

	const showButtons = layout?.[0]?.[0] !== 'selector' && isEditing;

	return (
		<div className="layout">
			{showButtons && (
				<div className="button-container horizontal">
					<button
						type="button"
						onClick={() => onAdd('top')}
						className="rounded-full rounded-t-none top-0"
					>
						<Plus />
					</button>
				</div>
			)}
			<div className="layout-content">
				{showButtons && (
					<div className="button-container vertical">
						<button
							type="button"
							onClick={() => onAdd('left')}
							className="rounded-full rounded-l-none left-0"
						>
							<Plus />
						</button>
					</div>
				)}
				{layout ? (
					<Suspense fallback={<div>Loading...</div>}>
						<Renderer
							key={JSON.stringify(layout)}
							layout={layout}
							splits={cache?.splits}
							onSelect={app => onSelect(app)}
							postResize={postResize}
							onRemove={onRemove}
							tabId={tabId}
							id={id}
							itemProps={{ getWidgetConfig, updateWidgetConfig }}
							appMap={appMap}
							chooseNewWidget={chooseNewWidget}
						/>
					</Suspense>
				) : null}
				{showButtons && (
					<div className="button-container vertical">
						<button
							type="button"
							onClick={() => onAdd('right')}
							className="rounded-full rounded-r-none right-0"
						>
							<Plus />
						</button>
					</div>
				)}
			</div>
			{showButtons && (
				<div className="button-container horizontal">
					<button
						type="button"
						onClick={() => onAdd('bottom')}
						className="rounded-full rounded-b-none bottom-0"
					>
						<Plus />
					</button>
				</div>
			)}
			{choose && <Choose onSelect={onSelect} id={id} tabId={tabId} appMap={appMap} />}
		</div>
	);
};
