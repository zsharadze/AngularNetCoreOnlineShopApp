export function buildGetParams(params: any): any {
  let newParams: any = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value || value === 0) {
      newParams[key] = value;
    }
  });

  return newParams;
}
