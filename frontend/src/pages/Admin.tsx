import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Navigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import { endSession } from "@/lib/session";
import type { Inquiry } from "@/lib/types";
import { StarMark } from "@/components/StarMark";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const fetchMe = async (): Promise<AdminUser> => {
  try {
    return await apiGet<AdminUser>("/auth/me");
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await apiPost("/auth/refresh");
      return await apiGet<AdminUser>("/auth/me");
    }
    throw e;
  }
};

export default function Admin() {
  const me = useQuery({ queryKey: ["auth-me"], queryFn: fetchMe, retry: false, staleTime: 60_000 });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => apiGet<Inquiry[]>("/inquiries"),
    enabled: !!me.data,
  });

  if (me.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-mist" data-testid="admin-session-loading">Checking session…</p>
      </div>
    );
  }

  if (me.isError) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <header className="border-b border-line/70 bg-panel/40">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-6 lg:px-10">
          <StarMark className="h-6 w-6 text-teal" />
          <div>
            <h1 className="font-heading text-xl tracking-wide">KALYANI — Project Enquiries</h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">Internal dashboard</p>
          </div>
          <span className="ml-auto hidden font-mono text-xs text-mist sm:block" data-testid="admin-user-email">
            {me.data?.email}
          </span>
          <a href="/" data-testid="admin-back-link" className="text-sm text-teal-bright hover:text-foreground">
            ← Site
          </a>
          <button
            data-testid="admin-logout-button"
            onClick={() => void endSession("/login")}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mist transition-colors hover:border-coral/60 hover:text-coral-soft"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {isLoading && <p className="text-mist" data-testid="admin-loading">Loading enquiries…</p>}
        {isError && (
          <p className="text-coral-soft" data-testid="admin-error">
            Could not load enquiries. The backend may be unreachable.
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-mist" data-testid="admin-empty">No enquiries yet — submissions from the contact form will appear here.</p>
        )}
        {data && data.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-line bg-panel" data-testid="admin-inquiries-table">
            <Table>
              <TableHeader>
                <TableRow className="border-line hover:bg-transparent">
                  <TableHead className="text-mist">Received</TableHead>
                  <TableHead className="text-mist">Name</TableHead>
                  <TableHead className="text-mist">Email</TableHead>
                  <TableHead className="text-mist">Company</TableHead>
                  <TableHead className="text-mist">Service</TableHead>
                  <TableHead className="text-mist">Budget</TableHead>
                  <TableHead className="text-mist">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((q) => (
                  <TableRow key={q.id} className="border-line" data-testid={`admin-inquiry-row-${q.id}`}>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-mist">
                      {format(new Date(q.created_at), "dd MMM yyyy, HH:mm")}
                    </TableCell>
                    <TableCell className="text-foreground">{q.name}</TableCell>
                    <TableCell className="text-teal-bright">{q.email}</TableCell>
                    <TableCell className="text-foreground/80">{q.company || "—"}</TableCell>
                    <TableCell className="text-foreground/80">{q.service}</TableCell>
                    <TableCell className="text-foreground/80">{q.budget || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate text-mist">{q.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
