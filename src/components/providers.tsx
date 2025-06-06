import { ThemeProvider } from "./theme-provider";
import { Session } from "next-auth";
import { SessionProvider } from "./auth-provider";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session || null}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
