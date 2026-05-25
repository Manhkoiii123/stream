import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
interface AuthWrapperProps {
  heading: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}
const AuthWrapper = ({
  children,
  heading,
  backButtonHref,
  backButtonLabel,
}: PropsWithChildren<AuthWrapperProps>) => {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-[450px]">
        <CardHeader className="flex-row items-center justify-center gap-x-4">
          <Image src={"/images/logo.svg"} alt="" width={40} height={40} />
          <CardTitle>{heading}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="-mt-2">
          {backButtonLabel && backButtonHref && (
            <Button variant={"ghost"} className="w-full">
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthWrapper;
