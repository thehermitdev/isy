import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';
import { AddTicketMessage, GetTickets, CreateTicket } from '../../../application/usecases/support/SupportUseCases.js';

const addMessage = new AddTicketMessage(container.ticketRepository);
const getTickets = new GetTickets(container.ticketRepository);
const createTicket = new CreateTicket(container.ticketRepository);
const ticketRepo = container.ticketRepository;

export async function supportRoutes(fastify: FastifyInstance) {
  fastify.get('/tickets', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await getTickets.execute());
  });

  fastify.post('/tickets', async (req: FastifyRequest, reply: FastifyReply) => {
    const ticket = await createTicket.execute(req.body as Record<string, unknown>);
    return reply.status(201).send(ticket);
  });

  fastify.get('/tickets/:id/messages', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const messages = await ticketRepo.findMessages(req.params.id);
    return reply.send(messages);
  });

  fastify.post(
    '/tickets/:id/messages',
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      await addMessage.execute({
        ticketId: req.params.id,
        ...req.body as { senderType: 'agent' | 'customer'; message: string },
      });
      return reply.status(204).send();
    }
  );
}
