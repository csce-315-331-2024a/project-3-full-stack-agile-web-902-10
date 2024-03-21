import LogoutPrompt from "@/components/LogoutPrompt";
import Redirect from "@/components/Redirect";
import { getUserSession } from "@/lib/session";

export default async function LoginPage() {
    // Authorization
    const user = await getUserSession();
    if (user === null) {
        return <Redirect to="/menu" />;
    }

    return (
        <LogoutPrompt />
    );
}
