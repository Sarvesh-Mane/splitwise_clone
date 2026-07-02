import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {deleteExpense, getExpense} from "@/services/expenseService";
import {getGroupDetail} from "@/services/groupService";
import type {ExpenseDetail} from "@/types/ExpenseDetail";
import type {User as UserType} from "@/types/User";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import {ArrowLeft, Edit2, Film, Home, Loader2, Plane, Receipt, Trash2, Utensils, Zap} from "lucide-react";

export const getCategoryIcon = (category: string) => {
    switch (category?.toUpperCase()) {
        case "FOOD":
            return Utensils;
        case "TRAVEL":
            return Plane;
        case "RENT":
            return Home;
        case "UTILITIES":
            return Zap;
        case "ENTERTAINMENT":
            return Film;
        default:
            return Receipt;
    }
};

export const getCategoryLabel = (category: string) => {
    switch (category?.toUpperCase()) {
        case "FOOD":
            return "Food & Dining";
        case "TRAVEL":
            return "Travel & Transport";
        case "RENT":
            return "Rent & Stay";
        case "UTILITIES":
            return "Utilities & Bills";
        case "ENTERTAINMENT":
            return "Entertainment";
        default:
            return "Other / Misc";
    }
};

export default function ExpenseDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState<ExpenseDetail>();
    const [members, setMembers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const fetchExpense = async () => {
        try {
            const data = await getExpense(Number(id));
            setExpense(data);
            fetchGroupMembers(data.groupId);
        } catch (err) {
            console.error("Failed to fetch expense", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupMembers = async (groupId: number) => {
        try {
            const groupData = await getGroupDetail(groupId);
            setMembers(groupData.members);
        } catch (err) {
            console.error("Failed to fetch group members", err);
        }
    };

    useEffect(() => {
        fetchExpense();
    }, [id]);

    const handleDelete = async () => {
        if (!expense || !confirm("Are you sure you want to delete this expense?")) return;
        setDeleting(true);
        try {
            await deleteExpense(expense.groupId, expense.id);
            navigate(`/groups/${expense.groupId}`);
        } catch (err) {
            console.error("Failed to delete expense", err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-6 w-24 bg-muted rounded animate-pulse"/>
                <div className="h-40 bg-muted rounded-lg animate-pulse"/>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="text-center py-16">
                <p className="text-base font-medium text-muted-foreground">Expense not found</p>
            </div>
        );
    }

    const CategoryIcon = getCategoryIcon(expense.category);

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Back link */}
            <Link
                to={`/groups/${expense.groupId}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="w-4 h-4"/>
                Back to group
            </Link>

            {/* Expense Header Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <CategoryIcon className="w-5 h-5 text-white"/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl">{expense.expenseName}</CardTitle>
                                    <Badge variant="outline" className="text-xs">
                                        {getCategoryLabel(expense.category)}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Paid by <span className="font-medium text-foreground">{expense.paidBy.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditOpen(true)}
                            >
                                <Edit2 className="w-4 h-4"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-destructive hover:text-destructive"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="text-2xl font-bold mt-1">₹{expense.amount.toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <p className="text-sm text-muted-foreground">Split Type</p>
                            <Badge className="mt-2">{expense.splitType}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Split Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Split Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Person</TableHead>
                                <TableHead className="text-right">Share</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expense.splits.map((split, index) => {
                                const isPayer = split.user.id === expense.paidBy.id;
                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{split.user.name}</span>
                                                {isPayer && <span className="text-xs text-emerald-500">(paid)</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₹{split.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isPayer ? (
                                                <span
                                                    className="text-sm text-emerald-500 font-medium">Paid ₹{expense.amount.toFixed(2)}</span>
                                            ) : (
                                                <span
                                                    className="text-sm text-rose-500 font-medium">Owes ₹{split.amount.toFixed(2)}</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Expense Dialog */}
            {members.length > 0 && (
                <AddExpenseDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    groupId={expense.groupId}
                    members={members}
                    expense={expense}
                    onSuccess={fetchExpense}
                />
            )}
        </div>
    );
}
