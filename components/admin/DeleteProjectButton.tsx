'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle, Trash2, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

type DeleteProjectButtonProps = {
  id: string
  name: string
  /** Lets the card supply the icon-button styling while the dialog stays shared. */
  triggerClassName?: string
}

export function DeleteProjectButton({
  id,
  name,
  triggerClassName,
}: DeleteProjectButtonProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)

    try {
      const res = await fetch(`/api/proyectos/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'No se pudo eliminar el proyecto.')
      }

      setOpen(false)
      toast({
        title: 'Proyecto eliminado',
        description: `"${name}" se eliminó del panel.`,
        variant: 'success',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        description:
          error instanceof Error ? error.message : 'Intentá de nuevo.',
        variant: 'error',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Eliminar"
        aria-label={`Eliminar ${name}`}
        className={triggerClassName}
      >
        <Trash2 className="size-4" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!deleting) setOpen(next)
        }}
        title="Eliminar proyecto"
        className="max-w-md"
      >
        <div className="space-y-4 px-5 py-5">
          <div className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive">
              <TriangleAlert className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm text-foreground">
                Vas a eliminar{' '}
                <span className="font-semibold">{name}</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                Se borra de la base de datos y desaparece del sitio. Esta acción
                no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Eliminando…
              </>
            ) : (
              <>
                <Trash2 />
                Eliminar
              </>
            )}
          </Button>
        </footer>
      </Dialog>
    </>
  )
}
