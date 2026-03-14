import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '../organisms/Header';
import { Button } from '../atoms/Button';
import { Input, Select } from '../atoms/Input';
import { Modal } from '../molecules/Modal';
import { DataTable, type Column } from '../molecules/DataTable';
import { toast } from '../molecules/Toast';
import { useActivities, useCreateActivity, useUses } from '../hooks/useActivities';
import { formatDate } from '../utils';
import type { Activity } from '../types';

const activitySchema = z.object({
  type: z.string().min(1, 'Type is required'),
  subject: z.string().min(1, 'Subject is required'),
  user_id: z.string().optional(),
  activity_date: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

export function ActivitiesPage() {
  const { data: activities, isLoading } = useActivities();
  const { data: users } = useUses();
  const createActivity = useCreateActivity();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: { type: 'Call', subject: '' },
  });

  const userOptions = [
    { value: '', label: 'Unassigned' },
    ...(users ?? []).map((u) => ({ value: u.id, label: u.name })),
  ];

  const typeOptions = [
    { value: 'Call', label: 'Call' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Email', label: 'Email' },
    { value: 'Task', label: 'Task' },
  ];

  const onSubmit = async (data: ActivityForm) => {
    try {
      await createActivity.mutateAsync(data);
      toast.success('Activity created');
      setModalOpen(false);
      reset({ type: 'Call', subject: '' });
    } catch {
      toast.error('Failed to create activity');
    }
  };

  const columns: Column<Activity>[] = [
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => (
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {row.type}
        </span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
    },
    {
      key: 'user_id',
      header: 'Assigned To',
      render: (row) => {
        const user = users?.find(u => u.id === row.user_id);
        return <span style={{ color: 'var(--text-muted)' }}>{user?.name || 'Unassigned'}</span>;
      },
    },
    {
      key: 'activity_date',
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {formatDate(row.activity_date)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Activities"
        subtitle={`${(activities ?? []).length} total`}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            New Activity
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4 animate-fade-in">
        <div className="glass-card overflow-hidden">
          <DataTable<Activity>
            columns={columns}
            data={activities ?? []}
            loading={isLoading}
            emptyMessage="No activities found"
            keyExtractor={(row) => row.id}
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="New Activity"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setModalOpen(false); reset(); }}>Cancel</Button>
            <Button form="activity-form" type="submit" loading={createActivity.isPending}>
              Create
            </Button>
          </>
        }
      >
        <form id="activity-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Type *" options={typeOptions} error={errors.type?.message} {...register('type')} />
          <Input label="Subject *" placeholder="Follow up call" error={errors.subject?.message} {...register('subject')} />
          <Select label="Assigned To" options={userOptions} {...register('user_id')} />
          <Input type="datetime-local" label="Date" {...register('activity_date')} />
        </form>
      </Modal>
    </div>
  );
}
