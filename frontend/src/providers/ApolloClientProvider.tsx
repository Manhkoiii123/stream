"use client";
import { ApolloProvider } from "@apollo/client/react";
import React, { PropsWithChildren } from "react";
import { client } from "../lib/apollo-client";

export default function ApolloClientProvider({
  children,
}: PropsWithChildren<unknown>) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
