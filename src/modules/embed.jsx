import { Pencil } from 'lucide-react';
import { useState } from 'react';

const Embed = ({ config, updateConfig, isEditing }) => {
	const { url: cachedUrl } = config || {};
	const [url, setUrl] = useState(cachedUrl || '');
	const [isUpdating, setIsUpdating] = useState(!url);

	const updateUrl = e => {
		e.preventDefault();
		setIsUpdating(false);
		updateConfig?.({ url });
	};

	if (!url || isUpdating) {
		return (
			<form className="flex flex-col gap-4 items-start p-2" onSubmit={updateUrl}>
				<h2 className="text-lg font-bold mt-8">Embed URL to embed</h2>
				<input
					type="url"
					value={url}
					onChange={e => setUrl(e.target.value)}
					className="w-full border border-gray-500 rounded-md p-2"
					autoFocus
				/>
				<button
					className="w-24 border border-gray-800 bg-gray-900 rounded-md p-2"
					type="submit"
				>
					Save
				</button>
			</form>
		);
	}

	return (
		<div className="relative flex-1 h-full">
			<iframe src={url} className="w-full h-full" />
			{isEditing && (
				<button
					className="absolute bottom-0 right-0 bg-gray-100 text-gray-900 rounded-full p-3 hover:bg-gray-600 shadow-2xl"
					onClick={() => setIsUpdating(true)}
				>
					<Pencil size={18} />
				</button>
			)}
		</div>
	);
};

export default Embed;