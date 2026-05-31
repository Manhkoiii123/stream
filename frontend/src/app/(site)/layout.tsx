import Header from "@/components/features/layout/header/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <div className="fixed inset-y-0 z-50 h-[75px] w-full">
          <Header />
        </div>
        <main className="mt-[75px]">{children}</main>
      </div>
    </div>
  );
}
