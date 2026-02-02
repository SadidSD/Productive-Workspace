import { Editor } from '@/components/editor/editor'

export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">Docs Engine</h2>
                <p className="text-muted-foreground mt-1">
                    Block-based editing environment for Research, Insights, and Decisions.
                </p>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">Editor Preview</label>
                <Editor
                    initialContent="<p>Start writing your systems thinking here...</p>"
                />
            </div>
        </div>
    )
}
