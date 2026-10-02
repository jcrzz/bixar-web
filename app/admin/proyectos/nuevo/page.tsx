import { PageHeader } from '@/components/admin/PageHeader'
import { ProjectFormDialog } from '@/components/admin/ProjectFormDialog'
import { ProjectList } from '@/components/admin/ProjectList'

export default function NuevoProyectoPage() {
  return (
    <>
      {/* The list stays mounted behind the modal so closing feels continuous. */}
      <div
        aria-hidden
        className="pointer-events-none space-y-6 select-none blur-[1px]"
      >
        <PageHeader />
        <ProjectList />
      </div>

      <ProjectFormDialog mode="create" />
    </>
  )
}
