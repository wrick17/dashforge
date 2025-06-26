import { useEffect } from "react";

export const Todo = () => {
	useEffect(() => {
		console.log("Todo Loaded");
	}, []);

	return <h1>Todo</h1>;
};
