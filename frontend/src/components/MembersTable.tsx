import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {Badge} from "./ui/badge";
import {getGroupInvitations} from "@/services/invitationService";
import type {User} from "@/types/User";
import type {GroupInvitation} from "@/types/GroupInvitation";
import {CheckCircle2, Clock, XCircle} from "lucide-react";

interface MembersTableProps {
    groupId: number;
    members: User[];
    onInviteClick: () => void;
}

export default function MembersTable({groupId, members, onInviteClick}: MembersTableProps) {
    const [invitations, setInvitations] = useState<GroupInvitation[]>([]);

    useEffect(() => {
        getGroupInvitations(groupId)
            .then(setInvitations)
            .catch(console.error);
    }, [groupId]);

    // Filter to only show pending/declined invitations (accepted ones are already in members)
    const pendingInvitations = invitations.filter(inv => inv.status === 'PENDING' || inv.status === 'DECLINED');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">Group Members & Invitations</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {members.length} members{pendingInvitations.length > 0 && `, ${pendingInvitations.length} pending`}
                    </p>
                </div>

            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Current members */}
                    {members.map((member) => (
                        <TableRow key={`member-${member.id}`}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{member.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {member.email}
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge
                                    className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 gap-1">
                                    <CheckCircle2 className="w-3 h-3"/>
                                    Joined
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Pending / Declined invitations */}
                    {pendingInvitations.map((inv) => (
                        <TableRow key={`inv-${inv.id}`}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                                        {inv.inviteeEmail.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-muted-foreground">
                                        {inv.invitee ? inv.invitee.name : inv.inviteeEmail.split('@')[0]}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {inv.inviteeEmail}
                            </TableCell>
                            <TableCell className="text-right">
                                {inv.status === 'PENDING' ? (
                                    <Badge variant="outline"
                                           className="gap-1 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30">
                                        <Clock className="w-3 h-3"/>
                                        Pending
                                    </Badge>
                                ) : (
                                    <Badge variant="outline"
                                           className="gap-1 text-rose-500 border-rose-300 dark:border-rose-500/30">
                                        <XCircle className="w-3 h-3"/>
                                        Declined
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}

                    {members.length === 0 && pendingInvitations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No members yet. Invite someone to get started!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
