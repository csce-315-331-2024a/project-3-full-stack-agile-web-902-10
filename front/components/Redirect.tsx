"use client";

import { useRouter } from "next/navigation";
import React from "react";

/**
 * Redirects the user to the specified URL.
 * @param {string} to - The URL to redirect to.
 * @returns {null} - Returns null.
 */
export default function Redirect({ to }: { to: string }) {
    const router = useRouter();
    React.useEffect(() => {
        router.push(to);
    }, [to, router]);

    return null;
}
