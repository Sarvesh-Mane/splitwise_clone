import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Link} from "react-router-dom";
import type {Group} from "../types/Group";
import {ArrowRight, Users} from "lucide-react";

interface GroupCardProps {
    group: Group;
}

export default function GroupCard({group}: GroupCardProps) {
    return (
        <Link to={`/groups/${group.id}`} className="block">
            <Card className="hover:border-primary/30 cursor-pointer">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                                <Users className="w-4 h-4 text-white"/>
                            </div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {group.members.slice(0, 4).map((member) => (
                                <div
                                    key={member.id}
                                    className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-bold text-muted-foreground"
                                    title={member.name}
                                >
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {group.members.length > 4 && (
                                <div
                                    className="w-7 h-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-xs font-bold text-primary">
                                    +{group.members.length - 4}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {group.members.length} {group.members.length === 1 ? "member" : "members"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
