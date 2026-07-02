import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getDashboard} from "@/services/dashboardService";
import {acceptInvitation, declineInvitation} from "@/services/invitationService";
import type {Dashboard} from "@/types/Dashboard";
import {ArrowRight, Check, Clock, Users, Wallet, X} from "lucide-react";

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const data = await getDashboard();
            setDashboard(data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleAccept = async (invitationId: number) => {
        try {
            await acceptInvitation(invitationId);
            fetchDashboard();
        } catch (err) {
            console.error("Failed to accept invitation", err);
        }
    };

    const handleDecline = async (invitationId: number) => {
        try {
            await declineInvitation(invitationId);
            fetchDashboard();
        } catch (err) {
            console.error("Failed to decline invitation", err);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted rounded animate-pulse"/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted rounded-lg animate-pulse"/>)}
                </div>
            </div>
        );
    }

    if (!dashboard) return null;

    const totalMembers = dashboard.myGroups.reduce((acc, g) => acc + g.members.length, 0);

    // Calculate total you are owed and total you owe
    const totalOwed = dashboard.balances.filter(b => b.amount > 0).reduce((acc, b) => acc + b.amount, 0);
    const totalOwe = dashboard.balances.filter(b => b.amount < 0).reduce((acc, b) => acc + Math.abs(b.amount), 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Overview of your Splitwise activity</p>
            </div>

            {/* Pending Invitations */}
            {dashboard.pendingInvitations.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500"/>
                        Pending Invitations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dashboard.pendingInvitations.map(inv => (
                            <Card key={inv.id}
                                  className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-sm">{inv.groupName}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Invited by <span className="font-medium">{inv.inviter.name}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                                                onClick={() => handleDecline(inv.id)}>
                                            <X className="w-4 h-4 text-destructive"/>
                                        </Button>
                                        <Button size="sm" className="h-8 w-8 p-0" onClick={() => handleAccept(inv.id)}>
                                            <Check className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Balances Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">You are owed</CardTitle>
                        <Wallet className="w-5 h-5 text-emerald-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{totalOwed.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">You owe</CardTitle>
                        <Wallet className="w-5 h-5 text-rose-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                            ₹{totalOwe.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Groups</CardTitle>
                        <Users className="w-5 h-5 text-primary"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard.myGroups.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Individual Balances */}
            {dashboard.balances.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Your Balances</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {dashboard.balances.map((balance, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm">{balance.otherUser.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">in {balance.groupName}</p>
                                        </div>
                                        <div
                                            className={`text-sm font-bold ${balance.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {balance.amount > 0 ? 'owes you' : 'you owe'}
                                            <br/>
                                            ₹{Math.abs(balance.amount).toFixed(2)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Groups */}
            <div>
                <div className="flex items-center justify-between mb-4 mt-6">
                    <h2 className="text-lg font-semibold">Your Groups</h2>
                    <Link to="/groups" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3"/>
                    </Link>
                </div>

                {dashboard.myGroups.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-10 text-center">
                            <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3"/>
                            <p className="text-base font-medium text-muted-foreground">No groups yet</p>
                            <p className="text-sm text-muted-foreground mt-1">Create or join a group to start splitting
                                expenses</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboard.myGroups.slice(0, 6).map(group => (
                            <Link key={group.id} to={`/groups/${group.id}`}>
                                <Card className="hover:border-primary/30 cursor-pointer transition-colors">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                <Users className="w-4 h-4"/>
                                            </div>
                                            <div className="flex-1 truncate">
                                                <h3 className="font-semibold truncate">{group.name}</h3>
                                                <p className="text-sm text-muted-foreground">{group.members.length} members</p>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {group.members.slice(0, 5).map((m) => (
                                                <div key={m.id}
                                                     className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                    {m.name.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                            {group.members.length > 5 && (
                                                <div
                                                    className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                    +{group.members.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}