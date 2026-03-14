import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/organisms/Header';
import { Button } from '@/atoms/Button';
import { Select } from '@/atoms/Input';
import { Badge } from '@/atoms/Badge';
import { Modal } from '@/molecules/Modal';
import { DataTable, type Column } from '@/molecules/DataTable';
import { toast } from '@/molecules/Toast';
import { useQuotes, useCreateQuote } from '@/hooks/useQuotes';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency, formatDate, QUOTE_STATUS_LABELS, QUOTE_STATUS_BADGE } from '@/utils';
import type { Quote, QuoteStatus } from '@/types';

const quoteItemSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1),
  unit_price: z.coerce.number().min(0),
});

const quoteSchema = z.object({
  opportunity_id: z.string().min(1, 'Opportunity is required'),
  items: z.array(quoteItemSchema).min(1, 'Add at least one item'),
});

type QuoteForm = z.infer<typeof quoteSchema>;

const STATUS_BADGE_MAP: Record<string, 'gray' | 'cyan' | 'green' | 'red'> = {
  'badge-gray': 'gray',
  'badge-cyan': 'cyan',
  'badge-green': 'green',
  'badge-red': 'red',
};

export function QuotesPage() {
  const { data: quotes, isLoading } = useQuotes();
  const { data: opportunities } = useOpportunities();
  const { data: products } = useProducts();
  const createQuote = useCreateQuote();
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState([{ product_id: '', quantity: 1, unit_price: 0 }]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { items: [{ product_id: '', quantity: 1, unit_price: 0 }] },
  });

  const oppOptions = [
    { value: '', label: 'Select opportunity' },
    ...(opportunities ?? []).map((o) => ({
      value: o.id,
      label: o.name || `Opp. #${o.id.slice(0, 8)}`,
    })),
  ];

  const productOptions = [
    { value: '', label: 'Select product' },
    ...(products ?? []).map((p) => ({ value: p.id, label: `${p.name} — ${formatCurrency(p.base_price)}` })),
  ];

  const onSubmit = async (data: QuoteForm) => {
    try {
      await createQuote.mutateAsync({
        opportunity_id: data.opportunity_id,
        items: items
          .filter((i) => i.product_id)
          .map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
      });
      toast.success('Quote created');
      setModalOpen(false);
      reset({});
      setItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
    } catch {
      toast.error('Failed to create quote');
    }
  };

  const columns: Column<Quote>[] = [
    {
      key: 'id',
      header: 'Quote ID',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          #{row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'total_amount',
      header: 'Total',
      sortable: true,
      render: (row) => (
        <span className="font-semibold" style={{ color: 'oklch(0.75 0.20 280)' }}>
          {formatCurrency(row.total_amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const cls = QUOTE_STATUS_BADGE[row.status as QuoteStatus] || 'badge-gray';
        return (
          <Badge variant={STATUS_BADGE_MAP[cls] ?? 'gray'}>
            {QUOTE_STATUS_LABELS[row.status as QuoteStatus] ?? row.status}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(row.created_at)}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Quotes"
        subtitle={`${(quotes ?? []).length} total`}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)} id="create-quote-btn">
            New Quote
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4 animate-fade-in">
        <div className="glass-card overflow-hidden">
          <DataTable<Quote>
            columns={columns}
            data={quotes ?? []}
            loading={isLoading}
            emptyMessage="No quotes yet"
            keyExtractor={(row) => row.id}
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset({}); setItems([{ product_id: '', quantity: 1, unit_price: 0 }]); }}
        title="New Quote"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setModalOpen(false); reset({}); setItems([{ product_id: '', quantity: 1, unit_price: 0 }]); }}>Cancel</Button>
            <Button form="quote-form" type="submit" loading={createQuote.isPending} id="quote-form-submit">
              Create Quote
            </Button>
          </>
        }
      >
        <form id="quote-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Opportunity *" options={oppOptions} id="quote-opportunity" {...register('opportunity_id')} />

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Line Items</p>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                <div className="col-span-3">
                  <select
                    className="input select w-full"
                    value={item.product_id}
                    onChange={(e) => {
                      const p = (products ?? []).find((pr) => pr.id === e.target.value);
                      const updated = [...items];
                      updated[idx] = { ...updated[idx], product_id: e.target.value, unit_price: p?.base_price ?? 0 };
                      setItems(updated);
                    }}
                  >
                    {productOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <input
                  type="number"
                  className="input"
                  placeholder="Qty"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx] = { ...updated[idx], quantity: Number(e.target.value) };
                    setItems(updated);
                  }}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Unit price"
                  min={0}
                  value={item.unit_price}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx] = { ...updated[idx], unit_price: Number(e.target.value) };
                    setItems(updated);
                  }}
                />
                <div className="flex items-center justify-end">
                  <span className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 280)' }}>
                    {formatCurrency(item.quantity * item.unit_price)}
                  </span>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }])}
            >
              + Add Item
            </Button>
          </div>

          <div className="flex justify-end pt-2">
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {formatCurrency(items.reduce((s, i) => s + (i.quantity * i.unit_price), 0))}
              </p>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
