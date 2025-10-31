const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const allowed = ['work', 'home', 'personal'];
  if (allowed.includes(type)) return type;
};

const parseBooleanString = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;
  const v = value.toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseBooleanString(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};