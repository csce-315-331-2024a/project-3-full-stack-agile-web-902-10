import { prisma } from "@/lib/db";
import TestPageClient from "./client_page";
import { getUserSession } from "@/lib/session";
import Redirect from "@/components/Redirect";

export default async function TestPage() {
    // Get the user session info, need this to authenticate to the websocket later
    const user = await getUserSession();
    const user_info = await prisma.users.findUnique({
        where: {
            email: user?.email as string,
        }
    });

    // if your not allowed to be here get outta here
    if (!user_info) {
        return <Redirect to="/menu" />;
    }

    return <TestPageClient user_info={user_info}/>;
}
