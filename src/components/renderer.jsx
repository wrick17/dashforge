import { Selector } from "../modules/selector";
import { Layout } from "./layout";

export const Renderer = ({ layout }) => {
	console.log(JSON.stringify(layout, null, 2));
	return (
		<div className="renderer">
			{layout.map((row, rowIndex) => {
				return (
					<div className="render-row" key={rowIndex + row}>
						{row.map((item, index) => {
							if (item === "layout") {
								return <Layout />;
							}
							return <Selector key={Date.now()} />;
						})}
					</div>
				);
			})}
		</div>
	);
};
