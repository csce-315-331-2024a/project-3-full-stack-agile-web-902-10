import LoginPrompt from "@/components/LoginPrompt";
import Redirect from "@/components/Redirect";
import { getUserSession } from "@/lib/session";

export default async function LoginPage() {
    // Authorization
    const user = await getUserSession();
    if (user) {
        return <Redirect to="/menu" />;
    }

    return (
        <LoginPrompt />
    );
}
