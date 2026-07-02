import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {Button} from "@/components/ui/button";
import {Eye, EyeOff, Lock, LogIn, Mail} from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        setLoading(true);

        try {
            await login(email, password); // no need to write authservice.login becoz already provided the context
            navigate("/"); // after logging go to dashboard page
        } catch (err: any) {

            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg p-8">

                {/* Header / Logo */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Splitwise</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Sign in to your account</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"} //option to show password
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-10 pl-10 pr-10 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4 mr-2"/>
                                Sign In
                            </>
                        )}
                    </Button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                        Create one
                    </Link>
                </div>

            </div>
        </div>
    );
}