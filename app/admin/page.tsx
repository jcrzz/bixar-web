import { PageHeader } from '@/components/admin/PageHeader'
import { ProjectList } from '@/components/admin/ProjectList'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader />
      <ProjectList />
    </div>
  )
}
