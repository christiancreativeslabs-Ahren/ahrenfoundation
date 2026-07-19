import { desc } from "drizzle-orm";
import {
  createCommunityEvent,
  createDashboardResource,
  createOpportunity,
  updateCommunityPostStatus,
  updateProjectShowcaseStatus,
} from "@/actions/admin";
import { db } from "@/db";
import {
  communityEvents,
  communityPosts,
  dashboardResources,
  opportunities,
  projectShowcases,
} from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Checkbox,
  HiddenInput,
  Select,
  Textarea,
  TextInput,
  UrlInput,
  DateTimeInput,
} from "@/components/ui/input-fields";

export const dynamic = "force-dynamic";

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="space-y-2 text-sm text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatusForm({
  id,
  idName,
  action,
  statuses,
}: {
  id: string;
  idName: string;
  action: (formData: FormData) => Promise<void>;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <form key={status} action={action}>
          <HiddenInput name={idName} value={id} />
          <HiddenInput name="status" value={status} />
          <Button type="submit" size="sm" variant="outline" className="border-white/15 bg-transparent text-white">
            {status}
          </Button>
        </form>
      ))}
    </div>
  );
}

export default async function AdminContentPage() {
  const [resources, events, items, posts, projects] = await Promise.all([
    db.select().from(dashboardResources).orderBy(desc(dashboardResources.createdAt)).limit(20),
    db.select().from(communityEvents).orderBy(desc(communityEvents.startsAt)).limit(20),
    db.select().from(opportunities).orderBy(desc(opportunities.createdAt)).limit(20),
    db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt)).limit(20),
    db.select().from(projectShowcases).orderBy(desc(projectShowcases.createdAt)).limit(20),
  ]);

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Dashboard content
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Content and moderation
          </CardTitle>
          <CardDescription className="text-slate-300">
            Publish resources, events, opportunities, and moderate community
            posts and project showcase submissions.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDashboardResource} className="space-y-3">
              <Field label="Audience">
                <Select
                  name="audience"
                  defaultValue="all"
                  options={[
                    { value: "all", label: "All" },
                    { value: "youth", label: "Youth" },
                    { value: "mentor", label: "Mentor" },
                  ]}
                />
              </Field>
              <Field label="Category">
                <TextInput name="category" placeholder="Books, links, templates" />
              </Field>
              <Field label="Title">
                <TextInput name="title" required />
              </Field>
              <Field label="Summary">
                <Textarea name="summary" />
              </Field>
              <Field label="URL">
                <UrlInput name="url" />
              </Field>
              <Checkbox name="is_published" value="true" label="Publish now" />
              <Button type="submit">Create resource</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCommunityEvent} className="space-y-3">
              <Field label="Audience">
                <Select
                  name="audience"
                  defaultValue="all"
                  options={[
                    { value: "all", label: "All" },
                    { value: "youth", label: "Youth" },
                    { value: "mentor", label: "Mentor" },
                  ]}
                />
              </Field>
              <Field label="Title">
                <TextInput name="title" required />
              </Field>
              <Field label="Starts at">
                <DateTimeInput name="starts_at" required />
              </Field>
              <Field label="Location">
                <TextInput name="location" />
              </Field>
              <Field label="Meeting URL">
                <UrlInput name="meeting_url" />
              </Field>
              <Field label="Summary">
                <Textarea name="summary" />
              </Field>
              <Button type="submit">Create event</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpportunity} className="space-y-3">
              <Field label="Audience">
                <Select
                  name="audience"
                  defaultValue="all"
                  options={[
                    { value: "all", label: "All" },
                    { value: "youth", label: "Youth" },
                    { value: "mentor", label: "Mentor" },
                  ]}
                />
              </Field>
              <Field label="Type">
                <TextInput name="type" placeholder="funding, partnership, training" />
              </Field>
              <Field label="Title">
                <TextInput name="title" required />
              </Field>
              <Field label="Summary">
                <Textarea name="summary" />
              </Field>
              <Field label="URL">
                <UrlInput name="url" />
              </Field>
              <Button type="submit">Create opportunity</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent resources/events/opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#00c9ff]">Resources</h3>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div key={resource.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-sm font-semibold">{resource.title}</p>
                    <p className="text-xs text-slate-400">{resource.audience} - {resource.category}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#00c9ff]">Events</h3>
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.audience} - {event.status}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#00c9ff]">Opportunities</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.audience} - {item.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Moderation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#00c9ff]">Community posts</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-400">Post</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id} className="border-white/10">
                      <TableCell className="max-w-[260px] text-sm text-slate-300">{post.body}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/15 text-cyan-200">{post.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusForm
                          id={post.id}
                          idName="post_id"
                          action={updateCommunityPostStatus}
                          statuses={["published", "hidden"]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#00c9ff]">Project submissions</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-400">Project</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="border-white/10">
                      <TableCell>
                        <p className="text-sm font-semibold">{project.title}</p>
                        <p className="mt-1 max-w-[260px] text-xs text-slate-400">{project.summary}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/15 text-cyan-200">{project.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusForm
                          id={project.id}
                          idName="project_id"
                          action={updateProjectShowcaseStatus}
                          statuses={["published", "submitted", "hidden"]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
