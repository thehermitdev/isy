import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';

const repo = container.productRepository;

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/products', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await repo.findAll());
  });

  fastify.post('/products', async (req: FastifyRequest, reply: FastifyReply) => {
    const product = await repo.create(req.body as Parameters<typeof repo.create>[0]);
    return reply.status(201).send(product);
  });
}
