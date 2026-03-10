import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: Submission) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    if (!error) {
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: !m.is_read } : m));
    }
  };

  const deleteMsg = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message supprimé");
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">
          Messages reçus
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </h4>
        <button onClick={fetchMessages} className="text-muted-foreground hover:text-primary transition-colors" title="Rafraîchir">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && messages.length === 0 && (
        <p className="font-body text-xs text-muted-foreground">Chargement...</p>
      )}

      {!loading && messages.length === 0 && (
        <p className="font-body text-xs text-muted-foreground">Aucun message pour le moment.</p>
      )}

      <div className="max-h-80 space-y-2 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-md p-3 transition-colors ${
              msg.is_read ? "bg-secondary/30" : "bg-primary/5 border border-primary/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm font-semibold text-foreground truncate">{msg.name}</span>
                  {!msg.is_read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="font-body text-xs text-muted-foreground truncate">{msg.email}{msg.phone ? ` · ${msg.phone}` : ""}</p>
                <p className="mt-1 font-body text-xs text-foreground/80 line-clamp-2">{msg.message}</p>
                <p className="mt-1 font-body text-[10px] text-muted-foreground">
                  {new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  onClick={() => toggleRead(msg)}
                  className="rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                  title={msg.is_read ? "Marquer non lu" : "Marquer lu"}
                >
                  {msg.is_read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => deleteMsg(msg.id)}
                  className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;
