import {Outlet} from "react-router-dom";
import {useState} from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreateGroupDialog from "./CreateGroupDialog";

export default function Layout() {
    const [createGroupOpen, setCreateGroupOpen] = useState(false);

    return (
        <div className="min-h-screen">
            <Navbar/>
            <div className="flex">
                <Sidebar onCreateGroup={() => setCreateGroupOpen(true)}/>
                <main className="flex-1 p-6">
                    <Outlet/>
                </main>
            </div>
            <CreateGroupDialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}/>
        </div>
    );
}
