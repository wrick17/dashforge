import { useEffect } from "react";

export const SVG = () => {
	useEffect(() => {
		console.log("SVG Loaded");
	}, []);

	return <h1 className='bg-red-300'>SVG</h1>;
};
