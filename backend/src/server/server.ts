import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { registerRoutes } from '../interfaces/http/routes.js';
import { AppError } from '../core/errors/AppError.js';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});

// ─── Plugins ─────────────────────────────────
await fastify.register(cors, {
  origin: (origin, cb) => {
    // Default allowed origins for local development
    const devOrigins = [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://127.0.0.1:5173',
    ];
    
    // Production origins - will be set via environment
    const productionOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
      : [];

    // Allow if:
    // 1. No origin (like curl, mobile apps, Postman)
    // 2. In development mode
    // 3. Origin matches dev list
    // 4. Origin matches production list or CORS_ORIGIN env var
    if (
      !origin || 
      process.env.NODE_ENV !== 'production' ||
      devOrigins.includes(origin) ||
      productionOrigins.includes(origin) ||
      origin === process.env.CORS_ORIGIN
    ) {
      cb(null, true);
      return;
    }

    // Reject if none of above conditions match
    cb(new Error(`CORS policy: origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
});

await fastify.register(sensible);

// ─── Global Error Handler ─────────────────────
fastify.setErrorHandler((error, _req, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });
  }

  // Zod validation errors
  if (error.name === 'ZodError') {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: JSON.parse(error.message),
    });
  }

  (fastify.log as any).error(error);
  return reply.status(500).send({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
});

// ─── Routes ─────────────────────────────────
await registerRoutes(fastify);

// ─── Export for Vercel ─────────────────────
export default fastify;

// ─── Start Only if Run Directly ─────────────
if (process.env.NODE_ENV !== 'production' || process.env.VITE_VERCEL_ENV === undefined) {
  const PORT = Number(process.env.PORT ?? 3001);
  const HOST = process.env.HOST ?? '0.0.0.0';

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    (fastify.log as any).error(err);
    process.exit(1);
  }
}
