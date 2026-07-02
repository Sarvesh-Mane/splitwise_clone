import type {Settlement} from "@/types/Settlement";
import {ArrowRight, Banknote} from "lucide-react";

interface SettlementTableProps {
    settlements: Settlement[];
}

export default function SettlementTable({settlements}: SettlementTableProps) {
    if (settlements.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <Banknote className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                <p className="text-base font-medium">All settled up! 🎉</p>
                <p className="text-sm mt-1">No settlements needed</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {settlements.map((settlement, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border"
                >
                    <div className="flex items-center gap-2 flex-1">
                        <div
                            className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-sm font-bold text-rose-500">
                            {settlement.from.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm">{settlement.from.name}</p>
                            <p className="text-xs text-muted-foreground">pays</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-base font-bold text-foreground">₹{settlement.amount.toFixed(2)}</span>
                        <ArrowRight className="w-4 h-4"/>
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="text-right">
                            <p className="font-medium text-sm">{settlement.to.name}</p>
                            <p className="text-xs text-muted-foreground">receives</p>
                        </div>
                        <div
                            className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-sm font-bold text-emerald-500">
                            {settlement.to.name.charAt(0)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
