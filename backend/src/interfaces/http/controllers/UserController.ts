import type { FastifyPluginAsync } from 'fastify';
import { userService } from '../../../application/services/UserService.js';

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/users', async (request, reply) => {
    const users = await userService.getAllUsers();
    return reply.send(users);
  });
};
