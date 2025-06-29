import { Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useEditable } from '../hooks/store';
import { appMap } from '../modules/selector';
import { debounce } from '../utils';
import { Layout } from './Layout';
import { ResizableDivider } from './ResizableDivider';

export const Renderer = ({ id, layout, splits = {}, postResize, onRemove, tabId }) => {
	const { isEditing } = useEditable();
	const totalWidth = 100;
	const totalHeight = 100;

	// Track pane sizes for each row (as percentages of available space)
	const [paneSizes, setPaneSizes] = useState(() => {
		if (splits.paneSizes) {
			return splits.paneSizes;
		}
		// Initialize equal sizes for each row
		return layout.map(row => Array(row.length).fill(totalWidth / row.length));
	});

	// Track row heights (as percentages of available space)
	const [rowHeights, setRowHeights] = useState(() => {
		if (splits.rowHeights) {
			return splits.rowHeights;
		}
		// Initialize equal heights for each row
		return Array(layout.length).fill(totalHeight / layout.length);
	});

	const debouncedPostResize = useCallback(debounce(postResize, 500), []);

	// Update pane sizes when layout changes
	useEffect(() => {
		// Only reset to equal sizes if we don't have cached sizes that match the current layout structure
		const shouldResetPaneSizes =
			!splits.paneSizes ||
			splits.paneSizes.length !== layout.length ||
			splits.paneSizes.some((row, i) => row.length !== layout[i].length);

		const shouldResetRowHeights =
			!splits.rowHeights || splits.rowHeights.length !== layout.length;

		if (shouldResetPaneSizes) {
			const newPaneSizes = layout.map(row => Array(row.length).fill(totalWidth / row.length));
			setPaneSizes(newPaneSizes);
		}

		if (shouldResetRowHeights) {
			const newRowHeights = Array(layout.length).fill(totalHeight / layout.length);
			setRowHeights(newRowHeights);
		}
	}, [layout, splits.paneSizes, splits.rowHeights]);

	useEffect(() => {
		debouncedPostResize(paneSizes, rowHeights);
	}, [paneSizes, rowHeights, debouncedPostResize]);

	const handleHorizontalResize = (rowIndex, paneIndex, delta) => {
		setPaneSizes(prevSizes => {
			const newSizes = [...prevSizes];
			const rowSizes = [...newSizes[rowIndex]];

			// Get the container width dynamically
			const rendererElement = document.querySelector('.renderer');
			const containerWidth = rendererElement ? rendererElement.offsetWidth : 800;

			// Calculate available width for panes (excluding dividers)
			const numDividers = rowSizes.length - 1;
			const dividerWidth = 8; // 0.5rem = 8px (w-2 class)
			const totalDividerWidth = numDividers * dividerWidth;
			const availableWidth = containerWidth - totalDividerWidth;

			const deltaPercent = (delta / availableWidth) * totalWidth;

			// Adjust the current pane and the next pane
			if (paneIndex < rowSizes.length - 1) {
				const minSize = 10; // Minimum 10% width
				const maxSize = 90; // Maximum 90% width

				const newCurrentSize = Math.max(
					minSize,
					Math.min(maxSize, rowSizes[paneIndex] + deltaPercent),
				);
				const newNextSize = Math.max(
					minSize,
					Math.min(maxSize, rowSizes[paneIndex + 1] - deltaPercent),
				);

				// Only update if both panes can accommodate the change
				if (newCurrentSize >= minSize && newNextSize >= minSize) {
					rowSizes[paneIndex] = newCurrentSize;
					rowSizes[paneIndex + 1] = newNextSize;
				}
			}

			newSizes[rowIndex] = rowSizes;
			return newSizes;
		});
	};

	const handleVerticalResize = (rowIndex, delta) => {
		setRowHeights(prevHeights => {
			const newHeights = [...prevHeights];

			// Get the container height dynamically
			const rendererElement = document.querySelector('.renderer');
			const containerHeight = rendererElement ? rendererElement.offsetHeight : 600;

			// Calculate available height for rows (excluding dividers)
			const numDividers = newHeights.length - 1;
			const dividerHeight = 8; // 0.5rem = 8px (h-2 class)
			const totalDividerHeight = numDividers * dividerHeight;
			const availableHeight = containerHeight - totalDividerHeight;

			const deltaPercent = (delta / availableHeight) * totalHeight;

			// Adjust the current row and the next row
			if (rowIndex < newHeights.length - 1) {
				const minSize = 10; // Minimum 10% height
				const maxSize = 90; // Maximum 90% height

				const newCurrentSize = Math.max(
					minSize,
					Math.min(maxSize, newHeights[rowIndex] + deltaPercent),
				);
				const newNextSize = Math.max(
					minSize,
					Math.min(maxSize, newHeights[rowIndex + 1] - deltaPercent),
				);

				// Only update if both rows can accommodate the change
				if (newCurrentSize >= minSize && newNextSize >= minSize) {
					newHeights[rowIndex] = newCurrentSize;
					newHeights[rowIndex + 1] = newNextSize;
				}
			}

			return newHeights;
		});
	};

	const afterResize = () => {
		postResize(paneSizes, rowHeights);
	};

	return (
		<div className="renderer" style={{ display: 'flex', flexDirection: 'column' }}>
			{layout.map((row, rowIndex) => {
				const currentRowSizes =
					paneSizes[rowIndex] || Array(row.length).fill(totalWidth / row.length);
				const currentRowHeight = rowHeights[rowIndex] || totalHeight / layout.length;

				return (
					<>
						<div
							className="render-row"
							key={row?.[0]?.id || 'selector-row'}
							style={{
								display: 'flex',
								flexGrow: currentRowHeight,
								flexShrink: 1,
								flexBasis: '0',
								width: '100%',
							}}
						>
							{row.map((item, index) => {
								// Use flex-grow based on the current size ratios
								const flexGrow = currentRowSizes[index];

								const paneStyle = {
									flexGrow: flexGrow,
									flexShrink: 1,
									flexBasis: 0,
									minWidth: '100px', // Use px instead of % for better control
									height: '100%',
								};

								const RenderApp = appMap[item.type];

								return (
									<>
										<div
											style={{
												...paneStyle,
												display: 'flex',
												flexDirection: 'column',
											}}
											key={item?.id}
										>
											{item?.type === 'layout' ? (
												<Layout
													initialData={{
														splits,
														config: item.config,
													}}
													id={item?.id}
													onEmpty={onRemove}
													tabId={tabId}
												/>
											) : (
												<div className="flex flex-col relative">
													<RenderApp />
													{isEditing ? (
														<button
															type="button"
															className="absolute top-0 right-0 bg-gray-900 text-white rounded-full p-2 hover:bg-gray-600"
															onClick={() => onRemove(item.id)}
														>
															<Trash size={16} />
														</button>
													) : null}
												</div>
											)}
										</div>
										{row.length > 1 && index < row.length - 1 && (
											<ResizableDivider
												direction="horizontal"
												onResize={delta =>
													handleHorizontalResize(rowIndex, index, delta)
												}
												afterResize={afterResize}
											/>
										)}
									</>
								);
							})}
						</div>
						{layout.length > 1 && rowIndex < layout.length - 1 && (
							<ResizableDivider
								direction="vertical"
								onResize={delta => handleVerticalResize(rowIndex, delta)}
								afterResize={afterResize}
							/>
						)}
					</>
				);
			})}
		</div>
	);
};
