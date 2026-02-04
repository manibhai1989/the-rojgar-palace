"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, QrCode as QrIcon } from "lucide-react";
import { toast } from "sonner";
import { useQRCode } from "next-qrcode";

export function TwoFactorSetup() {
    const { data: session } = useSession();
    const { Canvas } = useQRCode();

    const [step, setStep] = React.useState<"INITIAL" | "SCAN" | "VERIFY" | "SUCCESS">("INITIAL");
    const [isLoading, setIsLoading] = React.useState(false);
    const [secret, setSecret] = React.useState("");
    const [otpauth, setOtpauth] = React.useState("");
    const [token, setToken] = React.useState("");

    const generateSecret = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
            const data = await res.json();

            setSecret(data.secret);
            setOtpauth(data.otpauth);
            setStep("SCAN");
        } catch (error) {
            toast.error("Failed to generate secret");
        } finally {
            setIsLoading(false);
        }
    };

    const verifyToken = async () => {
        if (token.length !== 6) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/2fa/verify", {
                method: "POST",
                body: JSON.stringify({ token })
            });

            if (res.ok) {
                setStep("SUCCESS");
                toast.success("Two-Factor Authentication Enabled!");
            } else {
                toast.error("Invalid Code. Please try again.");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === "SUCCESS") {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-green-50 rounded-xl border border-green-200">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">2FA is Active</h3>
                <p className="text-green-600 text-center">Your account is now secured with two-factor authentication.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 border rounded-xl bg-card">
            <div>
                <h3 className="text-lg font-bold flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Two-Factor Authentication
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Add an extra layer of security to your account.
                </p>
            </div>

            {step === "INITIAL" && (
                <Button onClick={generateSecret} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Setup 2FA Now
                </Button>
            )}

            {step === "SCAN" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg border shadow-sm">
                        <Label className="mb-4 font-bold text-muted-foreground">Scan this QR Code</Label>
                        <Canvas
                            text={otpauth}
                            options={{
                                errorCorrectionLevel: 'M',
                                margin: 3,
                                scale: 4,
                                width: 200,
                                color: {
                                    dark: '#000000',
                                    light: '#FFFFFF',
                                },
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="token">Enter Verification Code</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="token"
                                placeholder="000000"
                                maxLength={6}
                                className="text-center text-lg tracking-widest font-mono"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <Button onClick={verifyToken} disabled={isLoading || token.length !== 6}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
