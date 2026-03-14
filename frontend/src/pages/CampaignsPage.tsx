import { useState } from 'react';
import { Plus, Calendar, DollarSign, Users, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/organisms/Header';
import { Button } from '@/atoms/Button';
import { Input, Select } from '@/atoms/Input';
import { Modal } from '@/molecules/Modal';
import { toast } from '@/molecules/Toast';
import { PageSpinner } from '@/atoms/Spinner';
import { useCampaigns, useCreateCampaign, useAddCampaignMember } from '@/hooks/useCampaigns';
import { useContacts } from '@/hooks/useContacts';
import { useLeads } from '@/hooks/useLeads';
import { formatCurrency, formatDate } from '@/utils';
import type { Campaign } from '@/types';

const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  budget: z.coerce.number().min(0).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type CampaignForm = z.infer<typeof campaignSchema>;

const memberSchema = z.object({
  memberId: z.string().min(1, 'Select a member'),
  type: z.enum(['contact', 'lead']),
});

type MemberForm = z.infer<typeof memberSchema>;

export function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const { data: contacts } = useContacts();
  const { data: leads } = useLeads();
  const createCampaign = useCreateCampaign();
  const addMember = useAddCampaignMember();

  const [createOpen, setCreateOpen] = useState(false);
  const [memberModalCampaign, setMemberModalCampaign] = useState<Campaign | null>(null);

  const {
    register: regCampaign,
    handleSubmit: submitCampaign,
    reset: resetCampaign,
  } = useForm<CampaignForm>({ resolver: zodResolver(campaignSchema) });

  const {
    register: regMember,
    handleSubmit: submitMember,
    reset: resetMember,
    watch,
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: { type: 'contact' },
  });

  const memberType = watch('type');

  const memberOptions = memberType === 'contact'
    ? (contacts ?? []).map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))
    : (leads ?? []).map((l) => ({ value: l.id, label: l.name }));

  const onCreateCampaign = async (data: CampaignForm) => {
    try {
      await createCampaign.mutateAsync({
        name: data.name,
        budget: data.budget,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
      });
      toast.success('Campaign created');
      setCreateOpen(false);
      resetCampaign({});
    } catch {
      toast.error('Failed to create campaign');
    }
  };

  const onAddMember = async (data: MemberForm) => {
    if (!memberModalCampaign) return;
    try {
      await addMember.mutateAsync({
        id: memberModalCampaign.id,
        data: { memberId: data.memberId, type: data.type },
      });
      toast.success('Member added');
      setMemberModalCampaign(null);
      resetMember({ type: 'contact' });
    } catch {
      toast.error('Failed to add member');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Campaigns"
        subtitle={`${(campaigns ?? []).length} total`}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)} id="create-campaign-btn">
            New Campaign
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {isLoading ? (
          <PageSpinner />
        ) : campaigns && campaigns.length > 0 ? (
          <div className="grid-auto-fill">
            {campaigns.map((c) => (
              <div key={c.id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="font-semibold text-base"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {c.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setMemberModalCampaign(c)}
                    title="Add Member"
                    aria-label="Add campaign member"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {c.budget !== undefined && c.budget !== null && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <DollarSign className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--icon-color)' }} />
                      Budget: {formatCurrency(c.budget)}
                    </div>
                  )}
                  {c.start_date && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--icon-color)' }} />
                      {formatDate(c.start_date)} → {formatDate(c.end_date)}
                    </div>
                  )}
                  {c.members && c.members.length > 0 && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Users className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--icon-color)' }} />
                      {c.members.length} member{c.members.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
            No campaigns yet — create your first one!
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); resetCampaign({}); }}
        title="New Campaign"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateOpen(false); resetCampaign({}); }}>Cancel</Button>
            <Button form="campaign-form" type="submit" loading={createCampaign.isPending} id="campaign-form-submit">
              Create Campaign
            </Button>
          </>
        }
      >
        <form id="campaign-form" onSubmit={submitCampaign(onCreateCampaign)} className="space-y-4">
          <Input label="Campaign Name *" placeholder="Q4 Email Blast" id="campaign-name" {...regCampaign('name')} />
          <Input type="number" label="Budget ($)" placeholder="5000" id="campaign-budget" {...regCampaign('budget')} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" label="Start Date" id="campaign-start" {...regCampaign('start_date')} />
            <Input type="date" label="End Date" id="campaign-end" {...regCampaign('end_date')} />
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={!!memberModalCampaign}
        onClose={() => { setMemberModalCampaign(null); resetMember({ type: 'contact' }); }}
        title={`Add Member — ${memberModalCampaign?.name ?? ''}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setMemberModalCampaign(null); resetMember({ type: 'contact' }); }}>Cancel</Button>
            <Button form="member-form" type="submit" loading={addMember.isPending} id="member-form-submit">
              Add Member
            </Button>
          </>
        }
      >
        <form id="member-form" onSubmit={submitMember(onAddMember)} className="space-y-4">
          <Select
            label="Member Type"
            options={[{ value: 'contact', label: 'Contact' }, { value: 'lead', label: 'Lead' }]}
            id="member-type"
            {...regMember('type')}
          />
          <Select
            label="Select Member"
            options={[{ value: '', label: 'Choose…' }, ...memberOptions]}
            id="member-id"
            {...regMember('memberId')}
          />
        </form>
      </Modal>
    </div>
  );
}
