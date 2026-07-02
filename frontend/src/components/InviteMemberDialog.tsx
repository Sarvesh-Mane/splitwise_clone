import {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {inviteMember} from "@/services/invitationService";
import {AlertCircle, CheckCircle, Loader2, Mail} from "lucide-react";

interface InviteMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: number;
    onSuccess: () => void;
}

export default function InviteMemberDialog({open, onOpenChange, groupId, onSuccess}: InviteMemberDialogProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async () => {
        if (!email.trim()) return;
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await inviteMember(groupId, email.trim());
            setSuccess(`Invitation sent to ${email.trim()}`);
            setEmail("");
            onSuccess();
            // Close after short delay so user sees success message
            setTimeout(() => {
                onOpenChange(false);
                setSuccess("");
            }, 1500);
        } catch (err: any) {
            const message = err.response?.data?.error || err.response?.data?.message || err.response?.data || "Failed to send invitation";
            setError(typeof message === 'string' ? message : "Failed to send invitation");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            setEmail("");
            setError("");
            setSuccess("");
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Send an invitation to join this group by entering their email address.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <Input
                                type="email"
                                placeholder="e.g., friend@example.com"
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="pl-9"
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            />
                        </div>
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
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!email.trim() || loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                        Send Invitation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
