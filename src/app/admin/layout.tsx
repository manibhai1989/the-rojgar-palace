import { AdminSidebar } from "@/components/admin/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AdminSidebar />
            </div>

            <main className="flex-1 overflow-x-hidden flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden p-4 border-b flex items-center bg-card">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <AdminSidebar />
                        </SheetContent>
                    </Sheet>
                    <span className="font-bold text-lg">Admin Panel</span>
                </header>

                <div className="container mx-auto p-4 md:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
