export const getTokenFromURL = (url: string) => {
  return url?.split('?')[1]?.split('=')[1];
};
