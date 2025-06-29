import { Database, Heart } from "lucide-react";
import { formatBytes } from "../utils";

export const Footer = () => {
	const storage = formatBytes(JSON.stringify(localStorage).length);

	return (
		<footer className="flex flex-row items-center justify-between gap-2 py-1 px-4 text-sm">
			<span className="flex items-center gap-2">
				Made with <Heart size={14} fill="red" stroke="red" /> by wrick17
			</span>
			<span className="flex items-center gap-2">
				<Database size={14} />
				<span>{storage}</span>
			</span>
		</footer>
	);
};
