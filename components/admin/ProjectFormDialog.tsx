'use client'

import { useRouter } from 'next/navigation'

import { ProjectForm, type ProjectFormValues } from '@/components/admin/ProjectForm'
import { Dialog } from '@/components/ui/dialog'

type ProjectFormDialogProps = {
  mode: 'create' | 'edit'
  project?: ProjectFormValues
}

/**
 * The form lives at its own route, so the URL stays shareable and the browser
 * back button closes it. Closing navigates back to the list rather than pushing
 * a new entry.
 */
export function ProjectFormDialog({ mode, project }: ProjectFormDialogProps) {
  const router = useRouter()
  const close = () => router.back()

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) close()
      }}
      title={mode === 'create' ? 'Nuevo proyecto' : 'Editar proyecto'}
      description={
        mode === 'create'
          ? 'Completá los datos y subí las imágenes.'
          : 'Los cambios se reflejan en el sitio al guardar.'
      }
    >
      <ProjectForm mode={mode} project={project} onCancel={close} />
    </Dialog>
  )
}
