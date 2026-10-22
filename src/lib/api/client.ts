// The one connection to the backend. Typed from schema.d.ts, so a backend change breaks the build, not the page.
import createClient from 'openapi-fetch';
import { env } from '../env';
import type { paths } from './schema';

export const api = createClient<paths>({ baseUrl: env.apiUrl });
