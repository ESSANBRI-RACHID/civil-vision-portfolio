import { useState } from "react";
import { getContactInfo } from "@/lib/siteSettingsData";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const info = getContactInfo();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      toast.success("Message envoyé avec succès !");
      setForm({ name: "", email: "", phone: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <section id="contact" className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Contact</p>
        <h2 className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl">
          Contactez-<span className="text-gradient">nous</span>
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {/* Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3"><Phone className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Téléphone</h4>
                <p className="font-body text-sm text-muted-foreground">{info.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3"><Mail className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Email</h4>
                <p className="font-body text-sm text-muted-foreground">{info.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3"><MapPin className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Adresse</h4>
                <p className="font-body text-sm text-muted-foreground">{info.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3"><Clock className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Horaires</h4>
                <p className="font-body text-sm text-muted-foreground">{info.hours}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Nom complet *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-md border border-border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Adresse email *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-md border border-border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-md border border-border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Votre message *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full rounded-md border border-border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 rounded-sm bg-primary px-8 py-3 font-body text-sm uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/80 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
