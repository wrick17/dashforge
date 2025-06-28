import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { hash } from "../utils/hash";
import { Choose } from "./choose";
import { Renderer } from "./renderer";

export const Layout = ({ id, initialConfig, onEmpty }) => {
	let config = initialConfig;
	try {
		const cache = localStorage.getItem(id);
		if (cache) {
			config = JSON.parse(localStorage.getItem(id));
		}
	} catch (_e) {}
	const [layout, setLayout] = useState(config);
	const [choose, setChoose] = useState();
	const mainLayoutIndex = useRef(0);

	useEffect(() => {
		if (
			layout &&
			layout.length > 0 &&
			!layout.every((row) => row.length === 0)
		) {
			localStorage.setItem(id, JSON.stringify(layout));
		} else if (
			layout &&
			(layout.length === 0 || layout.every((row) => row.length === 0))
		) {
			// Remove from localStorage if layout is empty
			localStorage.removeItem(id);
		}
	}, [layout, id]);

	const onAdd = (side) => {
		setChoose(side);
	};

	const onSelect = (app, initial) => {
		if (!app) {
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
			if (choose === "top") {
				mainLayoutIndex.current++;
				setLayout((oldLayout) => [
					[
						{
							id: hash(),
							type: "layout",
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
			} else if (choose === "left") {
				setLayout((oldLayout) =>
					oldLayout.map((row, rowIndex) => {
						if (rowIndex === mainLayoutIndex.current) {
							return [
								{
									id: hash(),
									type: "layout",
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
			} else if (choose === "right") {
				setLayout((oldLayout) =>
					oldLayout.map((row, rowIndex) => {
						if (rowIndex === mainLayoutIndex.current) {
							return [
								...row,
								{
									id: hash(),
									type: "layout",
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
			} else if (choose === "bottom") {
				setLayout((oldLayout) => [
					...oldLayout,
					[
						{
							id: hash(),
							type: "layout",
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
		// console.log(id, { paneSizes, rowHeights });
	};

	const onRemove = (id) => {
		setLayout((oldLayout) => {
			const removeFromLayout = (layout) => {
				return layout
					.map((row) => {
						return row.filter((item) => {
							// If this item has the id we want to remove, remove it
							if (item.id === id) {
								// Clean up localStorage for removed layout items
								if (item.type === "layout") {
									localStorage.removeItem(item.id);
								}
								return false;
							}

							// If this is a layout item, recursively process its config
							if (item.type === "layout" && item.config) {
								const newConfig = removeFromLayout(item.config);

								// If the config becomes empty or has no items, remove this layout item
								if (
									newConfig.length === 0 ||
									newConfig.every((r) => r.length === 0)
								) {
									// Clean up localStorage for the layout that's being removed
									localStorage.removeItem(item.id);
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
					.filter((row) => row.length > 0); // Remove empty rows
			};

			const newLayout = removeFromLayout(oldLayout);

			// Check if this layout is now empty and notify parent
			if (
				newLayout.length === 0 ||
				newLayout.every((row) => row.length === 0)
			) {
				if (onEmpty) {
					// Use setTimeout to avoid calling onEmpty during render
					setTimeout(() => onEmpty(id), 0);
				}
			}

			// Return a completely new array to ensure React detects the change
			return JSON.parse(JSON.stringify(newLayout));
		});
	};

	const showButtons = layout?.[0]?.[0] !== "selector";

	return (
		<div className="layout">
			{showButtons && (
				<div className="button-container horizontal">
					<button
						type="button"
						onClick={() => onAdd("top")}
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
							onClick={() => onAdd("left")}
							className="rounded-full rounded-l-none left-0"
						>
							<Plus />
						</button>
					</div>
				)}
				<Renderer
					key={JSON.stringify(layout)}
					layout={layout}
					onSelect={(app) => onSelect(app, true)}
					postResize={postResize}
					onRemove={onRemove}
				/>
				{showButtons && (
					<div className="button-container vertical">
						<button
							type="button"
							onClick={() => onAdd("right")}
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
						onClick={() => onAdd("bottom")}
						className="rounded-full rounded-b-none bottom-0"
					>
						<Plus />
					</button>
				</div>
			)}
			{choose && <Choose onSelect={onSelect} />}
		</div>
	);
};
