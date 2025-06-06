import { auth, signOut } from "@/auth";

export default async function Home() {
  // Ensure the user is authenticated
  const session = await auth();

  console.log("Session:", session);

  return (
    <main>
      <h1>Welcome to the Home Page</h1>
      {session ? (
        <div>
          <p>Welcome back, {session.user.name || "User"}!</p>
          <form>
            <button
              type="button"
              onClick={async () => {
                "use server";
                await signOut();
              }}
            >
              Log Out
            </button>
          </form>
        </div>
      ) : (
        <p>Please log in to access your account.</p>
      )}
    </main>
  );
}
