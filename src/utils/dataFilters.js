export const filterByMpn = (rows = [], mpn = '') => {
  const normalizedMpn = String(mpn).trim().toLowerCase();

  if (!normalizedMpn) return [...rows];

  return rows.filter((row) =>
    String(row?.mpn ?? '').toLowerCase().includes(normalizedMpn)
  );
};

export const sortRows = (rows = [], { key, direction = 'asc' }) => {
  return [...rows].sort((a, b) => {
    const left = a?.[key];
    const right = b?.[key];

    if (left < right) return direction === 'asc' ? -1 : 1;
    if (left > right) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};
