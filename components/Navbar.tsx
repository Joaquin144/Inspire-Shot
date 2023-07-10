import Link from "next/link";
import Image from "next/image";
import {NavLinks} from "@/constants";
import AuthProviders from "@/components/AuthProviders";
import {getCurrentUser} from "@/lib/session";
import {signOut} from "next-auth/react";
import ProfileMenu from "@/components/ProfileMenu";

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
                        <ProfileMenu session = {session}/>
                        <Link href="/create-project">Share Work</Link>
                    </>
                ) : (
                    <AuthProviders/>
                )}
            </div>
        </nav>
    );
};

export default Navbar;