import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setMessage("Vérifiez votre email pour confirmer votre inscription.");
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </button>

        <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            {isSignUp ? "Créer un compte" : "Administration"}
          </h1>
          <p className="mb-6 font-body text-sm text-muted-foreground">
            {isSignUp ? "Inscrivez-vous pour accéder au panneau admin." : "Connectez-vous pour gérer vos projets."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
            </button>
          </form>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            className="mt-4 w-full font-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
