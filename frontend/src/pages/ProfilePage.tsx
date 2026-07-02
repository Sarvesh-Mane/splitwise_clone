import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {changePassword} from "@/services/authService";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {AlertCircle, CheckCircle, KeyRound, LogOut, Mail, User as UserIcon} from "lucide-react";

export default function ProfilePage() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    const handleChangePassword = async () => {
        setError("");
        setSuccess("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            setSuccess("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data || "Failed to change password";
            setError(typeof message === 'string' ? message : "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    // Get initials for avatar
    const initials = user.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your account settings</p>
            </div>

            {/* User Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                            {initials}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                                <Mail className="w-4 h-4"/>
                                {user.email}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-primary"/>
                        Security
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-muted-foreground mt-0.5">Change your account password</p>
                        </div>
                        <Dialog open={passwordDialogOpen} onOpenChange={(open) => {
                            if (!open) {
                                setOldPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setError("");
                                setSuccess("");
                            }
                            setPasswordDialogOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Change Password</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>
                                        Update your password to keep your account secure.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-2">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Current Password</label>
                                        <Input
                                            type="password"
                                            placeholder="Enter your current password"
                                            value={oldPassword}
                                            onChange={e => {
                                                setOldPassword(e.target.value);
                                                setError("");
                                            }}
                                        />
                                    </div>

                                    <Separator/>

                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">New Password</label>
                                        <Input
                                            type="password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={e => {
                                                setNewPassword(e.target.value);
                                                setError("");
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
                                        <Input
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={e => {
                                                setConfirmPassword(e.target.value);
                                                setError("");
                                            }}
                                        />
                                    </div>

                                    {error && (
                                        <div
                                            className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div
                                            className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-lg">
                                            <CheckCircle className="w-4 h-4 flex-shrink-0"/>
                                            {success}
                                        </div>
                                    )}

                                    <Button onClick={handleChangePassword} disabled={loading} className="w-full">
                                        {loading ? "Changing..." : "Change Password"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            {/* Logout Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-muted-foreground"/>
                                Sign Out
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Sign out of your account on this
                                device</p>
                        </div>
                        <Button variant="destructive" onClick={handleLogout} className="gap-2">
                            <LogOut className="w-4 h-4"/>
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
