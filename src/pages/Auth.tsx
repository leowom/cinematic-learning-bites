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
    <div className="bg-white dark:bg-zinc-950 py-20 text-zinc-800 dark:text-zinc-200 selection:bg-zinc-300 dark:selection:bg-zinc-600 min-h-screen">
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
    className={`rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 
    ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 
    transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 ${className}`}
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
    <h1 className="text-2xl font-semibold">Accedi al tuo account</h1>
    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
      Non hai un account?{" "}
      <button 
        onClick={() => window.location.hash = "signup"}
        className="text-blue-600 dark:text-blue-400 hover:underline"
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
    border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 
    px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-500
    before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%] before:bg-zinc-800 dark:before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-[""]
    hover:scale-105 hover:text-zinc-100 dark:hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95
    ${fullWidth ? "col-span-2" : ""}`}
  >
    {icon}
    <span>{children}</span>
  </button>
)

const Divider: React.FC = () => (
  <div className="my-6 flex items-center gap-3">
    <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
    <span className="text-zinc-500 dark:text-zinc-400">OPPURE</span>
    <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
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
            className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
          >
            Nome
          </label>
          <input
            id="firstName-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Il tuo nome"
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
            bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
            placeholder-zinc-400 dark:placeholder-zinc-500 
            ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
          />
        </div>
      )}
      <div className="mb-3">
        <label
          htmlFor="email-input"
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
        >
          Email
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="la.tua.email@provider.com"
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label
            htmlFor="password-input"
            className="block text-zinc-500 dark:text-zinc-400"
          >
            Password
          </label>
          <a href="#" className="text-sm text-blue-600 dark:text-blue-400">
            Password dimenticata?
          </a>
        </div>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Attendere..." : isSignUp ? "Registrati" : "Accedi"}
      </Button>
    </form>
  )
}

const TermsAndConditions: React.FC = () => (
  <p className="mt-9 text-xs text-zinc-500 dark:text-zinc-400">
    Accedendo, accetti i nostri{" "}
    <a href="#" className="text-blue-600 dark:text-blue-400">
      Termini & Condizioni
    </a>{" "}
    e{" "}
    <a href="#" className="text-blue-600 dark:text-blue-400">
      Informativa sulla Privacy.
    </a>
  </p>
)

const BackgroundDecoration: React.FC = () => {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  return (
    <div
      className="absolute right-0 top-0 z-0 size-[50vw]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDarkTheme
            ? "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))"
            : "radial-gradient(100% 100% at 100% 0%, rgba(255,255,255,0), rgba(255,255,255,1))",
        }}
      />
    </div>
  )
}

export default AuthForm