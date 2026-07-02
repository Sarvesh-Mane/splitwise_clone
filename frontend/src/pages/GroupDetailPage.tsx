import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getGroupDetail} from "@/services/groupService";
import type {GroupDetail} from "@/types/GroupDetail";
import ExpenseTable from "@/components/ExpenseTable";
import SettlementTable from "@/components/SettlementTable";
import MembersTable from "@/components/MembersTable";
import InviteMemberDialog from "@/components/InviteMemberDialog";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Banknote, BarChart3, Plus, Receipt, UserPlus, Users} from "lucide-react";
import {getCategoryIcon, getCategoryLabel} from "./ExpenseDetailPage";

type Tab = "expenses" | "settlements" | "members" | "stats";

export default function GroupDetailPage() {
    const {id} = useParams();
    const [group, setGroup] = useState<GroupDetail>();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("expenses");
    const [addExpenseOpen, setAddExpenseOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);

    const fetchGroup = async () => {
        try {
            const data = await getGroupDetail(Number(id));
            setGroup(data);
        } catch (err) {
            console.error("Failed to fetch group detail", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [id]);

    const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
        {key: "expenses", label: "Expenses", icon: Receipt, count: group?.expenses.length},
        {key: "settlements", label: "Settlements", icon: Banknote, count: group?.settlements.length},
        {key: "members", label: "Members", icon: UserPlus, count: group?.members.length},
        {key: "stats", label: "Stats", icon: BarChart3},
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted rounded animate-pulse"/>
                <div className="flex gap-2">{[1, 2, 3].map(i => <div key={i}
                                                                     className="h-8 w-20 bg-muted rounded animate-pulse"/>)}</div>
                <div className="h-48 bg-muted rounded-lg animate-pulse"/>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="text-center py-16">
                <p className="text-base font-medium text-muted-foreground">Group not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Users className="w-5 h-5 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{group.name}</h1>
                            <p className="text-muted-foreground text-sm">{group.members.length} members</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setInviteOpen(true)} className="gap-2">
                        <UserPlus className="w-4 h-4"/>
                        Invite Members
                    </Button>
                    <Button onClick={() => setAddExpenseOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4"/>
                        Add Expense
                    </Button>
                </div>
            </div>

            {/* Members */}
            <div className="flex items-center gap-2 flex-wrap">
                {group.members.map((member) => (
                    <Badge key={member.id} variant="secondary" className="py-1 px-2.5">
                        {member.name}
                    </Badge>
                ))}
            </div>

            <Separator/>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                {tabs.map(({key, label, icon: Icon, count}) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                            ${activeTab === key
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Icon className="w-4 h-4"/>
                        {label}
                        {count !== undefined && count > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                {count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <Card>
                <CardContent className="pt-6">
                    {activeTab === "expenses" && (
                        <ExpenseTable expenses={group.expenses}/>
                    )}
                    {activeTab === "settlements" && (
                        <SettlementTable settlements={group.settlements}/>
                    )}
                    {activeTab === "members" && (
                        <MembersTable
                            groupId={Number(id)}
                            members={group.members}
                            onInviteClick={() => setInviteOpen(true)}
                        />
                    )}
                    {activeTab === "stats" && (
                        <GroupStats group={group}/>
                    )}
                </CardContent>
            </Card>

            {/* Add Expense Dialog */}
            <AddExpenseDialog
                open={addExpenseOpen}
                onOpenChange={setAddExpenseOpen}
                groupId={Number(id)}
                members={group.members}
                onSuccess={fetchGroup}
            />

            {/* Invite Member Dialog */}
            <InviteMemberDialog
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                groupId={Number(id)}
                onSuccess={fetchGroup}
            />
        </div>
    );
}

interface GroupStatsProps {
    group: GroupDetail;
}

function GroupStats({group}: GroupStatsProps) {
    const totalGroupSpending = group.expenses.reduce((a, b) => a + b.amount, 0);

    // Calculate Category Spending
    const categoryTotals: Record<string, number> = {};
    group.expenses.forEach(e => {
        const cat = e.category || "OTHER";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
    });

    // Calculate Payer Totals
    const payerTotals: Record<number, { name: string; amount: number }> = {};
    group.members.forEach(m => {
        payerTotals[m.id] = {name: m.name, amount: 0};
    });
    group.expenses.forEach(e => {
        if (payerTotals[e.paidBy.id]) {
            payerTotals[e.paidBy.id].amount += e.amount;
        }
    });

    // Calculate Net Balances from settlements instead of groupBalances
    const memberBalances: Record<number, { name: string; amount: number }> = {};
    group.members.forEach(m => {
        memberBalances[m.id] = {name: m.name, amount: 0};
    });
    // Use groupBalances if available for net balance calculation
    if (group.groupBalances) {
        group.groupBalances.forEach(gb => {
            if (memberBalances[gb.debtor.id]) memberBalances[gb.debtor.id].amount -= gb.amount;
            if (memberBalances[gb.creditor.id]) memberBalances[gb.creditor.id].amount += gb.amount;
        });
    }

    const categoryList = Object.entries(categoryTotals)
        .map(([cat, amount]) => ({
            category: cat,
            amount,
            percentage: totalGroupSpending > 0 ? (amount / totalGroupSpending) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <div className="space-y-6">
            {/* Summary Banner */}
            <div className="p-5 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold text-primary text-xs uppercase tracking-wider">Total Group Spending</h3>
                <p className="text-3xl font-bold mt-1">₹{totalGroupSpending.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Average per member: <span
                    className="font-bold text-foreground">₹{(group.members.length > 0 ? totalGroupSpending / group.members.length : 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spending by Category */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-primary"/>
                            Spending by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {categoryList.length === 0 ? (
                            <div className="text-center py-6 text-sm text-muted-foreground">
                                No spending categories to display.
                            </div>
                        ) : (
                            categoryList.map(({category, amount, percentage}) => {
                                const Icon = getCategoryIcon(category);
                                return (
                                    <div key={category} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Icon className="w-3.5 h-3.5 text-primary"/>
                                                {getCategoryLabel(category)}
                                            </div>
                                            <span className="font-semibold text-xs">
                                                ₹{amount.toFixed(2)} ({percentage.toFixed(0)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{width: `${percentage}%`}}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Who Paid How Much */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary"/>
                            Total Paid per Member
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {Object.values(payerTotals).map(({name, amount}) => {
                            const maxPaid = Math.max(...Object.values(payerTotals).map(p => p.amount));
                            const barPct = maxPaid > 0 ? (amount / maxPaid) * 100 : 0;
                            return (
                                <div key={name} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{name}</span>
                                        <span className="font-semibold text-xs">₹{amount.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full"
                                            style={{width: `${barPct}%`}}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Net Balances */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Net Balances</CardTitle>
                    <p className="text-xs text-muted-foreground">Positive means owed money, negative means owes
                        money</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.values(memberBalances).map(({name, amount}) => {
                            const isPositive = amount > 0;
                            const isZero = Math.abs(amount) < 0.01;
                            return (
                                <div
                                    key={name}
                                    className={`p-3 rounded-lg border
                                        ${isZero
                                        ? "bg-muted/30 border-border text-muted-foreground"
                                        : isPositive
                                            ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                            : "bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                                    }`}
                                >
                                    <span
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{name}</span>
                                    <span className="text-lg font-bold mt-1 block">
                                        {isZero ? "Settled" : `${isPositive ? "+" : "-"}₹${Math.abs(amount).toFixed(2)}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}