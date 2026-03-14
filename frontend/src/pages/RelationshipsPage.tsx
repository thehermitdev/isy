import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Users, Building2, UserCheck, MoreVertical, Edit2, Trash2, Mail, Phone, Globe, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/organisms/Header';
import { Button } from '@/atoms/Button';
import { Input, Select } from '@/atoms/Input';
import { Badge } from '@/atoms/Badge';
import { Modal } from '@/molecules/Modal';
import { DataTable, type Column } from '@/molecules/DataTable';
import { SearchBar, useSearch } from '@/molecules/SearchBar';
import { toast } from '@/molecules/Toast';
import { Avatar } from '@/atoms/Avatar';
import { cn, LEAD_STATUS_LABELS } from '@/utils';

// Hooks
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/useContacts';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useLeads';

// Types
import type { Account, Contact, Lead } from '@/types';

// ============================================================
// Schemas
// ============================================================
const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  industry: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
});

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  accountId: z.string().uuid().optional().nullable(),
});

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  company: z.string().optional(),
  source: z.enum(['web', 'referral', 'email', 'social', 'event', 'other']).optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
});

type TabType = 'accounts' | 'contacts' | 'leads';

export function RelationshipsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'accounts';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const { query, setQuery } = useSearch();

  // Sync tab state with URL
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['accounts', 'contacts', 'leads'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: TabType; item: any } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: TabType; id: string; name: string } | null>(null);

  // Data
  const { data: accounts = [], isLoading: loadingAccounts } = useAccounts();
  const { data: contacts = [], isLoading: loadingContacts } = useContacts();
  const { data: leads = [], isLoading: loadingLeads } = useLeads();

  // Mutations
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  // Loading state
  const isLoading = activeTab === 'accounts' ? loadingAccounts : activeTab === 'contacts' ? loadingContacts : loadingLeads;

  // ============================================================
  // Forms setup
  // ============================================================
  const accountForm = useForm<z.infer<typeof accountSchema>>({ resolver: zodResolver(accountSchema) });
  const contactForm = useForm<z.infer<typeof contactSchema>>({ resolver: zodResolver(contactSchema) });
  const leadForm = useForm<z.infer<typeof leadSchema>>({ 
    resolver: zodResolver(leadSchema),
    defaultValues: { status: 'new' }
  });

  // ============================================================
  // Handlers
  // ============================================================
  const handleCreate = async (data: any) => {
    try {
      if (activeTab === 'accounts') {
        await createAccount.mutateAsync(data);
        toast.success('Account created');
      } else if (activeTab === 'contacts') {
        await createContact.mutateAsync(data);
        toast.success('Contact created');
      } else {
        await createLead.mutateAsync(data);
        toast.success('Lead created');
      }
      setIsNewModalOpen(false);
      resetForms();
    } catch (e) {
      toast.error('Failed to create item');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    try {
      if (editingItem.type === 'accounts') {
        await updateAccount.mutateAsync({ id: editingItem.item.id, data });
        toast.success('Account updated');
      } else if (editingItem.type === 'contacts') {
        await updateContact.mutateAsync({ id: editingItem.item.id, data });
        toast.success('Contact updated');
      } else {
        await updateLead.mutateAsync({ id: editingItem.item.id, data });
        toast.success('Lead updated');
      }
      setEditingItem(null);
      resetForms();
    } catch (e) {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'accounts') await deleteAccount.mutateAsync(itemToDelete.id);
      else if (itemToDelete.type === 'contacts') await deleteContact.mutateAsync(itemToDelete.id);
      else await deleteLead.mutateAsync(itemToDelete.id);
      
      toast.success('Deleted successfully');
      setItemToDelete(null);
    } catch (e) {
      toast.error('Failed to delete item');
    }
  };

  const resetForms = () => {
    accountForm.reset();
    contactForm.reset();
    leadForm.reset({ status: 'new' });
  };

  const openEditModal = (item: any) => {
    setEditingItem({ type: activeTab, item });
    if (activeTab === 'accounts') accountForm.reset(item);
    else if (activeTab === 'contacts') contactForm.reset(item);
    else leadForm.reset(item);
  };

  // ============================================================
  // Filtering
  // ============================================================
  const filteredData = useMemo(() => {
    const q = query.toLowerCase();
    if (activeTab === 'accounts') {
      return accounts.filter(a => a.name.toLowerCase().includes(q) || (a.industry ?? '').toLowerCase().includes(q));
    } else if (activeTab === 'contacts') {
      return contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q));
    } else {
      return leads.filter(l => l.name.toLowerCase().includes(q) || (l.company ?? '').toLowerCase().includes(q));
    }
  }, [activeTab, query, accounts, contacts, leads]);

  // ============================================================
  // Columns Definition
  // ============================================================
  const accountColumns: Column<Account>[] = [
    {
      key: 'name',
      header: 'Account',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-primary">{row.name}</p>
            {row.website && <p className="text-[10px] text-muted">{row.website}</p>}
          </div>
        </div>
      )
    },
    { key: 'industry', header: 'Industry', render: (row) => <Badge variant="gray">{row.industry || '—'}</Badge> },
    { key: 'phone', header: 'Phone', render: (row) => <span className="text-sm text-secondary">{row.phone || '—'}</span> },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(row)}><Edit2 className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setItemToDelete({ type: 'accounts', id: row.id, name: row.name })}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
        </div>
      )
    }
  ];

  const contactColumns: Column<Contact>[] = [
    {
      key: 'firstName',
      header: 'Contact',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div>
            <p className="font-medium text-primary">{row.firstName} {row.lastName}</p>
            <p className="text-[10px] text-muted">{row.jobTitle || 'No title'}</p>
          </div>
        </div>
      )
    },
    { key: 'email', header: 'Email', render: (row) => <span className="text-sm text-secondary">{row.email || '—'}</span> },
    { key: 'phone', header: 'Phone', render: (row) => <span className="text-sm text-secondary">{row.phone || '—'}</span> },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(row)}><Edit2 className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setItemToDelete({ type: 'contacts', id: row.id, name: `${row.firstName} ${row.lastName}` })}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
        </div>
      )
    }
  ];

  const leadColumns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Lead',
      render: (row) => (
        <div>
          <p className="font-medium text-primary">{row.name}</p>
          {row.company && <p className="text-[10px] text-muted">{row.company}</p>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const badgeMap: any = { 'new': 'purple', 'contacted': 'yellow', 'qualified': 'cyan', 'converted': 'green', 'lost': 'red' };
        return <Badge variant={badgeMap[row.status] || 'gray'} dot>{LEAD_STATUS_LABELS[row.status]}</Badge>
      }
    },
    { key: 'source', header: 'Source', render: (row) => <span className="text-sm capitalize text-secondary">{row.source || '—'}</span> },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(row)}><Edit2 className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setItemToDelete({ type: 'leads', id: row.id, name: row.name })}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
        </div>
      )
    }
  ];

  const currentColumns = activeTab === 'accounts' ? accountColumns : activeTab === 'contacts' ? contactColumns : leadColumns;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Relationships"
        subtitle="Manage your leads, contacts and organizations in one place"
        actions={
          <Button 
            leftIcon={<Plus className="w-4 h-4" />} 
            onClick={() => { resetForms(); setIsNewModalOpen(true); }}
            id="global-create-btn"
          >
            New {activeTab.slice(0, -1)}
          </Button>
        }
      />

      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden animate-fade-in">
        {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
          <StatMini label="Accounts" value={accounts.length} icon={<Building2 className="w-4 h-4" />} color="purple" active={activeTab === 'accounts'} onClick={() => handleTabChange('accounts')} />
          <StatMini label="Contacts" value={contacts.length} icon={<Users className="w-4 h-4" />} color="cyan" active={activeTab === 'contacts'} onClick={() => handleTabChange('contacts')} />
          <StatMini label="Leads" value={leads.length} icon={<UserCheck className="w-4 h-4" />} color="orange" active={activeTab === 'leads'} onClick={() => handleTabChange('leads')} />
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} placeholder={`Search ${activeTab}...`} />
          </div>
          <div className="glass-card p-1 flex gap-1 rounded-xl">
             <TabButton active={activeTab === 'accounts'} onClick={() => handleTabChange('accounts')}>Accounts</TabButton>
             <TabButton active={activeTab === 'contacts'} onClick={() => handleTabChange('contacts')}>Contacts</TabButton>
             <TabButton active={activeTab === 'leads'} onClick={() => handleTabChange('leads')}>Leads</TabButton>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col border-glass shadow-premium">
          <DataTable
            columns={currentColumns as any}
            data={filteredData as any}
            loading={isLoading}
            emptyMessage={`No ${activeTab} found matching your search.`}
            keyExtractor={(row: any) => row.id}
          />
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title={`New ${activeTab.slice(0, -1)}`}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>Cancel</Button>
            <Button 
              id="create-submit"
              onClick={
                activeTab === 'accounts' ? accountForm.handleSubmit(handleCreate) :
                activeTab === 'contacts' ? contactForm.handleSubmit(handleCreate) :
                leadForm.handleSubmit(handleCreate)
              }
            >
              Create {activeTab.slice(0, -1)}
            </Button>
          </div>
        }
      >
        {activeTab === 'accounts' && <AccountForm form={accountForm} />}
        {activeTab === 'contacts' && <ContactForm form={contactForm} accounts={accounts} />}
        {activeTab === 'leads' && <LeadFormComp form={leadForm} />}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Edit ${editingItem?.type.slice(0, -1)}`}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button 
              id="update-submit"
              onClick={
                editingItem?.type === 'accounts' ? accountForm.handleSubmit(handleUpdate) :
                editingItem?.type === 'contacts' ? contactForm.handleSubmit(handleUpdate) :
                leadForm.handleSubmit(handleUpdate)
              }
            >
              Save Changes
            </Button>
          </div>
        }
      >
        {editingItem?.type === 'accounts' && <AccountForm form={accountForm} isEdit />}
        {editingItem?.type === 'contacts' && <ContactForm form={contactForm} accounts={accounts} isEdit />}
        {editingItem?.type === 'leads' && <LeadFormComp form={leadForm} isEdit />}
      </Modal>

      {/* DELETE CONFIRM */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Confirm Delete"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="ghost" onClick={() => setItemToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
          </div>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function StatMini({ label, value, icon, color, active, onClick }: { label: string, value: number, icon: any, color: string, active: boolean, onClick: () => void }) {
  const colorMap: any = {
    purple: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };
  
  return (
    <button 
      onClick={onClick}
      className={cn(
        "glass-card p-4 flex items-center justify-between border transition-all duration-300 group hover:scale-[1.02]",
        active ? "border-violet-500/40 ring-1 ring-violet-500/20 shadow-lg" : "border-glass hover:border-white/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg flex items-center justify-center border", colorMap[color])}>
          {icon}
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold">{label}</p>
          <p className="text-xl font-display font-bold text-primary">{value}</p>
        </div>
      </div>
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
        active ? "bg-white/10 text-invert shadow-sm" : "text-muted hover:text-secondary"
      )}
    >
      {children}
    </button>
  );
}

function AccountForm({ form, isEdit }: { form: any, isEdit?: boolean }) {
  const { register, formState: { errors } } = form;
  return (
    <div className="space-y-4">
      <Input label="Account Name *" placeholder="Acme Corp" error={errors.name?.message} id="acc-name" {...register('name')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Industry" placeholder="Technology" id="acc-industry" {...register('industry')} />
        <Input label="Website" placeholder="https://acme.com" id="acc-website" {...register('website')} />
      </div>
      <Input label="Phone" placeholder="+1 (555) 000-0000" id="acc-phone" {...register('phone')} />
    </div>
  );
}

function ContactForm({ form, accounts, isEdit }: { form: any, accounts: Account[], isEdit?: boolean }) {
  const { register, formState: { errors } } = form;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name *" placeholder="Jane" error={errors.firstName?.message} id="con-fname" {...register('firstName')} />
        <Input label="Last Name *" placeholder="Doe" error={errors.lastName?.message} id="con-lname" {...register('lastName')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" placeholder="jane@doe.com" id="con-email" {...register('email')} />
        <Input label="Phone" placeholder="+1 (555) 000-0000" id="con-phone" {...register('phone')} />
      </div>
      <Input label="Job Title" placeholder="VP of Sales" id="con-title" {...register('jobTitle')} />
      <Select 
        label="Account" 
        options={[{ value: '', label: 'No Account' }, ...accounts.map(a => ({ value: a.id, label: a.name }))]} 
        id="con-acc" 
        {...register('accountId')} 
      />
    </div>
  );
}

function LeadFormComp({ form, isEdit }: { form: any, isEdit?: boolean }) {
  const { register, formState: { errors } } = form;
  const STATUS_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];
  const SOURCE_OPTIONS = [
    { value: 'web', label: 'Web' },
    { value: 'referral', label: 'Referral' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media' },
    { value: 'event', label: 'Event' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-4">
      <Input label="Lead Name *" placeholder="Potential Client" error={errors.name?.message} id="lead-name" {...register('name')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" placeholder="prospect@company.com" id="lead-email" {...register('email')} />
        <Input label="Company" placeholder="Global Tech" id="lead-company" {...register('company')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Source" options={SOURCE_OPTIONS} id="lead-source" {...register('source')} />
        <Select label="Status *" options={STATUS_OPTIONS} id="lead-status" {...register('status')} />
      </div>
    </div>
  );
}
