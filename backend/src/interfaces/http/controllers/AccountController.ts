import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';
import {
  CreateAccount,
  GetAccounts,
  GetAccount,
  UpdateAccount,
  DeleteAccount,
  CreateAccountSchema,
} from '../../../application/usecases/accounts/AccountUseCases.js';
import { AppError } from '../../../core/errors/AppError.js';

const createAccount = new CreateAccount(container.accountRepository);
const getAccounts = new GetAccounts(container.accountRepository);
const getAccount = new GetAccount(container.accountRepository);
const updateAccount = new UpdateAccount(container.accountRepository);
const deleteAccount = new DeleteAccount(container.accountRepository);

export async function accountRoutes(fastify: FastifyInstance) {
  fastify.get('/accounts', async (_req: FastifyRequest, reply: FastifyReply) => {
    const accounts = await getAccounts.execute();
    return reply.send(accounts);
  });

  fastify.get('/accounts/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const account = await getAccount.execute(req.params.id);
    if (!account) throw AppError.notFound('Account', req.params.id);
    return reply.send(account);
  });

  fastify.post('/accounts', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateAccountSchema.parse(req.body);
    const account = await createAccount.execute(parsed);
    return reply.status(201).send(account);
  });

  fastify.put('/accounts/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const updated = await updateAccount.execute({ id: req.params.id, data: req.body as Record<string, unknown> });
    return reply.send(updated);
  });

  fastify.delete('/accounts/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await deleteAccount.execute(req.params.id);
    return reply.status(204).send();
  });
}
