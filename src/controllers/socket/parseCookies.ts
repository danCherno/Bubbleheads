// Utility function to parse cookies
export function parseCookies(cookieString: string): string | undefined {
    return cookieString
      .split("; ")
      .find((row: string) => row.startsWith("user="))
      ?.split("=")[1];
}
  