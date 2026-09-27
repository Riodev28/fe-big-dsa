import Sidebar from '@/components/ui/sidebar';
import { FilesProvider } from '@/components/files-provider';
import { UnsavedChangesProvider } from '@/components/unsaved-changes-provider';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilesProvider>
      <UnsavedChangesProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </UnsavedChangesProvider>
    </FilesProvider>
  );
}
