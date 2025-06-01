export const getImage = (path: string): string => {
  return `${import.meta.env.VITE_SERVER_HOST}${path}`.replace(
    '/uploads//app',
    ''
  );
};
