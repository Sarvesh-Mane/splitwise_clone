import {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import type {Expense} from "@/types/Expense";
import {useNavigate} from "react-router-dom";
import {Filter, Receipt, Search} from "lucide-react";
import {getCategoryIcon, getCategoryLabel} from "@/pages/ExpenseDetailPage";
import {Input} from "./ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";

interface ExpenseTableProps {
    expenses: Expense[];
}

export default function ExpenseTable({expenses}: ExpenseTableProps) {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedPayer, setSelectedPayer] = useState("ALL");

    if (expenses.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                <p className="text-base font-medium">No expenses yet</p>
                <p className="text-sm mt-1">Add your first expense to get started</p>
            </div>
        );
    }

    const uniquePayers = Array.from(new Map(expenses.map(e => [e.paidBy.id, e.paidBy])).values());

    const filtered = expenses.filter(e => {
        const matchesSearch = e.expenseName.toLowerCase().includes(search.toLowerCase()) ||
            e.paidBy.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "ALL" || e.category === selectedCategory;
        const matchesPayer = selectedPayer === "ALL" || String(e.paidBy.id) === selectedPayer;

        return matchesSearch && matchesCategory && matchesPayer;
    });

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search description or payer..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Filter className="w-3.5 h-3.5"/>
                        <span>Filter:</span>
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[140px] h-9 text-xs">
                            <SelectValue placeholder="Category"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            <SelectItem value="FOOD">Food & Dining</SelectItem>
                            <SelectItem value="TRAVEL">Travel & Transport</SelectItem>
                            <SelectItem value="RENT">Rent & Stay</SelectItem>
                            <SelectItem value="UTILITIES">Utilities & Bills</SelectItem>
                            <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                            <SelectItem value="OTHER">Other / Misc</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedPayer} onValueChange={setSelectedPayer}>
                        <SelectTrigger className="w-[130px] h-9 text-xs">
                            <SelectValue placeholder="Payer"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Payers</SelectItem>
                            {uniquePayers.map(p => (
                                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Expenses Table */}
            {filtered.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
                    <Search className="w-6 h-6 mx-auto mb-2 opacity-40"/>
                    <p className="text-sm font-medium">No expenses match your filters</p>
                </div>
            ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Paid By</TableHead>
                                <TableHead>Split Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(expense => {
                                const CategoryIcon = getCategoryIcon(expense.category);
                                return (
                                    <TableRow
                                        key={expense.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => navigate(`/expenses/${expense.id}`)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                                                    <CategoryIcon className="w-3.5 h-3.5 text-primary"/>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{expense.expenseName}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {getCategoryLabel(expense.category)}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{expense.paidBy.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground">
                                                {expense.splitType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-sm">
                                            ₹{expense.amount.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}