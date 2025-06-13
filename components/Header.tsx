"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import Link from "next/link";

export function Header() {
    const [donationAmount, setDonationAmount] = useState<number>(0);

    async function submitDonation() {
        if (donationAmount <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        try {
            const response = await fetch("/api/donate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount: donationAmount }),
            });

            if (!response.ok) {
                throw new Error("Failed to process donation");
            }

            const data = await response.json();

            window.location.href = data.redirectUrl;
        } catch {
            alert("There was an error processing your donation. Please try again later.");
        }
    }

    return (
        <div className="mx-auto w-full sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/5 3xl:w-1/6 py-6 flex justify-between px-3">
            <h1 className="text-xl font-medium text-center inline">Task.ly</h1>
            <AlertDialog>
                <AlertDialogTrigger className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg text-white ml-4 cursor-pointer justify-self-end">
                    Donate
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogTitle>Support Task.ly</AlertDialogTitle>
                    <label>Donation</label>
                    <Input
                        type="number"
                        placeholder="Enter donation amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(Number(e.target.value))}
                        min="1"
                        max="100000"
                     />
                     <label>Use test Cards/Accounts <Link href="https://developers.maya.ph/reference/sandbox-credentials-and-cards" className="text-blue-500">here</Link></label>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => submitDonation()}>
                                Submit
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}