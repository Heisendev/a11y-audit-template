const normalizeWcagId = (id: string): string => {
    return id.replace(/\./g, '_');
};

const unNormalizeWcagId = (id: string): string => {
    return id.replace(/_/g, '.');
};
export { normalizeWcagId, unNormalizeWcagId };
