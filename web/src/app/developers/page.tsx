import { Footer } from '@/components/Footer'

export default function Page() {
  return (
    <div className="flex flex-col h-[calc(100vh)] bg-white dark:bg-[#0d0f12] text-gray-900 dark:text-gray-100">
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Developers</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Developer API and resources.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
