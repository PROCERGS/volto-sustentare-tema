import { useMemo } from 'react';

export default function useDateRangeFilter(items, startDate, endDate, getDate) {
  return useMemo(() => {
    if (!Array.isArray(items)) return [];
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return items.filter((item) => {
      const itemDate = getDate(item);
      if (!itemDate) return false;
      const date = new Date(itemDate);
      if (isNaN(date)) return false;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  }, [items, startDate, endDate, getDate]);
}
