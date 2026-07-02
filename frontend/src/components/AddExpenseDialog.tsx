import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {createExpense, type CreateExpenseRequest, updateExpense} from "@/services/expenseService";
import type {User} from "@/types/User";
import type {ExpenseDetail} from "@/types/ExpenseDetail";
import {Loader2} from "lucide-react";

interface AddExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: number;
    members: User[];
    onSuccess: () => void;
    expense?: ExpenseDetail;
}

export default function AddExpenseDialog({
                                             open,
                                             onOpenChange,
                                             groupId,
                                             members,
                                             onSuccess,
                                             expense
                                         }: AddExpenseDialogProps) {
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [paidByID, setPaidByID] = useState<string>("");
    const [splitType, setSplitType] = useState<string>("EQUAL");
    const [category, setCategory] = useState<string>("OTHER");
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [values, setValues] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            if (expense) {
                setExpenseName(expense.expenseName);
                setAmount(String(expense.amount));
                setPaidByID(String(expense.paidBy.id));
                setSplitType(expense.splitType);
                setSelectedParticipants(expense.splits.map(s => s.user.id));
                setCategory(expense.category || "OTHER");

                const valMap: Record<number, string> = {};
                expense.splits.forEach(s => {
                    if (expense.splitType === "PERCENTAGE" && expense.amount > 0) {
                        const pct = (s.amount / expense.amount) * 100;
                        valMap[s.user.id] = String(Math.round(pct * 100) / 100);
                    } else {
                        valMap[s.user.id] = String(s.amount);
                    }
                });
                setValues(valMap);
            } else if (members.length > 0) {
                setExpenseName("");
                setAmount("");
                setPaidByID(String(members[0].id));
                setSplitType("EQUAL");
                setCategory("OTHER");
                setSelectedParticipants(members.map(m => m.id));
                setValues({});
            }
            setError("");
        }
    }, [open, expense, members]);

    const toggleParticipant = (userId: number) => {
        setSelectedParticipants(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        setError("");
        if (!expenseName.trim() || !amount || !paidByID || selectedParticipants.length === 0) {
            setError("Please fill in all required fields");
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError("Amount must be a positive number");
            return;
        }

        let valuesList: number[] = [];
        if (splitType === "EXACT" || splitType === "PERCENTAGE") {
            valuesList = selectedParticipants.map(id => parseFloat(values[id] || "0"));
            if (valuesList.some(v => isNaN(v))) {
                setError("All values must be valid numbers");
                return;
            }
            if (splitType === "EXACT") {
                const total = valuesList.reduce((a, b) => a + b, 0);
                if (Math.abs(total - amountNum) > 0.01) {
                    setError(`Exact amounts must sum to ${amountNum}. Current sum: ${total.toFixed(2)}`);
                    return;
                }
            }
            if (splitType === "PERCENTAGE") {
                const total = valuesList.reduce((a, b) => a + b, 0);
                if (Math.abs(total - 100) > 0.01) {
                    setError(`Percentages must sum to 100. Current sum: ${total.toFixed(2)}`);
                    return;
                }
            }
        }

        setLoading(true);
        try {
            const data: CreateExpenseRequest = {
                expenseName: expenseName.trim(),
                paidByID: parseInt(paidByID),
                amount: amountNum,
                splitType,
                participantIDs: selectedParticipants,
                values: valuesList,
                category,
            };
            if (expense) {
                await updateExpense(groupId, expense.id, data);
            } else {
                await createExpense(groupId, data);
            }
            onOpenChange(false);
            onSuccess();
        } catch (err) {
            console.error("Failed to save expense", err);
            setError("Failed to save expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setExpenseName("");
        setAmount("");
        setPaidByID("");
        setSplitType("EQUAL");
        setCategory("OTHER");
        setSelectedParticipants([]);
        setValues({});
        setError("");
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) resetForm();
            onOpenChange(isOpen);
        }}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {expense ? "Edit Expense" : "Add Expense"}
                    </DialogTitle>
                    <DialogDescription>
                        {expense ? "Modify the expense details and how it is split." : "Add a new expense to this group and choose how to split it."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Description</label>
                        <Input
                            placeholder="e.g., Dinner at restaurant"
                            value={expenseName}
                            onChange={e => setExpenseName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Amount (₹)</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Paid By</label>
                            <Select value={paidByID} onValueChange={setPaidByID}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map(m => (
                                        <SelectItem key={m.id} value={String(m.id)}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FOOD">Food & Dining</SelectItem>
                                    <SelectItem value="TRAVEL">Travel & Transport</SelectItem>
                                    <SelectItem value="RENT">Rent & Stay</SelectItem>
                                    <SelectItem value="UTILITIES">Utilities & Bills</SelectItem>
                                    <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                                    <SelectItem value="OTHER">Other / Misc</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Split Type</label>
                            <Select value={splitType} onValueChange={setSplitType}>
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EQUAL">Equal Split</SelectItem>
                                    <SelectItem value="EXACT">Exact Amounts</SelectItem>
                                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Participants</label>
                        <div className="space-y-1 max-h-40 overflow-y-auto rounded-md border border-border p-2">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center gap-3">
                                    <label
                                        className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-md cursor-pointer
                                            ${selectedParticipants.includes(member.id) ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedParticipants.includes(member.id)}
                                            onChange={() => toggleParticipant(member.id)}
                                            className="accent-primary"
                                        />
                                        <span className="text-sm font-medium flex-1">{member.name}</span>
                                    </label>
                                    {(splitType === "EXACT" || splitType === "PERCENTAGE") && selectedParticipants.includes(member.id) && (
                                        <Input
                                            type="number"
                                            placeholder={splitType === "PERCENTAGE" ? "%" : "₹"}
                                            className="w-24 h-8 text-sm"
                                            value={values[member.id] || ""}
                                            onChange={e => setValues(prev => ({...prev, [member.id]: e.target.value}))}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                        {expense ? "Save Changes" : "Add Expense"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
