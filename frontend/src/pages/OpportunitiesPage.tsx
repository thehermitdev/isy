import { useState } from 'react';
import { Plus, LayoutList, LayoutGrid, Edit2, Trash2 } from 'lucide-react';
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
  rectIntersection,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/organisms/Header';
import { Button } from '@/atoms/Button';
import { Input, Select } from '@/atoms/Input';
import { Modal } from '@/molecules/Modal';
import { DataTable, type Column } from '@/molecules/DataTable';
import { toast } from '@/molecules/Toast';
import { PageSpinner } from '@/atoms/Spinner';
import {
  useOpportunities,
  usePipeline,
  usePipelineStages,
  useCreateOpportunity,
  useUpdateOpportunity,
  useDeleteOpportunity,
} from '@/hooks/useOpportunities';
import { useAccounts } from '@/hooks/useAccounts';
import { formatCurrency, formatDate } from '@/utils';
import type { Opportunity, PipelineStage } from '@/types';

const opportunitySchema = z.object({
  name: z.string().optional(),
  account_id: z.string().optional(),
  stage_id: z.string().min(1, 'Stage is required'),
  value: z.coerce.number().min(0, 'Must be a positive number'),
  probability: z.coerce.number().min(0).max(100).optional(),
  expected_close: z.string().optional(),
});

type OpportunityForm = z.infer<typeof opportunitySchema>;

// ---- Kanban Card ----
interface KanbanCardProps {
  opportunity: Opportunity;
  isDragging?: boolean;
  onEdit?: (opp: Opportunity) => void;
}

function KanbanCard({ opportunity, isDragging, onEdit }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: opportunity.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card group relative ${isDragging ? 'dragging' : ''}`}
      onClick={(e) => {
        // Only trigger edit if not dragging. For simplicity, we trigger edit on double click or button.
        // Let's rely on an edit button that appears on hover
      }}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          {opportunity.name || `Opp. #${opportunity.id.slice(0, 8)}`}
        </p>
        {!isDragging && onEdit && (
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
            onClick={(e) => { e.stopPropagation(); onEdit(opportunity); }}
          >
            <Edit2 className="w-3 h-3 text-muted" />
          </button>
        )}
      </div>
      {opportunity.value !== undefined && (
        <p className="text-base font-bold" style={{ color: 'oklch(0.75 0.20 280)' }}>
          {formatCurrency(opportunity.value)}
        </p>
      )}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{opportunity.probability ?? 0}% prob.</span>
        {opportunity.expectedClose && (
          <span>{formatDate(opportunity.expectedClose, 'MMM d')}</span>
        )}
      </div>
    </div>
  );
}

// ---- Pipeline Column ----
interface PipelineColumnProps {
  stage: PipelineStage;
  opportunities: Opportunity[];
  onEditOpp?: (opp: Opportunity) => void;
}

function PipelineColumn({ stage, opportunities = [], onEditOpp }: PipelineColumnProps) {
  const { setNodeRef } = useDroppable({ id: stage.id });
  const totalValue = opportunities.reduce((s, o) => s + (o?.value ?? 0), 0);

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col shrink-0 rounded-xl"
      style={{
        width: '280px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Column header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-glass)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: `oklch(0.68 0.22 ${((stage?.sequence ?? 0) * 40 + 160) % 360})` }}
            />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {stage?.name || 'Unknown Stage'}
            </h3>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--bg-glass-hover)', color: 'var(--text-muted)' }}
            >
              {opportunities.length}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatCurrency(totalValue)} • {stage?.probability ?? 0}% probability
          </p>
        </div>
      </div>

      {/* Cards */}
      <SortableContext items={opportunities.map((o) => o.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-3 flex-1 min-h-[120px]">
          {opportunities.map((op) => (
            op ? <KanbanCard key={op.id} opportunity={op} onEdit={onEditOpp} /> : null
          ))}
          {opportunities.length === 0 && (
            <div
              className="flex items-center justify-center h-16 rounded-xl border-2 border-dashed text-xs"
              style={{ borderColor: 'var(--border-glass)', color: 'var(--text-muted)' }}
            >
              Drop here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ---- Opportunities Page ----
export function OpportunitiesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: opportunities, isLoading: isLoadingList } = useOpportunities();
  const { data: pipeline, isLoading: isLoadingBoard } = usePipeline();
  const { data: stages } = usePipelineStages();
  const { data: accounts } = useAccounts();
  const createOpportunity = useCreateOpportunity();
  const updateOpportunity = useUpdateOpportunity();
  const deleteOpportunity = useDeleteOpportunity();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpportunityForm>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: { value: 0, probability: 20 },
  });

  const stageOptions = (stages ?? []).map((s) => ({ value: s.id, label: s.name }));
  const accountOptions = [
    { value: '', label: 'No Account' },
    ...(accounts ?? []).map((a) => ({ value: a.id, label: a.name })),
  ];

  const handleEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    reset({
      name: opp.name,
      account_id: opp.accountId || '',
      stage_id: opp.stageId || '',
      value: opp.value,
      probability: opp.probability,
      expected_close: opp.expectedClose ? new Date(opp.expectedClose).toISOString().split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await deleteOpportunity.mutateAsync(id);
      toast.success('Opportunity deleted');
      setModalOpen(false);
    } catch {
      toast.error('Failed to delete opportunity');
    }
  };

  const onSubmit = async (data: OpportunityForm) => {
    try {
      const payload = {
        name: data.name || undefined,
        accountId: data.account_id || undefined,
        stageId: data.stage_id,
        value: data.value,
        probability: data.probability,
        expectedClose: data.expected_close || undefined,
      };

      if (editingOpp) {
        await updateOpportunity.mutateAsync({ id: editingOpp.id, data: payload });
        toast.success('Opportunity updated');
      } else {
        await createOpportunity.mutateAsync(payload);
        toast.success('Opportunity created');
      }
      setModalOpen(false);
      reset({ value: 0, probability: 20 });
      setEditingOpp(null);
    } catch {
      toast.error(editingOpp ? 'Failed to update opportunity' : 'Failed to create opportunity');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !pipeline) return;

    // Find which stage the card was dropped on
    let targetStageId: string | null = null;
    
    if (over.id in pipeline) {
      targetStageId = String(over.id);
    } else {
      // If dropped over a card, find the column containing that card
      for (const [stageId, col] of Object.entries(pipeline)) {
        if ((col.opportunities || []).find((o) => o?.id === over.id)) {
          targetStageId = stageId;
          break;
        }
      }
    }

    if (!targetStageId || active.id === over.id) return;

    try {
      await updateOpportunity.mutateAsync({
        id: String(active.id),
        data: { stageId: targetStageId },
      });
    } catch {
      toast.error('Failed to move opportunity');
    }

    setActiveId(null);
  };


  // List View Columns
  const columns: Column<Opportunity>[] = [
    {
      key: 'name',
      header: 'Opportunity',
      sortable: true,
      render: (row) => (
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {row.name || `Opp. #${row.id.slice(0, 8)}`}
        </p>
      ),
    },
    {
      key: 'stageId',
      header: 'Stage',
      render: (row) => {
        const stage = stages?.find(s => s.id === row.stageId);
        return <span style={{ color: 'var(--text-secondary)' }}>{stage?.name || 'Unknown'}</span>;
      }
    },
    {
      key: 'value',
      header: 'Value',
      sortable: true,
      render: (row) => (
        <span className="font-semibold" style={{ color: 'oklch(0.75 0.20 280)' }}>
          {formatCurrency(row.value)}
        </span>
      ),
    },
    {
      key: 'probability',
      header: 'Probability',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden max-w-[80px]"
            style={{ background: 'var(--border-glass)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${row.probability ?? 0}%`,
                background: 'linear-gradient(90deg, oklch(0.58 0.25 280), oklch(0.68 0.22 200))',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {row.probability ?? 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'expectedClose',
      header: 'Close Date',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {formatDate(row.expectedClose)}
        </span>
      ),
    },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const allOpportunities = pipeline ? Object.values(pipeline).flatMap((col) => col.opportunities || []) : [];
  const activeOp = allOpportunities.find((o) => o?.id === activeId);
  const orderedColumns = pipeline
    ? Object.entries(pipeline).sort(([, a], [, b]) => (a.stage?.sequence ?? 0) - (b.stage?.sequence ?? 0))
    : [];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Opportunities"
        subtitle={`${(opportunities ?? []).length} total`}
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center p-1 rounded-lg" style={{ background: 'var(--bg-glass-hover)' }}>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white/10 text-invert shadow-sm' : 'text-gray-400 hover:text-invert'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'board' ? 'bg-white/10 text-invert shadow-sm' : 'text-gray-400 hover:text-invert'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Board
              </button>
            </div>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingOpp(null);
                reset({ value: 0, probability: 20 });
                setModalOpen(true);
              }}
            >
              New Opportunity
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-hidden p-6 animate-fade-in">
        {viewMode === 'list' && (
          <div className="glass-card overflow-hidden h-full overflow-y-auto">
            <DataTable<Opportunity>
              columns={columns}
              data={opportunities ?? []}
              loading={isLoadingList}
              emptyMessage="No opportunities found."
              keyExtractor={(row) => row.id}
            />
          </div>
        )}

        {viewMode === 'board' && (
          <div className="h-full">
            {isLoadingBoard ? (
              <PageSpinner />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={(e) => setActiveId(String(e.active.id))}
                onDragEnd={handleDragEnd}
              >
                <div className="flex gap-4 h-full overflow-x-auto pb-4">
                  {orderedColumns.map(([stageId, col]) => (
                    <PipelineColumn
                      key={stageId}
                      stage={col.stage}
                      opportunities={col.opportunities || []}
                      onEditOpp={handleEdit}
                    />
                  ))}
                  {orderedColumns.length === 0 && (
                    <div className="flex items-center justify-center w-full text-sm" style={{ color: 'var(--text-muted)' }}>
                      No pipeline stages configured
                    </div>
                  )}
                </div>

                <DragOverlay>
                  {activeOp ? <KanbanCard opportunity={activeOp} isDragging /> : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOpp ? 'Edit Opportunity' : 'New Opportunity'}
        footer={
          <>
            {editingOpp && (
              <Button formNoValidate variant="ghost" className="text-red-500 mr-auto hover:bg-red-500/10" onClick={() => handleDelete(editingOpp.id)}>
                Delete
              </Button>
            )}
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button form="opp-form" type="submit" loading={createOpportunity.isPending || updateOpportunity.isPending}>
              {editingOpp ? 'Save Changes' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="opp-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" placeholder="Q3 Expansion Deal" {...register('name')} />
          <Select label="Stage *" options={stageOptions} error={errors.stage_id?.message} {...register('stage_id')} />
          <Select label="Account" options={accountOptions} {...register('account_id')} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" label="Value ($) *" error={errors.value?.message} {...register('value')} />
            <Input type="number" label="Probability (%)" {...register('probability')} />
          </div>
          <Input type="date" label="Expected Close" {...register('expected_close')} />
        </form>
      </Modal>
    </div>
  );
}
