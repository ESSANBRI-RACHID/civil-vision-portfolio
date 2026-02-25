import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
  const { session, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasRecoveryToken, setHasRecoveryToken] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setHasRecoveryToken(hashParams.get("type") === "recovery");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Mot de passe mis à jour. Redirection vers la connexion...");
      setTimeout(() => navigate("/login"), 1500);
    }

    setLoading(false);
  };

  const canReset = hasRecoveryToken || !!session;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </button>

        <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Réinitialiser le mot de passe</h1>
          <p className="mb-6 font-body text-sm text-muted-foreground">
            Choisissez un nouveau mot de passe pour votre compte administrateur.
          </p>

          {!canReset ? (
            <p className="font-body text-sm text-destructive">
              Lien invalide ou expiré. Relancez une demande de réinitialisation depuis la page de connexion.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {error && <p className="font-body text-sm text-destructive">{error}</p>}
              {message && <p className="font-body text-sm text-primary">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
