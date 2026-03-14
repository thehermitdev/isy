import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { activityService } from '../../../application/services/ActivityService.js';

const activitySchema = z.object({
  type: z.string().min(1),
  subject: z.string().min(1),
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  activityDate: z.string().datetime().optional(),
});

export const activityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/activities', async (request, reply) => {
    const activities = await activityService.getAllActivities();
    return reply.send(activities);
  });

  fastify.post('/activities', async (request, reply) => {
    const data = activitySchema.parse(request.body);
    const newActivity = await activityService.createActivity({
      ...data,
      activityDate: data.activityDate ? new Date(data.activityDate) : new Date(),
    });
    return reply.code(201).send(newActivity);
  });

  fastify.put('/activities/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = activitySchema.partial().parse(request.body);
    const updated = await activityService.updateActivity(id, {
      ...data,
      activityDate: data.activityDate ? new Date(data.activityDate) : undefined,
    });
    return reply.send(updated);
  });

  fastify.delete('/activities/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    await activityService.deleteActivity(id);
    return reply.code(204).send();
  });
};
