import React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      {/* <DashboardHeader /> */}

      <main className="">{children}</main>
    </div>
  );
}
