'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/field'
import { useToast } from '@/components/ui/toast'
import { ImageDropzone } from '@/components/admin/ImageDropzone'
import { cn } from '@/lib/utils'

export type ProjectFormValues = {
  id: string
  name: string
  category: string
  description: string
  cover: string
  published: boolean
  images: string[]
}

type ProjectFormProps = {
  mode: 'create' | 'edit'
  project?: ProjectFormValues
  onCancel: () => void
}

type FormErrors = Partial<Record<'name' | 'category' | 'description' | 'cover', string>>

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 border-t border-border px-5 py-5 first:border-t-0">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export function ProjectForm({ mode, project, onCancel }: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(project?.name ?? '')
  const [category, setCategory] = useState(project?.category ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [cover, setCover] = useState(project?.cover ?? '')
  const [images, setImages] = useState<string[]>(project?.images ?? [])
  const [published, setPublished] = useState(project?.published ?? true)

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  function validate(): FormErrors {
    const next: FormErrors = {}

    if (!name.trim()) next.name = 'El título es requerido'
    if (!category.trim()) next.category = 'La categoría es requerida'
    if (!description.trim()) next.description = 'La descripción es requerida'
    if (!cover) next.cover = 'Subí una imagen de portada'

    return next
  }

  /**
   * Takes the user to the first problem instead of making them scan the form
   * for what the toast is talking about. Reading order is the layout order.
   */
  function revealFirstError(clientErrors: FormErrors) {
    const order: (keyof FormErrors)[] = [
      'name',
      'category',
      'description',
      'cover',
    ]
    const first = order.find((key) => clientErrors[key])

    if (!first) return

    if (first === 'cover') {
      // The drop target is a div, so it can't take focus. Scrolling it into
      // view plus the red border is enough to point at it.
      document
        .getElementById('project-cover')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const ref = {
      name: nameRef,
      category: categoryRef,
      description: descriptionRef,
    }[first]

    ref.current?.focus()
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const clientErrors = validate()
    setErrors(clientErrors)

    if (Object.keys(clientErrors).length > 0) {
      revealFirstError(clientErrors)
      toast({
        title: 'Revisá los campos marcados',
        description: 'Falta completar algunos datos obligatorios.',
        variant: 'error',
      })
      return
    }

    setSubmitting(true)

    const body = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      cover,
      images,
      published,
    }

    const url =
      mode === 'create' ? '/api/proyectos' : `/api/proyectos/${project!.id}`

    try {
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrors((prev) => ({ ...prev, ...(data.fields ?? {}) }))
        toast({
          title: mode === 'create' ? 'No se pudo crear' : 'No se pudo guardar',
          description: data.error || 'Revisá los datos e intentá de nuevo.',
          variant: 'error',
        })
        setSubmitting(false)
        return
      }

      toast({
        title: mode === 'create' ? 'Proyecto creado' : 'Cambios guardados',
        description:
          mode === 'create'
            ? `"${body.name}" ya está en el panel.`
            : published
              ? 'Los cambios ya están publicados en el sitio.'
              : 'Quedó como borrador, invisible en el sitio público.',
        variant: 'success',
      })

      onCancel()
      router.push('/admin')
      router.refresh()
    } catch {
      toast({
        title: 'Error de conexión',
        description: 'No se pudo contactar al servidor. Intentá de nuevo.',
        variant: 'error',
      })
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section
          title="Información general"
          description="Los datos que se ven en la web y en las tarjetas del sitio."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Título"
              htmlFor="name"
              error={errors.name}
              required
            >
              <Input
                id="name"
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Planta industrial Paraná"
                maxLength={200}
                aria-required="true"
                invalid={Boolean(errors.name)}
                autoFocus
              />
            </Field>

            <Field
              label="Categoría"
              htmlFor="category"
              error={errors.category}
              required
            >
              <Input
                id="category"
                ref={categoryRef}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ingeniería"
                maxLength={100}
                aria-required="true"
                invalid={Boolean(errors.category)}
              />
            </Field>
          </div>

          <Field
            label="Descripción"
            htmlFor="description"
            error={errors.description}
            required
          >
            <Textarea
              id="description"
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Qué se hizo, con qué técnica, en qué plazo."
              aria-required="true"
              invalid={Boolean(errors.description)}
            />
          </Field>
        </Section>

        <Section
          title="Visibilidad"
          description="Los borradores no aparecen en el sitio público."
        >
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full border border-input bg-muted transition-colors duration-200',
                'after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-foreground after:transition-transform after:duration-200',
                'peer-checked:border-primary peer-checked:bg-primary/30',
                'peer-checked:after:translate-x-5 peer-checked:after:bg-primary',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
              )}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                {published ? 'Publicado' : 'Borrador'}
              </span>
              <span className="block text-xs text-muted-foreground">
                {published
                  ? 'Visible en la web.'
                  : 'Solo visible dentro del panel.'}
              </span>
            </span>
          </label>
        </Section>

        <Section
          title="Imágenes"
          description="La portada es la que se usa en las tarjetas. La galería se abre al hacer clic en el proyecto."
        >
          <ImageDropzone
            id="project-cover"
            label="Imagen de portada"
            required
            value={cover ? [cover] : []}
            onChange={(urls) => setCover(urls[0] ?? '')}
            error={errors.cover}
            hint="Obligatoria. Se usa en las tarjetas del sitio."
          />

          <ImageDropzone
            label="Galería"
            multiple
            value={images}
            onChange={setImages}
            hint="La primera imagen es la que se muestra en la galería al abrir el proyecto."
          />
        </Section>
      </div>

      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-background/40 px-5 py-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle className="animate-spin" />
              {mode === 'create' ? 'Creando…' : 'Guardando…'}
            </>
          ) : mode === 'create' ? (
            'Crear proyecto'
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </footer>
    </form>
  )
}

