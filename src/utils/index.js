import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => {
	return twMerge(clsx(inputs));
};

export const hash = (length = 10) => {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
};

export const debounce = (func, wait) => {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};

export const formatBytes = bytes => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const index = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** index).toFixed(0)} ${units[index]}`;
};

export const removeTabItems = tabId => {
	// remove items from localStorage that start with tab_<tabId>_
	const keys = Object.keys(localStorage);
	keys.forEach(key => {
		if (key.startsWith(`tab_${tabId}_`)) {
			localStorage.removeItem(key);
		}
	});
};

export const processDefault = module => ({ default: module.Todo });