import { useEffect } from "react";

export const SVG = () => {
	useEffect(() => {
		console.log("SVG Loaded");
	}, []);

	return <h1>SVG</h1>;
};
