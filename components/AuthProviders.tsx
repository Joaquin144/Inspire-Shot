"use client"

import React from 'react';
import {useState, useEffect} from "react";
import {getProviders, signIn} from "next-auth/react";

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
                    <button key={index} onClick={() => signIn(provider?.id)}>{provider.id}</button>
                ))}
            </div>
        )
    }
};

export default AuthProviders;