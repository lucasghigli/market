function withBase(path) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export function getImageSrc(path) {
  if (!path) return '';

  if (path.startsWith('/images/')) {
    const encoded = path
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')
      .replace(/^%2F/, '/');
    return withBase(encoded);
  }

  if (path.startsWith('/')) {
    return withBase(path);
  }

  return path;
}
