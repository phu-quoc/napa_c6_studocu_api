import slugify from 'slugify';

export const createSlug = (name: string) => {
  return slugify(name + ' ' + Date.now(), {
    lower: true,
  });
};
