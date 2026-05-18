"use client";

import { useFindChannelByUsernameQuery } from "@/graphql/generated/output";

export default function Home() {
  const { data, loading } = useFindChannelByUsernameQuery({
    variables: {
      username: "silentblade",
    },
  });
  return <div className="">{JSON.stringify(data)}</div>;
}
