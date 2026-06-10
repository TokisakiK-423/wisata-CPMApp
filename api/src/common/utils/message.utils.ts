export const formatMessage = (
  message: string | undefined,
  params: Record<string, string | number>,
): string => {
  if (!message) return '';

  let result = message;

  for (const key in params) {
    result = result.replace(`{${key}}`, String(params[key]));
  }

  return result;
};
