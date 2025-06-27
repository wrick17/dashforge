import { Plus } from "lucide-react";
import { useState } from "react";
import { hash } from "../utils/hash";
import { Choose } from "./choose";
import { Renderer } from "./renderer";

export const Layout = ({ initialConfig = [["selector"]] }) => {
	const [layout, setLayout] = useState(initialConfig);
	const [choose, setChoose] = useState();

	console.log(layout);

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
				setLayout((oldLayout) => [
					[
						{
							id: hash(),
							type: 'layout',
							config: [[ {
								id: hash(),
								type: app,
							} ]]
						},
					],
					...oldLayout,
				]);
			} else if (choose === "left") {
				setLayout((oldLayout) => [
					[
						{
							id: hash(),
							type: 'layout',
							config: [[ {
								id: hash(),
								type: app,
							} ]]
						},
						...oldLayout[0],
					],
				]);
			} else if (choose === "right") {
				setLayout((oldLayout) => [
					[
						...oldLayout[0],
						{
							id: hash(),
							type: 'layout',
							config: [[ {
								id: hash(),
								type: app,
							} ]]
						},
					],
				]);
			} else if (choose === "bottom") {
				setLayout((oldLayout) => [
					...oldLayout,
					[
						{
							id: hash(),
							type: 'layout',
							config: [[ {
								id: hash(),
								type: app,
							} ]]
						},
					],
				]);
			}
			setChoose();
		}
	};

	const showButtons = layout?.[0]?.[0] !== "selector";
	console.log("🚀", layout?.[0]?.[0]);

	return (
		<div className="layout">
			{showButtons && (
				<div className="button-container">
					<button
						type="button"
						onClick={() => onAdd("top")}
						className="rounded-full rounded-t-none"
					>
						<Plus />
					</button>
				</div>
			)}
			<div className="layout-content">
				{showButtons && (
					<div className="button-container">
						<button
							type="button"
							onClick={() => onAdd("left")}
							className="rounded-full rounded-l-none"
						>
							<Plus />
						</button>
					</div>
				)}
				<Renderer layout={layout} onSelect={(app) => onSelect(app, true)} />
				{showButtons && (
					<div className="button-container">
						<button
							type="button"
							onClick={() => onAdd("right")}
							className="rounded-full rounded-r-none"
						>
							<Plus />
						</button>
					</div>
				)}
			</div>
			{showButtons && (
				<div className="button-container">
					<button
						type="button"
						onClick={() => onAdd("bottom")}
						className="rounded-full rounded-b-none"
					>
						<Plus />
					</button>
				</div>
			)}
			{choose && <Choose onSelect={onSelect} />}
		</div>
	);
};
