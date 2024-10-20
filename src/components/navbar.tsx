import React from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { handleSignOut } from "@/actions/authActions";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="sticky top-0">
      <div className="border backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 flex justify-between items-center">
          <div>
            <Image
              src="/images/real-echoes_wordmark.png"
              width={200}
              height={50}
              alt="Real Echoes"
            />
          </div>
          <div>
            {session ? (
              <form action={handleSignOut}>
                <Button type="submit" variant="outline">
                  Logout
                </Button>
              </form>
            ) : (
              <Link href="/signin">
                <Button>Signin</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
