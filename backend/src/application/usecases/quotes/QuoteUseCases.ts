import type { UseCase } from '../UseCase.js';
import type { QuoteRepository } from '../../../domain/repositories/QuoteRepository.js';
import type { Quote } from '../../../domain/entities/Quote.js';
import { SupabaseQuoteRepository } from '../../../infrastructure/repositories/SupabaseQuoteRepository.js';
import { z } from 'zod';

export const CreateQuoteSchema = z.object({
  opportunityId: z.string().uuid().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().min(0),
    })
  ).min(1, 'At least one item is required'),
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;

export class CreateQuote implements UseCase<CreateQuoteInput, Quote> {
  private readonly quoteRepo: SupabaseQuoteRepository;

  constructor(quoteRepository: QuoteRepository) {
    this.quoteRepo = quoteRepository as SupabaseQuoteRepository;
  }

  async execute(input: CreateQuoteInput): Promise<Quote> {
    const validated = CreateQuoteSchema.parse(input);

    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const quote = await this.quoteRepo.create({
      opportunityId: validated.opportunityId ?? null,
      totalAmount,
      status: 'draft',
    });

    await this.quoteRepo.addItems(
      validated.items.map((item) => ({ quoteId: quote.id, ...item }))
    );

    return quote;
  }
}

export class GetQuotes implements UseCase<void, Quote[]> {
  constructor(private readonly quoteRepo: QuoteRepository) {}

  async execute(): Promise<Quote[]> {
    return this.quoteRepo.findAll();
  }
}
