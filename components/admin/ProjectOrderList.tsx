'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, LoaderCircle } from 'lucide-react'

import { useToast } from '@/components/ui/toast'
import type { ProjectCardData } from '@/components/admin/ProjectCard'
import { cn } from '@/lib/utils'

function SortableProjectRow({
  project,
  disabled,
}: {
  project: ProjectCardData
  disabled: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id, disabled })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5',
        isDragging && 'z-10 border-ring shadow-lg',
      )}
    >
      <button
        type="button"
        aria-label={`Reordenar ${project.name}. Usá las flechas arriba y abajo para moverlo.`}
        className="cursor-grab touch-none rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden />
      </button>

      <img
        src={project.cover}
        alt=""
        className="size-11 shrink-0 rounded-md border border-border object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {project.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {project.category}
        </p>
      </div>

      {!project.published && (
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          Borrador
        </span>
      )}
    </li>
  )
}

/**
 * Drag & drop list to control the order projects appear on the public site.
 *
 * The reorder is optimistic: rows move instantly and the new order is saved
 * with PATCH /api/proyectos/orden afterwards. If the request fails the local
 * order is reverted to the last known good one.
 */
export function ProjectOrderList({ projects }: { projects: ProjectCardData[] }) {
  const { toast } = useToast()
  const [items, setItems] = useState(projects)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const previous = items
    const next = arrayMove(
      items,
      items.findIndex((item) => item.id === active.id),
      items.findIndex((item) => item.id === over.id),
    )

    setItems(next)
    setSaving(true)

    try {
      const res = await fetch('/api/proyectos/orden', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map((item: ProjectCardData) => item.id) }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error)
      }

      toast({
        title: 'Orden guardado',
        description: 'Los proyectos ya se muestran en el nuevo orden en la web.',
        variant: 'success',
      })
    } catch {
      setItems(previous)
      toast({
        title: 'No se pudo guardar el orden',
        description: 'Se restauró el orden anterior. Intentá de nuevo.',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        Arrastrá los proyectos para definir en qué orden se ven en la web.
        {saving && <LoaderCircle className="size-3 animate-spin" aria-hidden />}
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item: ProjectCardData) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {items.map((project: ProjectCardData) => (
              <SortableProjectRow
                key={project.id}
                project={project}
                disabled={saving}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
