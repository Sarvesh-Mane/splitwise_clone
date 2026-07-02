import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button} from "./ui/button";
import {ChevronDown, LayoutDashboard, LogOut, Moon, Sun, User, Users} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@/context/AuthContext";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return true;
    });

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // to change light to dark or vice versa
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    // will be available on the navigation bar
    const navLinks = [
        {to: "/", label: "Dashboard", icon: LayoutDashboard},
        {to: "/groups", label: "Groups", icon: Users},
    ];

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    return (
        // header because navbar
        <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between h-14 px-5">

                {/* this is logo when clicked goes to dashboard */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="text-xl font-bold text-primary">Splitwise</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {/* looping through navigation links
                    and also destructuring the navlinks array */}
                    {navLinks.map(({to, label, icon: Icon}) => {
                        const isActive = location.pathname === to ||
                            (to !== "/" && location.pathname.startsWith(to));
                        return (
                            <Link key={to} to={to}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Icon className="w-4 h-4"/>
                                    {label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    {/*switch button for dark and light mode*/}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDark(!dark)}
                    >
                        {dark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                    </Button>

                    {/* User profile dropdown */}
                    {user && (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent"
                            >
                                <div
                                    className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                    {getInitials(user.name)}
                                </div>
                                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-muted-foreground ${profileOpen ? 'rotate-180' : ''}`}/>
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-52 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
                                    <div className="px-4 py-3 border-b border-border">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md"
                                        >
                                            <User className="w-4 h-4"/>
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                                        >
                                            <LogOut className="w-4 h-4"/>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
