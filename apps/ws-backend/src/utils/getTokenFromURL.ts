export const getTokenAndRoomIdFromURL = (
  url: string
): { token: string; roomId: string } | null => {
  const params = url?.split('?')[1];
  if (!params) return null;
  const [tokenStr, roomIdStr] = params.split('&');
  const token = tokenStr?.split('=')[1];
  const roomId = roomIdStr?.split('=')[1];
  if (!token || !roomId) return null;
  return { token, roomId };
};
