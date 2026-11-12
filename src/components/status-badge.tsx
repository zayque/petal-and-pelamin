import type { BookingStatus } from "@prisma/client";
import { STATUS_META } from "@/lib/catalog";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${meta.tone}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}
