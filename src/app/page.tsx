import { auth, signOut } from "@/auth";
import { Header } from "@/components/home/navbar";

export default async function Home() {
  // Ensure the user is authenticated
  const session = await auth();

  console.log("Session:", session);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        {session ? (
          <div className="mt-4">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
              className="mt-4"
            >
              <p className="text-md">
                You are signed in as {session.user.email}.
              </p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <p className="text-lg">You are not signed in.</p>
        )}
      </main>
    </div>
  );
}
