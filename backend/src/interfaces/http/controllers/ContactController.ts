import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';

const repo = container.contactRepository;

export async function contactRoutes(fastify: FastifyInstance) {
  fastify.get('/contacts', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await repo.findAll());
  });

  fastify.get('/contacts/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const contact = await repo.findById(req.params.id);
    return reply.send(contact);
  });

  fastify.post('/contacts', async (req: FastifyRequest, reply: FastifyReply) => {
    const contact = await repo.create(req.body as any);
    return reply.status(201).send(contact);
  });

  fastify.patch('/contacts/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const updated = await repo.update(req.params.id, req.body as any);
    return reply.send(updated);
  });

  fastify.delete('/contacts/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await repo.delete(req.params.id);
    return reply.status(204).send();
  });
}
