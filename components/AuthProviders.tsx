"use client"

import React from 'react';
import {useState, useEffect} from "react";
import {getProviders, signIn} from "next-auth/react";
import Button from "@/components/Button";

type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | undefined;
}

type Providers = Record<string, Provider>;

const AuthProviders = () => {
    const [providers, setProviders] = useState<Providers | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            //alert(`Providers: ${res}`)
            setProviders(res);
        }

        fetchProviders();
    }, [])

    if (providers) {
        return (
            <div>
                {Object.values(providers).map((provider: Provider, index) => (
                    <Button key={index} handleClick={() => signIn(provider?.id)} title={"Sign In"}/>
                ))}
            </div>
        )
    }
};

export default AuthProviders;