import { SupabaseAccountRepository } from '../../infrastructure/repositories/SupabaseAccountRepository.js';
import { SupabaseCampaignRepository } from '../../infrastructure/repositories/SupabaseCampaignRepository.js';
import { SupabaseContactRepository } from '../../infrastructure/repositories/SupabaseContactRepository.js';
import { SupabaseLeadRepository } from '../../infrastructure/repositories/SupabaseLeadRepository.js';
import { SupabaseOpportunityRepository, SupabasePipelineStageRepository } from '../../infrastructure/repositories/SupabaseOpportunityRepository.js';
import { SupabaseProductRepository } from '../../infrastructure/repositories/SupabaseProductRepository.js';
import { SupabaseQuoteRepository } from '../../infrastructure/repositories/SupabaseQuoteRepository.js';
import { SupabaseTicketRepository } from '../../infrastructure/repositories/SupabaseTicketRepository.js';
import { SupabaseUserRepository } from '../../infrastructure/repositories/SupabaseUserRepository.js';

class Container {
  public readonly accountRepository = new SupabaseAccountRepository();
  public readonly campaignRepository = new SupabaseCampaignRepository();
  public readonly contactRepository = new SupabaseContactRepository();
  public readonly leadRepository = new SupabaseLeadRepository();
  public readonly opportunityRepository = new SupabaseOpportunityRepository();
  public readonly pipelineStageRepository = new SupabasePipelineStageRepository();
  public readonly productRepository = new SupabaseProductRepository();
  public readonly quoteRepository = new SupabaseQuoteRepository();
  public readonly ticketRepository = new SupabaseTicketRepository();
  public readonly userRepository = new SupabaseUserRepository();
  
  // Could also instantiate UseCases here and expose them, but for now 
  // exposing the Repositories is enough to fulfill basic DI for the UseCases instantiation.
}

export const container = new Container();
