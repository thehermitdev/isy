import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';
import { CreateQuote, GetQuotes, CreateQuoteSchema } from '../../../application/usecases/quotes/QuoteUseCases.js';

const createQuote = new CreateQuote(container.quoteRepository);
const getQuotes = new GetQuotes(container.quoteRepository);

export async function quoteRoutes(fastify: FastifyInstance) {
  fastify.get('/quotes', async (_req: FastifyRequest, reply: FastifyReply) => {
    const quotes = await getQuotes.execute();
    return reply.send(quotes);
  });

  fastify.post('/quotes', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateQuoteSchema.parse(req.body);
    const quote = await createQuote.execute(parsed);
    return reply.status(201).send(quote);
  });
}
