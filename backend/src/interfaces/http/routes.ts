import type { FastifyInstance } from 'fastify';
import { accountRoutes } from './controllers/AccountController.js';
import { contactRoutes } from './controllers/ContactController.js';
import { opportunityRoutes } from './controllers/OpportunityController.js';
import { quoteRoutes } from './controllers/QuoteController.js';
import { campaignRoutes } from './controllers/CampaignController.js';
import { supportRoutes } from './controllers/SupportController.js';
import { leadRoutes } from './controllers/LeadController.js';
import { productRoutes } from './controllers/ProductController.js';
import { authRoutes } from './controllers/AuthController.js';
import { userRoutes } from './controllers/UserController.js';
import { activityRoutes } from './controllers/ActivityController.js';
import { authenticate } from '../../core/middleware/auth.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // Public Routes
  await fastify.register(authRoutes, { prefix: '/api' });
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Private Routes (Require Authentication)
  await fastify.register(async (child) => {
    child.addHook('onRequest', authenticate);
    
    await child.register(accountRoutes, { prefix: '/api' });
    await child.register(contactRoutes, { prefix: '/api' });
    await child.register(opportunityRoutes, { prefix: '/api' });
    await child.register(quoteRoutes, { prefix: '/api' });
    await child.register(campaignRoutes, { prefix: '/api' });
    await child.register(supportRoutes, { prefix: '/api' });
    await child.register(leadRoutes, { prefix: '/api' });
    await child.register(productRoutes, { prefix: '/api' });
    await child.register(userRoutes, { prefix: '/api' });
    await child.register(activityRoutes, { prefix: '/api' });
  });
}
