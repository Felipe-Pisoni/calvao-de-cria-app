"use client";

import classNames from "classnames";
import { useMemo } from "react";
interface PaginationProps {
	current: number;
	total: number;
	changePageIndex: (page: number) => void;
}
export function Pagination({ current, total, changePageIndex }: PaginationProps) {
	const TOTAL_STEPS = Math.min(total, 3);
	const pageNumbers = useMemo(
		() =>
			Array.from({ length: TOTAL_STEPS }, (_, i) => {
				const number = i + current;
				if (current <= 1) return number;
				if (current === total) return number - TOTAL_STEPS + 1;
				return number - 1;
			}),
		[current, total, TOTAL_STEPS]
	);
	function nextPage() {
		changePageIndex(current + 1);
	}
	function previousPage() {
		changePageIndex(current - 1);
	}
	return (
		<div className="flex justify-between gap-4 text-primary items-center">
			<div className="w-24 flex justify-center">
				{current > 1 && (
					<button type="button" className="font-bold" data-cy="previous-page" disabled={current <= 1} onClick={previousPage}>
						{"<<"} anterior
					</button>
				)}
			</div>
			<div className="flex gap-2">
				{pageNumbers.map((pageNumber, index) => (
					<span
						className={`h-9 flex items-center justify-center border border-primary rounded ${classNames({
							"text-white": pageNumber === current,
							"bg-primary": pageNumber === current,
							"w-20": index === 1,
							"w-9": index !== 1
						})}`}
						key={pageNumber}>
						{pageNumber}
					</span>
				))}
			</div>
			<div className="w-24 flex justify-center">
				{current < total && (
					<button type="button" className="font-bold" data-cy="next-page" disabled={current >= total} onClick={nextPage}>
						próximo {">>"}{" "}
					</button>
				)}
			</div>
		</div>
	);
}
