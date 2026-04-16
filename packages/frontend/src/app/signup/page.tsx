import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Create an account to start shopping.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Name
            </label>
            <Input id="name" type="text" placeholder="Enter your name" required />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-zinc-900 dark:text-zinc-50 underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
