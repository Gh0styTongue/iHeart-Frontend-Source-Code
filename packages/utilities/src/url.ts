export const toURL = (input: string | URL, base?: string | URL) => {
  try {
    return new URL(input, base);
  } catch (error) {
    let errorMessage = 'Invalid URL';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new TypeError(
      `${errorMessage}: Could not create URL from: "${input}"${
        base ? ` (base "${base}")` : ''
      }`,
    );
  }
};

export const toHttps = (input: string | URL) => {
  const url = toURL(input);
  url.protocol = 'https:';
  return url;
};
