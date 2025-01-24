import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth"; // Ensure this import matches where the Session type is defined

interface HeaderProps {
  session: Session;
}

const Header: FC<HeaderProps> = ({ session }) => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mb-10"
          >
            <Button>Logout</Button>
          </form>
        </li>
          <span className="text-slate-200 mb-10 font-bold">{session?.user?.name}</span>

      </ul>
    </header>
  );
};

export default Header;
