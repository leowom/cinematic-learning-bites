import * as React from "react"
import { ChevronLeft, Github, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-background py-20 text-foreground selection:bg-accent selection:text-accent-foreground min-h-screen">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Logo />
        <Header />
        <SocialButtons />
        <Divider />
        <LoginForm />
        <TermsAndConditions />
      </motion.div>
      <BackgroundDecoration />
    </div>
  )
}

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <SocialButton icon={<ChevronLeft size={16} />} onClick={() => navigate(-1)}>
      Indietro
    </SocialButton>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`rounded-md bg-primary text-primary-foreground px-4 py-2 text-lg 
    ring-2 ring-ring/50 ring-offset-2 ring-offset-background 
    transition-all hover:scale-[1.02] hover:bg-primary/90 hover:ring-transparent active:scale-[0.98] active:ring-ring/70 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Logo: React.FC = () => (
  <div className="mb-6 flex justify-center items-center">
    <img
      src="/lovable-uploads/08d7ee17-c8fc-427e-bde8-3335c6fc6927.png"
      alt="LearningBites"
      className="h-12"
    />
  </div>
)

const Header: React.FC = () => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl font-semibold text-foreground">Accedi al tuo account</h1>
    <p className="mt-2 text-muted-foreground">
      Non hai un account?{" "}
      <button 
        onClick={() => window.location.hash = "signup"}
        className="text-primary hover:underline"
      >
        Creane uno.
      </button>
    </p>
  </div>
)

const SocialButtons: React.FC = () => (
  <div className="mb-6 space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <SocialButton icon={<Twitter size={20} />} fullWidth>Accedi con Twitter</SocialButton>
      <SocialButton icon={<Github size={20} />} fullWidth>Accedi con GitHub</SocialButton>
    </div>
  </div>
)

const SocialButton: React.FC<{
  icon?: React.ReactNode
  fullWidth?: boolean
  children?: React.ReactNode
  onClick?: () => void
}> = ({ icon, fullWidth, children, onClick }) => (
  <button
    onClick={onClick}
    className={`relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-md 
    border border-border bg-secondary 
    px-4 py-2 font-semibold text-secondary-foreground transition-all duration-500
    before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%] before:bg-primary before:transition-transform before:duration-1000 before:content-[""]
    hover:scale-105 hover:text-primary-foreground hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95
    ${fullWidth ? "col-span-2" : ""}`}
  >
    {icon}
    <span>{children}</span>
  </button>
)

const Divider: React.FC = () => (
  <div className="my-6 flex items-center gap-3">
    <div className="h-[1px] w-full bg-border" />
    <span className="text-muted-foreground">OPPURE</span>
    <div className="h-[1px] w-full bg-border" />
  </div>
)

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [firstName, setFirstName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [isSignUp, setIsSignUp] = React.useState(() => window.location.hash === "#signup")
  const navigate = useNavigate()

  React.useEffect(() => {
    const handleHashChange = () => {
      setIsSignUp(window.location.hash === "#signup")
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (!firstName.trim()) {
          throw new Error("Per favore, inserisci il tuo nome")
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: firstName
            }
          }
        })
        if (error) throw error
        toast.success("Controlla la tua email per verificare l'account")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate("/dashboard")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {isSignUp && (
        <div className="mb-3">
          <label
            htmlFor="firstName-input"
            className="mb-1.5 block text-muted-foreground"
          >
            Nome
          </label>
          <input
            id="firstName-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Il tuo nome"
            className="w-full rounded-md border border-input 
            bg-background px-3 py-2 text-foreground
            placeholder-muted-foreground 
            ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-ring"
          />
        </div>
      )}
      <div className="mb-3">
        <label
          htmlFor="email-input"
          className="mb-1.5 block text-muted-foreground"
        >
          Email
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="la.tua.email@provider.com"
          className="w-full rounded-md border border-input 
          bg-background px-3 py-2 text-foreground
          placeholder-muted-foreground 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-ring"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label
            htmlFor="password-input"
            className="block text-muted-foreground"
          >
            Password
          </label>
          <a href="#" className="text-sm text-primary hover:underline">
            Password dimenticata?
          </a>
        </div>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="w-full rounded-md border border-input 
          bg-background px-3 py-2 text-foreground
          placeholder-muted-foreground 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-ring"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Attendere..." : isSignUp ? "Registrati" : "Accedi"}
      </Button>
    </form>
  )
}

const TermsAndConditions: React.FC = () => (
  <p className="mt-9 text-xs text-muted-foreground">
    Accedendo, accetti i nostri{" "}
    <a href="#" className="text-primary hover:underline">
      Termini & Condizioni
    </a>{" "}
    e{" "}
    <a href="#" className="text-primary hover:underline">
      Informativa sulla Privacy.
    </a>
  </p>
)

const BackgroundDecoration: React.FC = () => {
  return (
    <div
      className="absolute right-0 top-0 z-0 size-[50vw] opacity-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='hsl(var(--primary) / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
    </div>
  )
}

export default AuthForm