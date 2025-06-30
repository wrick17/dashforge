import { Pencil } from 'lucide-react';
import { useState } from 'react';

const Youtube = ({ config, updateConfig, isEditing }) => {
	const { url: cachedUrl } = config || {};
	const [url, setUrl] = useState(cachedUrl || '');
	const [isUpdating, setIsUpdating] = useState(!url);

	const updateUrl = e => {
		e.preventDefault();
		setIsUpdating(false);
		updateConfig?.({ url });
	};

	const id = url.split('v=')[1]?.split('&')[0];
	const embedUrl = `https://www.youtube.com/embed/${id}`;

	if (!url || isUpdating) {
		return (
			<form className="flex flex-col gap-4 items-start p-2" onSubmit={updateUrl}>
				<h2 className="text-lg font-bold mt-8">Youtube URL</h2>
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
			<iframe
				src={embedUrl}
				className="w-full h-full"
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
			/>
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

export default Youtube;