export const getTableColumns = <
  T extends Record<string, string | number | boolean | null | undefined>
>(
  data: T[],
  order: (
    | keyof T
    | { key: keyof T; max?: number; plus?: number }
  )[] = Object.keys(data[0] ?? {})
) => {
  const columns = data.reduce<Record<keyof T, { width: number }>>(
    (cols, row) => {
      for (const [key, value] of Object.entries(row)) {
        // @ts-expect-error
        if (!cols[key]) cols[key] = { key, width: 0 };

        cols[key]!.width = Math.max(
          cols[key]!.width,
          (value?.toString() ?? '').length
        );
      }
      return cols;
    },
    // @ts-expect-error
    {}
  );
  const orderedColumns = order.map((key) => {
    if (typeof key === 'string')
      return columns[key] as unknown as { key: keyof T; width: number };

    // @ts-expect-error
    const col = columns[key.key];

    if (!col) return { key, width: 0 };

    // @ts-expect-error
    col.width = Math.min(col.width, key.max ?? Infinity) + (key.plus ?? 0);

    return col as unknown as { key: keyof T; width: number };
  });
  return orderedColumns;
};
