import { useState } from 'react';
import { Plus, Package, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/organisms/Header';
import { Button } from '@/atoms/Button';
import { Input } from '@/atoms/Input';
import { Modal } from '@/molecules/Modal';
import { toast } from '@/molecules/Toast';
import { PageSpinner } from '@/atoms/Spinner';
import { useProducts, useCreateProduct } from '@/hooks/useProducts';
import { formatCurrency } from '@/utils';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  base_price: z.coerce.number().min(0, 'Price must be non-negative'),
});

type ProductForm = z.infer<typeof productSchema>;

export function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({ resolver: zodResolver(productSchema), defaultValues: { base_price: 0 } });

  const onSubmit = async (data: ProductForm) => {
    try {
      await createProduct.mutateAsync({
        name: data.name,
        sku: data.sku || undefined,
        base_price: data.base_price,
      });
      toast.success('Product created');
      setModalOpen(false);
      reset({ base_price: 0 });
    } catch {
      toast.error('Failed to create product');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Products"
        subtitle={`${(products ?? []).length} total`}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)} id="create-product-btn">
            New Product
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {isLoading ? (
          <PageSpinner />
        ) : products && products.length > 0 ? (
          <div className="grid-auto-fill">
            {products.map((p) => (
              <div key={p.id} className="glass-card p-5 flex flex-col gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.58 0.25 280 / 0.20), oklch(0.68 0.22 200 / 0.15))',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <Package className="w-5 h-5" style={{ color: 'oklch(0.75 0.18 280)' }} />
                </div>

                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {p.name}
                  </h3>
                  {p.sku && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Tag className="w-3 h-3" />
                      <span>{p.sku}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <p className="text-xl font-bold" style={{ color: 'oklch(0.75 0.20 280)', fontFamily: 'var(--font-display)' }}>
                    {formatCurrency(p.base_price)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Base price</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
            No products yet — add your first product to start building quotes
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset({ base_price: 0 }); }}
        title="New Product"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setModalOpen(false); reset({ base_price: 0 }); }}>Cancel</Button>
            <Button form="product-form" type="submit" loading={createProduct.isPending} id="product-form-submit">
              Create Product
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Product Name *" placeholder="Enterprise License" error={errors.name?.message} id="product-name" {...register('name')} />
          <Input label="SKU" placeholder="ENT-001" id="product-sku" {...register('sku')} />
          <Input
            type="number"
            label="Base Price ($) *"
            placeholder="999"
            error={errors.base_price?.message}
            id="product-price"
            {...register('base_price')}
          />
        </form>
      </Modal>
    </div>
  );
}
