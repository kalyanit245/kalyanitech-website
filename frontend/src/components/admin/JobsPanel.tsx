import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { Job } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inputCls =
  "h-11 rounded-xl border-line bg-panel-alt/60 px-4 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60";

export const JobsPanel = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", technology: "", location: "", job_type: "", description: "" });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => apiGet<Job[]>("/jobs"),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
    void queryClient.invalidateQueries({ queryKey: ["jobs"] });
  };

  const createJob = useMutation({
    mutationFn: () =>
      apiPost<Job>("/jobs", {
        title: form.title,
        technology: form.technology,
        location: form.location || "Bengaluru / Hyderabad · Hybrid",
        job_type: form.job_type || "Full-time",
        description: form.description,
      }),
    onSuccess: () => {
      toast.success("Job posted to the careers page.");
      setForm({ title: "", technology: "", location: "", job_type: "", description: "" });
      invalidate();
    },
    onError: () => toast.error("Could not post the job. Check the fields and try again."),
  });

  const deleteJob = useMutation({
    mutationFn: (id: string) => apiDelete(`/jobs/${id}`),
    onSuccess: () => {
      toast.success("Job removed.");
      invalidate();
    },
    onError: () => toast.error("Could not delete the job."),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!createJob.isPending) createJob.mutate();
  };

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <form data-testid="admin-job-form" onSubmit={onSubmit} className="rounded-2xl border border-line bg-panel p-8 lg:col-span-5">
        <h2 className="font-heading text-xl text-foreground">Post a new position</h2>
        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="job-title" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Job Title *</label>
            <Input id="job-title" data-testid="admin-job-title-input" required minLength={2} value={form.title} onChange={set("title")} placeholder="Senior Full-Stack Engineer" className={inputCls} />
          </div>
          <div>
            <label htmlFor="job-tech" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Technology *</label>
            <Input id="job-tech" data-testid="admin-job-technology-input" required minLength={2} value={form.technology} onChange={set("technology")} placeholder="React · TypeScript · FastAPI" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-location" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Location</label>
              <Input id="job-location" data-testid="admin-job-location-input" value={form.location} onChange={set("location")} placeholder="Bengaluru · Hybrid" className={inputCls} />
            </div>
            <div>
              <label htmlFor="job-type" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Type</label>
              <Input id="job-type" data-testid="admin-job-type-input" value={form.job_type} onChange={set("job_type")} placeholder="Full-time" className={inputCls} />
            </div>
          </div>
          <div>
            <label htmlFor="job-desc" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Description *</label>
            <Textarea id="job-desc" data-testid="admin-job-description-input" required minLength={10} rows={4} value={form.description} onChange={set("description")} placeholder="What will this person build, and with whom?" className="rounded-xl border-line bg-panel-alt/60 px-4 py-3 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60" />
          </div>
        </div>
        <button
          data-testid="admin-job-submit"
          type="submit"
          disabled={createJob.isPending}
          className="mt-6 w-full rounded-full bg-teal px-6 py-3 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createJob.isPending ? "Posting…" : "Post Job"}
        </button>
      </form>

      <div className="lg:col-span-7">
        <h2 className="font-heading text-xl text-foreground">Live positions</h2>
        {isLoading && <p className="mt-6 text-mist" data-testid="admin-jobs-loading">Loading…</p>}
        {jobs && jobs.length === 0 && (
          <p className="mt-6 text-mist" data-testid="admin-jobs-empty">No live positions — the careers page will show a “no openings” note.</p>
        )}
        <div className="mt-6 space-y-4">
          {jobs?.map((job) => (
            <div key={job.id} data-testid={`admin-job-row-${job.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-panel p-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-lg text-foreground">{job.title}</h3>
                  <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-teal-bright dark:bg-[#0D2B2C]/60">
                    {job.technology}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
                  {job.location} · {job.job_type}
                </p>
                <p className="mt-2 line-clamp-2 max-w-xl text-sm text-mist">{job.description}</p>
              </div>
              <button
                data-testid={`admin-job-delete-${job.id}`}
                onClick={() => { if (!deleteJob.isPending) deleteJob.mutate(job.id); }}
                aria-label={`Delete ${job.title}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-coral/60 hover:text-coral-soft"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
