import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';

const repo = container.leadRepository;

export async function leadRoutes(fastify: FastifyInstance) {
  fastify.get('/leads', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await repo.findAll());
  });

  fastify.get('/leads/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const lead = await repo.findById(req.params.id);
    return reply.send(lead);
  });

  fastify.post('/leads', async (req: FastifyRequest, reply: FastifyReply) => {
    const lead = await repo.create(req.body as any);
    return reply.status(201).send(lead);
  });

  fastify.patch('/leads/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const updated = await repo.update(req.params.id, req.body as any);
    return reply.send(updated);
  });

  fastify.delete('/leads/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await repo.delete(req.params.id);
    return reply.status(204).send();
  });
}
