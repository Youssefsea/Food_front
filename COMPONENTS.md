# COMPONENTS

## UI Components (`/components/ui`)

- **Button**
  ```tsx
  <Button variant="primary" size="lg" fullWidth>حفظ</Button>
  ```

- **Input**
  ```tsx
  <Input label="البريد الإلكتروني" type="email" value={email} onChange={onChange} />
  ```

- **Badge**
  ```tsx
  <Badge variant="success" dot>مفتوح</Badge>
  ```

- **Card**
  ```tsx
  <Card variant="elevated" padding="lg">...</Card>
  ```

- **Modal**
  ```tsx
  <Modal isOpen={open} onClose={() => setOpen(false)} title="تفاصيل">...</Modal>
  ```

- **EmptyState**
  ```tsx
  <EmptyState icon="🔍" title="لا توجد نتائج" actionLabel="إعادة المحاولة" onAction={retry} />
  ```

- **Skeleton / RestaurantCardSkeleton / DishCardSkeleton**
  ```tsx
  <Skeleton className="h-6 w-32" />
  <RestaurantCardSkeleton />
  <DishCardSkeleton />
  ```

- **Toast**
  ```tsx
  <Toast />
  ```

## Layout Components (`/components/layout`)

- **AppLayout**
  ```tsx
  <AppLayout role="customer">{children}</AppLayout>
  ```

- **BackButton**
  ```tsx
  <BackButton label="رجوع" fallbackHref="/explore" />
  ```

- **BottomNav**
  ```tsx
  <BottomNav role="customer" />
  ```

- **Breadcrumb**
  ```tsx
  <Breadcrumb crumbs={[{ label: 'الرئيسية', href: '/explore' }, { label: 'السلة' }]} />
  ```

- **Sidebar**
  ```tsx
  <Sidebar role="customer" />
  ```

- **VendorSidebar**
  ```tsx
  <VendorSidebar restaurantName="مطعم الشرق" />
  ```
