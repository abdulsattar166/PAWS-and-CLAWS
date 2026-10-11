import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDateTime } from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Modal, Spinner, StatusPill, btnDanger, btnGhost } from "./AdminUi";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

type Tab = "messages" | "subscribers";

export default function MessagesManager() {
  const [tab, setTab] = useState<Tab>("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [active, setActive] = useState<ContactMessage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const [msgRes, subRes] = await Promise.all([
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      ]);
      if (msgRes.error) throw msgRes.error;
      if (subRes.error) throw subRes.error;
      setMessages((msgRes.data ?? []) as ContactMessage[]);
      setSubscribers((subRes.data ?? []) as Subscriber[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load messages.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unread = useMemo(() => messages.filter((m) => !m.is_read).length, [messages]);

  const toggleRead = async (m: ContactMessage) => {
    if (!supabase) return;
    setBusyId(m.id);
    const { error: err } = await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    setBusyId("");
    if (!err) {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: !x.is_read } : x)));
      setActive((prev) => (prev && prev.id === m.id ? { ...prev, is_read: !prev.is_read } : prev));
    }
  };

  const doDeleteMessage = async () => {
    if (!supabase || !confirmDelete) return;
    setBusyId(confirmDelete.id);
    const { error: err } = await supabase.from("contact_messages").delete().eq("id", confirmDelete.id);
    setBusyId("");
    if (!err) {
      setMessages((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
      setActive(null);
    }
  };

  const deleteSubscriber = async (s: Subscriber) => {
    if (!supabase) return;
    setBusyId(s.id);
    const { error: err } = await supabase.from("newsletter_subscribers").delete().eq("id", s.id);
    setBusyId("");
    if (!err) setSubscribers((prev) => prev.filter((x) => x.id !== s.id));
  };

  const openMessage = (m: ContactMessage) => {
    setActive(m);
    if (!m.is_read) toggleRead(m);
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-background-100 border border-background-200/70">
        <button
          type="button"
          onClick={() => setTab("messages")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${tab === "messages" ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:text-foreground-950"}`}
        >
          <i className="ri-mail-line" aria-hidden="true"></i> Contact messages
          {unread > 0 && (
            <span className="ml-1 rounded-full bg-secondary-500 text-secondary-950 text-[11px] font-bold px-2 py-0.5">{unread}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("subscribers")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${tab === "subscribers" ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:text-foreground-950"}`}
        >
          <i className="ri-mail-send-line" aria-hidden="true"></i> Newsletter
        </button>
      </div>

      <Card>
        {status === "loading" && <Spinner label="Loading messages…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}

        {status === "ready" && tab === "messages" && messages.length === 0 && (
          <EmptyState icon="ri-inbox-line" title="No messages yet" text="Messages sent from the contact page will appear here." />
        )}
        {status === "ready" && tab === "messages" && messages.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {messages.map((m) => (
              <li key={m.id}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-4 md:px-5 py-4">
                  <button type="button" onClick={() => openMessage(m)} className="flex-1 min-w-0 text-left cursor-pointer">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-semibold ${m.is_read ? "text-foreground-800" : "text-foreground-950"}`}>{m.name}</span>
                      <StatusPill label={m.is_read ? "Read" : "New"} tone={m.is_read ? "neut" : "info"} />
                      {m.subject && <span className="text-xs text-foreground-500 truncate">{m.subject}</span>}
                    </div>
                    <p className="mt-1 text-sm text-foreground-600 truncate">{m.message}</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">
                      {m.email}{m.phone ? ` · ${m.phone}` : ""} · {formatDateTime(m.created_at)}
                    </p>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => toggleRead(m)} disabled={busyId === m.id} className={btnGhost}>
                      <i className={m.is_read ? "ri-mail-unread-line" : "ri-mail-check-line"} aria-hidden="true"></i>
                      {m.is_read ? "Mark unread" : "Mark read"}
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(m)} className={`${btnDanger} px-3`}>
                      <i className="ri-delete-bin-line" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {status === "ready" && tab === "subscribers" && subscribers.length === 0 && (
          <EmptyState icon="ri-mail-send-line" title="No subscribers yet" text="Newsletter sign-ups will appear here." />
        )}
        {status === "ready" && tab === "subscribers" && subscribers.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-4 md:px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground-950 truncate">{s.email}</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">Subscribed {formatDateTime(s.created_at)}</p>
                </div>
                <button type="button" onClick={() => deleteSubscriber(s)} disabled={busyId === s.id} className={`${btnDanger} px-3`}>
                  <i className="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {active && (
        <Modal
          open
          onClose={() => setActive(null)}
          title={`Message from ${active.name}`}
          footer={
            <>
              <button type="button" onClick={() => setConfirmDelete(active)} className={btnDanger}>
                <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
              </button>
              <a href={`mailto:${active.email}`} className={btnGhost}>Reply by email</a>
            </>
          }
        >
          <div className="space-y-3 text-sm text-foreground-800">
            <p><span className="font-semibold text-foreground-950">From:</span> {active.name} · {active.email}{active.phone ? ` · ${active.phone}` : ""}</p>
            {active.subject && <p><span className="font-semibold text-foreground-950">Subject:</span> {active.subject}</p>}
            <p className="text-[11px] text-foreground-500">{formatDateTime(active.created_at)}</p>
            <p className="whitespace-pre-wrap rounded-xl bg-background-100 border border-background-200/70 p-4 leading-relaxed">{active.message}</p>
          </div>
        </Modal>
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete message"
        footer={
          <>
            <button type="button" onClick={() => setConfirmDelete(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={doDeleteMessage} disabled={busyId === confirmDelete?.id} className={btnDanger}>
              <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">
          Delete the message from <strong>{confirmDelete?.name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
