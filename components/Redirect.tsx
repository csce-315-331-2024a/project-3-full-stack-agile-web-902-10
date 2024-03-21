"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Redirect({ to }: { to: string }) {
    const router = useRouter();
    React.useEffect(() => {
        router.push(to);
    }, [to, router]);

    return null;
}
