import { useCallback, useEffect, useState } from "react";

export const ResizableDivider = ({
	onResize,
	direction = "horizontal",
	className = "",
	afterResize,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [startPos, setStartPos] = useState(0);

	const handleMouseDown = useCallback(
		(e) => {
			setIsDragging(true);
			const pos = direction === "horizontal"
				? (e.touches ? e.touches[0].clientX : e.clientX)
				: (e.touches ? e.touches[0].clientY : e.clientY);
			setStartPos(pos);
			e.preventDefault();
		},
		[direction],
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging) return;

			const currentPos = direction === "horizontal"
				? (e.touches ? e.touches[0].clientX : e.clientX)
				: (e.touches ? e.touches[0].clientY : e.clientY);
			const delta = currentPos - startPos;

			if (onResize) {
				onResize(delta);
			}

			setStartPos(currentPos);
		},
		[isDragging, startPos, direction, onResize],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
		afterResize();
	}, [afterResize]);

	// Touch event handlers
	const handleTouchStart = useCallback(
		(e) => {
			setIsDragging(true);
			const pos = direction === "horizontal" ? e.touches[0].clientX : e.touches[0].clientY;
			setStartPos(pos);
			e.preventDefault();
		},
		[direction],
	);

	const handleTouchMove = useCallback(
		(e) => {
			if (!isDragging) return;
			const currentPos = direction === "horizontal" ? e.touches[0].clientX : e.touches[0].clientY;
			const delta = currentPos - startPos;
			if (onResize) {
				onResize(delta);
			}
			setStartPos(currentPos);
		},
		[isDragging, startPos, direction, onResize],
	);

	const handleTouchEnd = useCallback(() => {
		setIsDragging(false);
		afterResize();
	}, [afterResize]);

	// Add global mouse and touch event listeners when dragging
	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove);
			document.addEventListener("touchend", handleTouchEnd);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleTouchEnd);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

	const baseClasses =
		direction === "horizontal" ? "w-2 cursor-col-resize" : "h-2 w-full cursor-row-resize";

	return (
		<div
			className={`${baseClasses} bg-gray-200 dark:bg-gray-800 resizable-divider ${className} ${
				isDragging ? "dragging" : ""
			}`}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			role="separator"
			aria-orientation={direction}
			aria-label={`Resize ${direction} divider`}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={50}
			tabIndex={0}
			onKeyDown={(e) => {
				// Allow keyboard navigation for accessibility
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
				}
			}}
		/>
	);
};
