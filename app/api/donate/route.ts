import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();

        if (typeof amount !== "number" || amount <= 0) {
            return new Response("Invalid donation amount", { status: 400 });
        }

        // generate a new donation UUID
        const newDonationId = crypto.randomUUID();

        const paymentResOptions = {
            method: 'POST',
            body: JSON.stringify(
                {
                    totalAmount: {
                        value: amount,
                        currency: "PHP"
                    },
                    redirectUrl: {
                        success: "http://localhost:3000",
                        failure: "http://localhost:3000"
                    },
                    requestReferenceNumber: newDonationId,
                    metadata: {
                        pf: {
                            smn: "ICAREX Donation Portal"
                        }
                    }
                    // configure redirection later on deployment
                }
            ),
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Basic ${btoa(`${process.env.MAYA_PUBLIC_API_KEY}:`)}`
            }
        };

        // call MAYA API
        const paymentRes = await fetch(`${process.env.MAYA_BASE_URL}/checkout/v1/checkouts`, paymentResOptions);

        if (!paymentRes.ok) {
            const errorData = await paymentRes.json();
            console.error("MAYA API error:", errorData);
            return new Response("Failed to process donation", { status: 500 });
        }

        const payload = await paymentRes.json();

        return new Response(JSON.stringify(payload), {status:200});
    } catch (error) {
        console.error("Error processing donation:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}