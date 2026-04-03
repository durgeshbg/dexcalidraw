/** Express 5 types `req.params` as `string | string[]`; our routes use single segments. */
export function routeParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
