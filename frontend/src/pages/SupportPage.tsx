import { useState } from 'react';
import { Plus, Send, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/organisms/Header';
import { Button } from '@/atoms/Button';
import { Input, Select, Textarea } from '@/atoms/Input';
import { Badge } from '@/atoms/Badge';
import { Modal } from '@/molecules/Modal';
import { toast } from '@/molecules/Toast';
import { PageSpinner } from '@/atoms/Spinner';
import { useTickets, useCreateTicket, useTicketMessages, useAddTicketMessage } from '@/hooks/useSupport';
import { useAccounts } from '@/hooks/useAccounts';
import { useContacts } from '@/hooks/useContacts';
import {
  formatDate,
  timeAgo,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_BADGE,
  TICKET_PRIORITY_BADGE,
} from '@/utils';
import type { SupportTicket, TicketPriority, TicketStatus } from '@/types';

const ticketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  account_id: z.string().optional(),
  contact_id: z.string().optional(),
});

type TicketForm = z.infer<typeof ticketSchema>;

const STATUS_BADGE_MAP: Record<string, 'gray' | 'cyan' | 'green' | 'yellow' | 'red'> = {
  'badge-gray': 'gray',
  'badge-cyan': 'cyan',
  'badge-green': 'green',
  'badge-yellow': 'yellow',
  'badge-red': 'red',
};

// Message thread subcomponent
function MessageThread({ ticketId }: { ticketId: string }) {
  const { data: messages, isLoading } = useTicketMessages(ticketId);
  const addMessage = useAddTicketMessage();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await addMessage.mutateAsync({ id: ticketId, data: { senderType: 'agent', message: text.trim() } });
      setText('');
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex-1 overflow-y-auto space-y-3 max-h-64 modal-scroll pr-1">
        {(messages ?? []).length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
            No messages yet
          </p>
        ) : (
          (messages ?? []).map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] px-3 py-2 rounded-xl text-sm"
                style={
                  m.sender_type === 'agent'
                    ? {
                        background: 'linear-gradient(135deg, oklch(0.58 0.25 280 / 0.25), oklch(0.52 0.28 300 / 0.15))',
                        border: '1px solid oklch(0.58 0.25 280 / 0.30)',
                        color: 'var(--text-primary)',
                      }
                    : {
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <p>{m.message}</p>
                <p className="text-[10px] mt-1 opacity-60">{timeAgo(m.created_at)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          onClick={handleSend}
          loading={addMessage.isPending}
          size="icon"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function SupportPage() {
  const { data: tickets, isLoading } = useTickets();
  const { data: accounts } = useAccounts();
  const { data: contacts } = useContacts();
  const createTicket = useCreateTicket();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: 'medium' },
  });

  const onSubmit = async (data: TicketForm) => {
    try {
      await createTicket.mutateAsync({
        subject: data.subject,
        priority: data.priority as TicketPriority,
        account_id: data.account_id || undefined,
        contact_id: data.contact_id || undefined,
      });
      toast.success('Ticket created');
      setCreateOpen(false);
      reset({ priority: 'medium' });
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  const accountOptions = [
    { value: '', label: 'No Account' },
    ...(accounts ?? []).map((a) => ({ value: a.id, label: a.name })),
  ];

  const contactOptions = [
    { value: '', label: 'No Contact' },
    ...(contacts ?? []).map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` })),
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Support"
        subtitle={`${(tickets ?? []).length} tickets`}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)} id="create-ticket-btn">
            New Ticket
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-3 animate-fade-in">
        {isLoading ? (
          <PageSpinner />
        ) : (tickets ?? []).length > 0 ? (
          (tickets ?? []).map((ticket) => {
            const statusCls = TICKET_STATUS_BADGE[ticket.status as TicketStatus] || 'badge-gray';
            const priorityCls = TICKET_PRIORITY_BADGE[ticket.priority as TicketPriority] || 'badge-gray';
            return (
              <div
                key={ticket.id}
                className="glass-card p-4 cursor-pointer flex items-center justify-between gap-4"
                onClick={() => setSelectedTicket(ticket)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedTicket(ticket)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{ticket.id.slice(0, 8)}</span>
                    <Badge variant={STATUS_BADGE_MAP[statusCls] ?? 'gray'} dot>
                      {TICKET_STATUS_LABELS[ticket.status as TicketStatus] ?? ticket.status}
                    </Badge>
                    <Badge variant={STATUS_BADGE_MAP[priorityCls] ?? 'gray'}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{ticket.subject}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
            No support tickets yet — everything's running smoothly! 🎉
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); reset({ priority: 'medium' }); }}
        title="New Support Ticket"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateOpen(false); reset({ priority: 'medium' }); }}>Cancel</Button>
            <Button form="ticket-form" type="submit" loading={createTicket.isPending} id="ticket-form-submit">
              Create Ticket
            </Button>
          </>
        }
      >
        <form id="ticket-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Subject *" placeholder="Unable to access account" error={errors.subject?.message} id="ticket-subject" {...register('subject')} />
          <Select label="Priority" options={priorityOptions} id="ticket-priority" {...register('priority')} />
          <Select label="Account" options={accountOptions} id="ticket-account" {...register('account_id')} />
          <Select label="Contact" options={contactOptions} id="ticket-contact" {...register('contact_id')} />
        </form>
      </Modal>

      {/* Message Thread Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.subject ?? 'Ticket'}
        size="lg"
      >
        {selectedTicket && <MessageThread ticketId={selectedTicket.id} />}
      </Modal>
    </div>
  );
}
