import {useEffect, useState} from "react";
import GroupCard from "../components/GroupCard";
import type {Group} from "../types/Group";
import {getGroups} from "../services/groupService";
import {Button} from "@/components/ui/button";
import CreateGroupDialog from "@/components/CreateGroupDialog";
import {Plus} from "lucide-react";

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getGroups();
                setGroups(data);
            } catch (err) {
                console.error("Failed to fetch groups", err);
            } finally {
                setLoading(false);
            }
        }

        fetchGroups();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-40 bg-muted rounded animate-pulse"/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-36 bg-muted rounded-lg animate-pulse"/>)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Groups</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your expense groups</p>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4"/>
                    Create Group
                </Button>
            </div>

            {groups.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-muted flex items-center justify-center mb-4">
                        <Plus className="w-7 h-7 text-muted-foreground"/>
                    </div>
                    <p className="text-base font-medium text-muted-foreground">No groups yet</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first group to start splitting
                        expenses</p>
                    <Button onClick={() => setCreateOpen(true)} variant="outline" className="gap-2">
                        <Plus className="w-4 h-4"/>
                        Create your first group
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map(group => (
                        <GroupCard key={group.id} group={group}/>
                    ))}
                </div>
            )}

            <CreateGroupDialog open={createOpen} onOpenChange={setCreateOpen}/>
        </div>
    );
}