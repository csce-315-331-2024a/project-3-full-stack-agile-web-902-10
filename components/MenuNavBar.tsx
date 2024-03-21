import Link from "next/link";

import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";

export default async function MenuNavBar() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    return (
        <nav className="w-[85%] h-[5em] mt-[1em] mx-auto relative bg-fore rounded-[50px] drop-shadow-normal hover:drop-shadow-highlight duration-500">
            <div className="flex justify-between items-center align-middle">
                <div className="flex-1 m-[1.5em]">
                    {user?.is_manager ? <Link className="px-[1em] py-[0.5em] text-back text-center text-2xl bg-high1 rounded-[50px] drop-shadow-normal hover:drop-shadow-highlight hover:bg-high2 duration-500" href="/manager">Manager</Link> : 
                    <p className="text-back text-center text-2xl">Weather here?</p>}
                </div>
                <div className="flex-1 text-center">
                    {user ? <p className="text-back text-center text-2xl">Welcome, {user.name.split(" ")[0]}</p> : 
                    <p className="text-back text-2xl">Welcome to Rev&apos;s Grill</p>}
                </div>
                <div className="flex-1 text-right m-[1.5em]">
                    {user ? <Link className="px-[1em] py-[0.5em] text-back text-center text-2xl bg-high1 rounded-[50px] drop-shadow-normal hover:drop-shadow-highlight hover:bg-high2 duration-500" href="/logout">Logout</Link> : 
                    <Link className="px-[1em] py-[0.5em] text-back text-center text-2xl bg-high1 rounded-[50px] drop-shadow-normal hover:drop-shadow-highlight hover:bg-high2 duration-500" href="/login">Login</Link>}
                </div>
            </div>
        </nav>

    );
}
