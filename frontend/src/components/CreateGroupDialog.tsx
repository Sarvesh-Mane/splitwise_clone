import {useState} from "react";

//dialog component
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";

import {createGroup} from "@/services/groupService";
import {useAuth} from "@/context/AuthContext";
import {useNavigate} from "react-router-dom"; //useLocation is also in react-router dom
import {Loader2} from "lucide-react";

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateGroupDialog({open, onOpenChange}: CreateGroupDialogProps) {
    const [name, setName] = useState(""); // group name 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    // why using navigate instead of Link?

    const handleSubmit = async () => {
        if (!name.trim()) return; // if no name entered return
        setLoading(true);
        try {
            const group = await createGroup(name.trim(), user ? [user.id] : []);
            onOpenChange(false);
            setName(""); // reset to default
            navigate(`/groups/${group.id}`); //go to group details page
        } catch (err) {
            console.error("Failed to create group", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>Create a new group and add members to start splitting
                        expenses.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Group Name</label>
                        <Input
                            placeholder="e.g., Trip to Goa"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!name.trim() || loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                        Create Group
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
