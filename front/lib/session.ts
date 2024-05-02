import { User, getServerSession } from "next-auth";

/**
 * Updates the session object with additional user information from the token.
 * @param session - The session object.
 * @param token - The token object containing user information.
 * @returns The updated session object.
 */
export const session = async ({ session, token }: any) => {
    session.user.id = token.id;
    session.user.tenant = token.tenant;
    return session;
}

/**
 * Retrieves the user session from the server.
 * @returns A Promise that resolves to the User object if the session exists, or null otherwise.
 */
export const getUserSession = async (): Promise<User | null> => {
    const authUserSession = await getServerSession({
        callbacks: {
            session
        }
    });
    if (!authUserSession) {
        return null;
    }
    return authUserSession.user;
}
