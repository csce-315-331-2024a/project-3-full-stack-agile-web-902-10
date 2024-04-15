import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import CheckoutPage from "@/components/CheckoutPage";
import CheckoutNavBar from "@/components/CheckoutNavBar";

export default async function Checkout() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    return (
        <>
            <CheckoutNavBar username={user?.name} is_manager={user?.is_manager} />
            <CheckoutPage />
        </>
    );
}