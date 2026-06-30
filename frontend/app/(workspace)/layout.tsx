import { WorkspaceSidebar } from '@/components/layout/WorkspaceSidebar'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-white text-[#1A1A1A]">
      <WorkspaceSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
