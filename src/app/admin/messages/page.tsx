import type { Metadata } from "next";
import { deleteMessage, toggleMessageRead } from "@/app/actions/admin";
import { db } from "@/lib/db";
import { dateTime, eventDate } from "@/lib/format";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessages() {
  const messages = await db.message.findMany({ orderBy: [{ isRead: "asc" }, { createdAt: "desc" }], take: 200 });

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Inbox</p>
        <h1 className="mt-1 text-4xl font-semibold">Messages</h1>
      </header>

      {messages.length === 0 ? (
        <div className="card p-16 text-center text-muted">No messages yet. Enquiries from the contact page will land here.</div>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <article key={m.id} className={`card p-6 ${m.isRead ? "opacity-70" : "ring-2 ring-blush-200"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    {!m.isRead && <span className="size-2 rounded-full bg-blush-500" aria-label="Unread" />}
                    {m.name}
                  </p>
                  <p className="text-sm text-muted">
                    <a href={`mailto:${m.email}`} className="hover:text-blush-700">
                      {m.email}
                    </a>
                    {m.phone && <> · {m.phone}</>}
                    {m.eventDate && <> · Event {eventDate(m.eventDate, "short")}</>}
                  </p>
                </div>
                <p className="text-xs text-muted">{dateTime(m.createdAt)}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-line">{m.body}</p>
              <div className="mt-4 flex gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your Petal & Pelamin enquiry")}`} className="btn-soft btn-sm">
                  Reply
                </a>
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-ghost btn-sm">{m.isRead ? "Mark unread" : "Mark read"}</button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-danger btn-sm">Delete</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
