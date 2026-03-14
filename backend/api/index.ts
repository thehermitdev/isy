import fastify from '../src/server/server.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Single instance reused across invocations for better cold start performance
let fastifyInstance: any = null;
let initializationPromise: any = null;

async function initializeFastify() {
  if (fastifyInstance) {
    return fastifyInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('[Vercel] Initializing Fastify server...');
      
      // Connect all routes and plugins
      await fastify.ready();
      
      fastifyInstance = fastify;
      console.log('[Vercel] Fastify server initialized successfully');
      
      return fastifyInstance;
    } catch (error) {
      console.error('[Vercel] Failed to initialize Fastify:', error);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Ensure Fastify is initialized
    const app = await initializeFastify();

    // Build the full URL
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http';
    const host = req.headers.host || 'localhost';
    const url = new URL(`${protocol}://${host}${req.url}`);

    console.log(`[Vercel] ${req.method} ${url.pathname}`);

    // Create a promise that resolves when response is sent
    let responseHandled = false;

    // Inject the request through Fastify's HTTP interface
    const response = await app.inject({
      method: req.method as any,
      url: req.url,
      headers: req.headers as any,
      payload: req.body,
    });

    // Set response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string | string[]);
    });

    // Send response
    res.statusCode = response.statusCode;
    res.end(response.rawPayload);
    responseHandled = true;

    console.log(`[Vercel] Response sent: ${response.statusCode}`);
  } catch (error) {
    console.error('[Vercel] Handler error:', error);

    // Only send error if response hasn't been sent yet
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Request processing failed',
          ...(process.env.NODE_ENV === 'development' && { details: String(error) }),
        })
      );
    }
  }
};
