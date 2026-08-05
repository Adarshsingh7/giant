export const salesQueryKey = ({ DtFrom, DtTo }) => [
  'sales',
  { DtFrom, DtTo },
];

export const overviewQueryKey = ({ DtFrom, DtTo }) => [
  'overview',
  { DtFrom, DtTo },
];

export const stockQueryKey = () => ['stock'];
