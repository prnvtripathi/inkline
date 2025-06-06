import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import AuthGradient from "./gradient";
import SignInButton from "./oauth-button";
import CredentialsForm from "./credentials-form";

interface LoginFormProps extends React.ComponentProps<"div"> {
  variant?: "login" | "register";
}

export function LoginForm({
  className,
  variant = "login",
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <section className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  {variant === "login"
                    ? "Login to your account"
                    : "Create a new account"}
                </p>
              </div>
              <CredentialsForm variant={variant} />
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SignInButton method="github" />
                <SignInButton method="google" />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {variant === "login" ? (
                  <p>
                    Don&apos;t have an account?{" "}
                    <a
                      href="/signup"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </a>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                      Login
                    </a>
                  </p>
                )}
              </div>
            </div>
          </section>
          <div className="bg-muted relative hidden md:block">
            <AuthGradient />
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
