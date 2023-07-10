import Link from "next/link";
import Image from "next/image";
import {NavLinks} from "@/constants";
import AuthProviders from "@/components/AuthProviders";
import {getCurrentUser} from "@/lib/session";
import {signOut} from "next-auth/react";

const Navbar = async () => {
    const session = await getCurrentUser();
    return (
        <nav className="flexBetween navbar">
            <div className="flex-1 flexStart gap-10">
                {/*Home Page will have '/' route*/}
                <Link href="/">
                    <Image src="/logo_three.png" alt="Inspire Shot logo" width={226} height={86}/>
                </Link>
                <ul className="xl:flex hidden text-small gap-7">
                    {NavLinks.map((link) => (
                        <Link href={link.href} key={link.key}>
                            {link.text}
                        </Link>
                    ))}
                </ul>
            </div>

            <div className="flexCenter gap-4">
                {session?.user ? (
                    <>
                        {session?.user?.image && (
                            <Link href={`/profile/${session?.user?.id}`}>
                                <Image
                                    src={session.user.image}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    alt={session.user.name}/>
                            </Link>
                        )}
                        <Link href="/create-project">Share Work</Link>
                        <button type="button" className="text-sm" >Sign Out</button>
                    </>
                ) : (
                    <AuthProviders/>
                )}
            </div>
        </nav>
    );
};

export default Navbar;