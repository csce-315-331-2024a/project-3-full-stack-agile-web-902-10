"use client";

import { signIn } from 'next-auth/react';

export default function LoginPrompt() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-back drop-shadow-normal duration-500">
            <div className="w-[25em] h-[35em] relative bg-fore rounded-[50px] drop-shadow-normal hover:drop-shadow-highlight duration-500">
                <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center text-back text-5xl font-normal font-['Oxygen Mono']">Login</div>
                <div className="w-[16em] h-[6em] left-1/2 bottom-32 transform -translate-x-1/2 absolute bg-high1 rounded-[50px] drop-shadow-normal hover:drop-shadow-highlight hover:bg-high2 duration-500">
                    <button onClick={() => signIn('google', { callbackUrl: "/menu" })} className="h-full w-full text-back text-xl font-normal">Login with Google</button>
                </div>
            </div>
        </div>
    );
}
