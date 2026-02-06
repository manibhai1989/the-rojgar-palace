"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Database, Mail, Globe, Save } from "lucide-react";
import ClientOnly from "@/components/shared/ClientOnly";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background text-foreground p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Settings className="w-8 h-8 text-blue-500" />
                        Settings
                    </h1>
                    <p className="text-muted-foreground">Manage your application settings and preferences.</p>
                </header>

                <div className="space-y-6 max-w-4xl">
                    {/* General Settings */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                General Settings
                            </CardTitle>
                            <CardDescription>Configure basic application settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    defaultValue="Sarkari Result Hub"
                                    className="bg-background/50 border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <Input
                                    id="siteDescription"
                                    defaultValue="Your trusted source for government job notifications"
                                    className="bg-background/50 border-border"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-orange-500" />
                                Notifications
                            </CardTitle>
                            <CardDescription>Manage notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="emailNotif">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive email updates for new applications</p>
                                </div>
                                <Switch id="emailNotif" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="pushNotif">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get browser push notifications</p>
                                </div>
                                <Switch id="pushNotif" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Settings */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-500" />
                                Email Configuration
                            </CardTitle>
                            <CardDescription>Configure SMTP settings for email delivery</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="smtpHost">SMTP Host</Label>
                                <Input
                                    id="smtpHost"
                                    placeholder="smtp.example.com"
                                    className="bg-background/50 border-border"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input
                                        id="smtpPort"
                                        placeholder="587"
                                        className="bg-background/50 border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUser">SMTP Username</Label>
                                    <Input
                                        id="smtpUser"
                                        placeholder="user@example.com"
                                        className="bg-background/50 border-border"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                Security
                            </CardTitle>
                            <CardDescription>Manage security and authentication settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                                </div>
                                <Switch id="twoFactor" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="sessionTimeout">Auto Logout</Label>
                                    <p className="text-sm text-muted-foreground">Automatically logout after 30 minutes of inactivity</p>
                                </div>
                                <Switch id="sessionTimeout" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Database Settings */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-cyan-500" />
                                Database
                            </CardTitle>
                            <CardDescription>Database maintenance and backup options</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Automatic Backups</Label>
                                    <p className="text-sm text-muted-foreground">Daily database backups at 2:00 AM</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
                                <Database className="w-4 h-4 mr-2" />
                                Backup Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="outline" className="border-border">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2 text-primary-foreground">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
}
