import { BlogPostEditor } from "@/features/admin/blog/_components/blog-post-editor";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
          Admin content
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          New blog post
        </h1>
      </div>
      <BlogPostEditor />
    </div>
  );
}
