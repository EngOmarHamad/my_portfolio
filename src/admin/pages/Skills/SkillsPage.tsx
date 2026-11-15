import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { PlusOutlined, EditOutlined, FolderAddOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { supabase } from '@/shared/lib/supabase'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { SearchInput } from '@/admin/components/ui/SearchInput'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { Skill, SkillCategory } from '@/admin/types'

const skillsService = createBaseService<Skill>('skills')
const categoriesService = createBaseService<SkillCategory>('skill_categories')

interface SkillFormValues {
  title: string
  icon: string
  color: string
  percentage: number
  level: string
  category_id: string
  is_featured: boolean
}

interface CategoryFormValues {
  name: string
  slug: string
  description: string
  display_order: number
}

export function SkillsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [editing, setEditing] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null)
  const [skillForm] = Form.useForm<SkillFormValues>()
  const [categoryForm] = Form.useForm<CategoryFormValues>()
  const queryClient = useQueryClient()

  const { data: categoriesData, isLoading: catsLoading } = useQuery({
    queryKey: ['skill_categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skill_categories').select('*').order('display_order')
      if (error) throw error
      return data as SkillCategory[]
    },
  })

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*, skill_categories!left(name, slug)')
        .order('display_order')
      if (error) throw error
      return data as (Skill & { skill_categories?: { name: string; slug: string } })[]
    },
  })

  const categories = categoriesData ?? []
  const allSkills = (skillsData ?? []) as (Skill & { skill_categories?: { name: string; slug: string } })[]

  const filteredSkills = useMemo(() => {
    let list = allSkills
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.skill_categories?.name.toLowerCase().includes(q),
      )
    }
    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category_id === activeCategory)
    }
    return list
  }, [allSkills, search, activeCategory])

  const grouped = useMemo(() => {
    const map = new Map<string, { category: SkillCategory | null; skills: typeof filteredSkills }>()
    if (activeCategory === 'all') {
      for (const cat of categories) {
        map.set(cat.id, { category: cat, skills: [] })
      }
      map.set('uncategorized', { category: null, skills: [] })
    }
    for (const skill of filteredSkills) {
      const key = skill.category_id || 'uncategorized'
      if (!map.has(key)) {
        const cat = categories.find((c) => c.id === key) ?? null
        map.set(key, { category: cat, skills: [] })
      }
      map.get(key)!.skills.push(skill)
    }
    return Array.from(map.values()).filter((g) => g.skills.length > 0)
  }, [filteredSkills, categories, activeCategory])

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Skill>) =>
      editing ? skillsService.update(editing.id, values) : skillsService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success(editing ? 'Skill updated' : 'Skill created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const categorySaveMutation = useMutation({
    mutationFn: (values: Partial<SkillCategory>) =>
      editingCategory ? categoriesService.update(editingCategory.id, values) : categoriesService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] })
      toast.success(editingCategory ? 'Category updated' : 'Category created')
      setShowCategoryForm(false)
      setEditingCategory(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save category'),
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] })
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Category deleted')
    },
    onError: () => toast.error('Cannot delete category with skills'),
  })

  const openSkillForm = (skill: Skill | null) => {
    setEditing(skill)
    setShowForm(true)
    skillForm.setFieldsValue({
      title: skill?.title ?? '',
      icon: skill?.icon ?? '',
      color: skill?.color || '#19354B',
      percentage: skill?.percentage ?? 75,
      level: (skill as unknown as { level?: string })?.level || 'Advanced',
      category_id: skill?.category_id || '',
      is_featured: skill?.is_featured ?? false,
    })
  }

  const openCategoryForm = (category: SkillCategory | null) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
    categoryForm.setFieldsValue({
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      display_order: category?.display_order ?? 0,
    })
  }

  if (catsLoading || skillsLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Single source for portfolio, tech stack, and CV. Categories are free — add any type you need."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Skills' }]}
        actions={
          <Space>
            <Button icon={<FolderAddOutlined />} onClick={() => openCategoryForm(null)}>
              Add Category
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openSkillForm(null)}>
              Add Skill
            </Button>
          </Space>
        }
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Segmented
          value={activeCategory}
          onChange={(value) => setActiveCategory(String(value))}
          options={[
            { label: `All (${allSkills.length})`, value: 'all' },
            ...categories.map((cat) => ({
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {cat.name}
                  <Tag
                    style={{ marginInlineEnd: 0, lineHeight: '16px' }}
                    color={activeCategory === cat.id ? 'default' : undefined}
                  >
                    {allSkills.filter((s) => s.category_id === cat.id).length}
                  </Tag>
                </span>
              ),
              value: cat.id,
            })),
          ]}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Search skills..." width={240} />
      </div>

      {grouped.length === 0 ? (
        <Card>
          <Empty description="No skills found. Add a skill or change filter." />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {grouped.map(({ category, skills }) => (
            <div key={category?.id ?? 'uncategorized'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {category ? category.name : 'Uncategorized'}
                </Typography.Title>
                <Tag>{skills.length}</Tag>
                {category?.description && (
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    — {category.description}
                  </Typography.Text>
                )}
              </div>
              <Row gutter={[12, 12]}>
                {skills.map((skill) => (
                  <Col key={skill.id} xs={24} sm={12} lg={8} xl={6}>
                    <Card
                      size="small"
                      styles={{ body: { padding: 16 } }}
                      title={
                        <Space size={8}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              background: 'var(--color-primary)',
                              color: '#fff',
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {(skill.icon || skill.title.charAt(0)).slice(0, 2)}
                          </span>
                          <span>
                            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 120 }}>
                              {skill.title}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                              {(skill as unknown as { level?: string }).level || `${skill.percentage}%`}
                              {skill.is_featured && <Tag color="warning" style={{ marginInlineStart: 6, lineHeight: '14px' }}>Featured</Tag>}
                            </Typography.Text>
                          </span>
                        </Space>
                      }
                      extra={
                        <Space size={0}>
                          <Tooltip title="Edit">
                            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openSkillForm(skill)} />
                          </Tooltip>
                          <DeleteButton onDelete={() => deleteMutation.mutateAsync(skill.id)} />
                        </Space>
                      }
                    >
                      {skill.percentage > 0 && (
                        <Progress
                          percent={Math.min(100, Math.max(0, skill.percentage))}
                          showInfo={false}
                          strokeColor="var(--color-secondary)"
                          trailColor="var(--color-border)"
                          size="small"
                        />
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}

      {/* Skill form */}
      <Modal
        open={showForm}
        onCancel={() => {
          setShowForm(false)
          setEditing(null)
        }}
        footer={null}
        title={editing ? 'Edit Skill' : 'Add Skill'}
        width={520}
        destroyOnHidden forceRender
      >
        <Form<SkillFormValues>
          form={skillForm}
          layout="vertical"
          onFinish={(values) => {
            saveMutation.mutate({
              ...values,
              category_id: (values.category_id || null) as unknown as string,
              is_published: true,
            })
          }}
          style={{ marginTop: 16 }}
        >
          <Form.Item name="title" label="Skill Name" rules={[{ required: true, message: 'Skill name is required' }]}>
            <Input placeholder="e.g. React" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="icon" label="Icon">
              <Input placeholder="code, server..." />
            </Form.Item>
            <Form.Item name="color" label="Color">
              <Input type="color" style={{ padding: 4 }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="category_id" label="Category">
              <Select
                options={[{ value: '', label: 'Uncategorized' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
              />
            </Form.Item>
            <Form.Item name="level" label="Level">
              <Select
                options={[
                  { value: 'Expert', label: 'Expert' },
                  { value: 'Advanced', label: 'Advanced' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Beginner', label: 'Beginner' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="percentage" label="Percentage">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="is_featured" valuePropName="checked" label="Featured">
              <Switch />
            </Form.Item>
          </div>

          <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
            This skill will appear in portfolio, tech stack, and CV (grouped by category).
          </Typography.Paragraph>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button
              onClick={() => {
                setShowForm(false)
                setEditing(null)
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Category form */}
      <Modal
        open={showCategoryForm}
        onCancel={() => {
          setShowCategoryForm(false)
          setEditingCategory(null)
        }}
        footer={null}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        width={440}
        destroyOnHidden forceRender
      >
        <Form<CategoryFormValues>
          form={categoryForm}
          layout="vertical"
          onFinish={(values) => {
            categorySaveMutation.mutate({
              ...values,
              slug: values.slug || values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            })
          }}
          style={{ marginTop: 16 }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="e.g. AI & ML" />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input placeholder="auto-generated if empty" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="display_order" label="Display Order">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button
              onClick={() => {
                setShowCategoryForm(false)
                setEditingCategory(null)
              }}
            >
              Cancel
            </Button>
            {editingCategory && (
              <DeleteButton
                onDelete={() => deleteCategoryMutation.mutateAsync(editingCategory.id)}
                tooltip="Delete category"
              />
            )}
            <Button type="primary" htmlType="submit" loading={categorySaveMutation.isPending}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
