import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../core/di/container.js';
import { SignUp, SignIn, SignUpSchema, SignInSchema } from '../../../application/usecases/auth/AuthUseCases.js';
import { authenticate } from '../../../core/middleware/auth.js';

const signUpUseCase = new SignUp(container.userRepository);
const signInUseCase = new SignIn(container.userRepository);

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/signup', async (req: FastifyRequest, reply: FastifyReply) => {
    const input = SignUpSchema.parse(req.body);
    const result = await signUpUseCase.execute(input);
    return reply.status(201).send(result);
  });

  fastify.post('/auth/signin', async (req: FastifyRequest, reply: FastifyReply) => {
    const input = SignInSchema.parse(req.body);
    const result = await signInUseCase.execute(input);
    return reply.send(result);
  });
  
  fastify.get('/auth/me', { preHandler: authenticate }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    if (!user) {
      // If called without middleware (public route), return error or null
      return reply.status(401).send({ error: 'UNAUTHORIZED' });
    }
    
    // Fetch detailed profile from our DB
    const profile = await container.userRepository.findByEmail(user.email);
    return reply.send({ user: profile });
  });
}
