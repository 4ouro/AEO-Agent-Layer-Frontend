// Settings read once at startup. NEXT_PUBLIC_ values are available in the browser too.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local.');

export const env = { apiUrl: apiUrl.replace(/\/$/, '') };
