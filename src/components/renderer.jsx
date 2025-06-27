import { useEffect, useState } from "react";
import { appMap, Selector } from "../modules/selector";
import { Layout } from "./layout";
import { ResizableDivider } from "./ResizableDivider";
import { hash } from "../utils/hash";

export const Renderer = ({ layout, onSelect }) => {
	const totalWidth = 100;
	const totalHeight = 100;

	// Track pane sizes for each row (as percentages of available space)
	const [paneSizes, setPaneSizes] = useState(() => {
		// Initialize equal sizes for each row
		return layout.map((row) => Array(row.length).fill(totalWidth / row.length));
	});

	// Track row heights (as percentages of available space)
	const [rowHeights, setRowHeights] = useState(() => {
		// Initialize equal heights for each row
		return Array(layout.length).fill(totalHeight / layout.length);
	});

	// Update pane sizes when layout changes
	useEffect(() => {
		setPaneSizes(
			layout.map((row) => Array(row.length).fill(totalWidth / row.length)),
		);
		setRowHeights(Array(layout.length).fill(totalHeight / layout.length));
	}, [layout]);

	const handleHorizontalResize = (rowIndex, paneIndex, delta) => {
		setPaneSizes((prevSizes) => {
			const newSizes = [...prevSizes];
			const rowSizes = [...newSizes[rowIndex]];

			// Get the container width dynamically
			const rendererElement = document.querySelector(".renderer");
			const containerWidth = rendererElement
				? rendererElement.offsetWidth
				: 800;

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
		setRowHeights((prevHeights) => {
			const newHeights = [...prevHeights];

			// Get the container height dynamically
			const rendererElement = document.querySelector(".renderer");
			const containerHeight = rendererElement
				? rendererElement.offsetHeight
				: 600;

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

	return (
		<div
			className="renderer"
			style={{ display: "flex", flexDirection: "column", height: "100%" }}
		>
			{layout.map((row, rowIndex) => {
				const currentRowSizes =
					paneSizes[rowIndex] ||
					Array(row.length).fill(totalWidth / row.length);
				const currentRowHeight =
					rowHeights[rowIndex] || totalHeight / layout.length;

				return (
					<>
						<div
							className="render-row"
							key={row?.[0]?.id || "selector-row"}
							style={{
								display: "flex",
								flexGrow: currentRowHeight,
								flexShrink: 1,
								flexBasis: 0,
								minHeight: "100px",
								width: "100%",
							}}
						>
							{row.map((item, index) => {
								// Use flex-grow based on the current size ratios
								const flexGrow = currentRowSizes[index];

								const paneStyle = {
									flexGrow: flexGrow,
									flexShrink: 1,
									flexBasis: 0,
									minWidth: "100px", // Use px instead of % for better control
									height: "100%",
								};

								const RenderApp = appMap[item.type];

								return (
									<>
										<div
											style={{
												...paneStyle,
												display: "flex",
												flexDirection: "column",
											}}
											key={item?.id}
										>
											{item === "selector" ? (
												<Selector onSelect={onSelect} />
											) : item?.type === "layout" ? (
												<Layout initialConfig={item.config} />
											) : (
												<RenderApp />
											)}
										</div>
										{row.length > 1 && index < row.length - 1 && (
											<ResizableDivider
												direction="horizontal"
												onResize={(delta) =>
													handleHorizontalResize(rowIndex, index, delta)
												}
											/>
										)}
									</>
								);
							})}
						</div>
						{layout.length > 1 && rowIndex < layout.length - 1 && (
							<ResizableDivider
								direction="vertical"
								onResize={(delta) => handleVerticalResize(rowIndex, delta)}
							/>
						)}
					</>
				);
			})}
		</div>
	);
};
