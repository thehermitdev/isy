import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';
import {
  GetPipeline,
  CreateOpportunity,
  GetOpportunities,
  CreateOpportunitySchema,
  UpdateOpportunity,
} from '../../../application/usecases/opportunities/OpportunityUseCases.js';

const getPipeline = new GetPipeline(container.opportunityRepository, container.pipelineStageRepository);
const createOpportunity = new CreateOpportunity(container.opportunityRepository);
const getOpportunities = new GetOpportunities(container.opportunityRepository);
const updateOpportunity = new UpdateOpportunity(container.opportunityRepository);
const stageRepo = container.pipelineStageRepository;

export async function opportunityRoutes(fastify: FastifyInstance) {
  fastify.get('/opportunities', async (_req: FastifyRequest, reply: FastifyReply) => {
    const opportunities = await getOpportunities.execute();
    return reply.send(opportunities);
  });

  fastify.post('/opportunities', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateOpportunitySchema.parse(req.body);
    const opp = await createOpportunity.execute(parsed);
    return reply.status(201).send(opp);
  });

  fastify.patch('/opportunities/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const opp = await updateOpportunity.execute({ id: req.params.id, ...(req.body as Record<string, unknown>) });
    return reply.send(opp);
  });

  fastify.get('/pipeline', async (_req: FastifyRequest, reply: FastifyReply) => {
    const board = await getPipeline.execute();
    return reply.send(board);
  });

  fastify.get('/pipeline/stages', async (_req: FastifyRequest, reply: FastifyReply) => {
    const stages = await stageRepo.findAllOrdered();
    return reply.send(stages);
  });
}
