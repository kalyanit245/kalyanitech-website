import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiGet } from "@/lib/api";
import type { Inquiry } from "@/lib/types";
import { StarMark } from "@/components/StarMark";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Admin() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => apiGet<Inquiry[]>("/inquiries"),
  });

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
          <a href="/" data-testid="admin-back-link" className="ml-auto text-sm text-teal-bright hover:text-foreground">
            ← Back to site
          </a>
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
