import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';
import { AddCampaignMember, GetCampaigns, CreateCampaign } from '../../../application/usecases/campaigns/CampaignUseCases.js';

const addMember = new AddCampaignMember(container.campaignRepository);
const getCampaigns = new GetCampaigns(container.campaignRepository);
const createCampaign = new CreateCampaign(container.campaignRepository);

export async function campaignRoutes(fastify: FastifyInstance) {
  fastify.get('/campaigns', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await getCampaigns.execute());
  });

  fastify.post('/campaigns', async (req: FastifyRequest, reply: FastifyReply) => {
    const campaign = await createCampaign.execute(req.body as Record<string, unknown>);
    return reply.status(201).send(campaign);
  });

  fastify.post(
    '/campaigns/:id/members',
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      await addMember.execute({
        campaignId: req.params.id,
        ...req.body as { memberId: string; type: 'contact' | 'lead' },
      });

      return reply.status(204).send();
    }
  );
}
