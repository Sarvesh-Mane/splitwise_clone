import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

//we will be adding the option to create groups and also show created grps on the side bar
import {getGroups} from "@/services/groupService";
import type {Group} from "@/types/Group";

import {Button} from "./ui/button";
import {ChevronRight, Plus, Users} from "lucide-react";

interface SidebarProps {
    onCreateGroup: () => void;
}

export default function Sidebar({onCreateGroup}: SidebarProps) {
    const [groups, setGroups] = useState<Group[]>([]);// initially no groups are present, groups is basically list of all groups
    const location = useLocation();

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getGroups();  // hitting the api to get all groups
                setGroups(data);  //changing state
            } catch (err) {
                console.error("Failed to fetch groups for sidebar", err);
            }
        }

        fetchGroups();
    }, [location.pathname]); //location.pathname in dep array because i want to reload and 
    //update groups whenever the user is navigating from one link to other link

    return (
        //aside used for sidebars, other than the main content
        <aside
            className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar h-[calc(100vh-3.5rem)] sticky top-14">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Groups</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCreateGroup} //if pressed on plus create group dialog appears
                    //in layout the value of setCreateGroupOpen will be toggled 
                    className="h-8 w-8"
                >
                    <Plus className="w-4 h-4"/>
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                {groups.length === 0 && (
                    <p className="text-sm text-muted-foreground px-3 py-6 text-center">
                        No groups yet
                    </p>
                )}

                {/* for all groups create a card like element to show grp name,
                 members and maybe a group icon as well  */}
                {groups.map((group) => {
                    const isActive = location.pathname === `/groups/${group.id}`;
                    //to show in darker colour when we are viewing the group details
                    return (
                        //clicking on group div should show group details
                        <Link key={group.id} to={`/groups/${group.id}`}>
                            <div
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                    ${isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-accent"
                                }`}
                            >
                                {/*icon for groups*/}
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold
                                    ${isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                    <Users className="w-3.5 h-3.5"/>
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="truncate">{group.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {group.members.length} members
                                    </p>
                                </div>
                                {/* right icon  */}
                                <ChevronRight className="w-4 h-4"/>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
