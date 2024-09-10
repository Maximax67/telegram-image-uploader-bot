const escapeChars: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (str: string): string => {
  return str.replace(/[&<>"']/g, (match) => escapeChars[match]);
};
