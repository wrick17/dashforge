import { useEffect } from "react";

export const Decoder = () => {
	useEffect(() => {
		console.log("Decoder Loaded");
	}, []);

	return <h1>Decoder</h1>;
};
