import { GithubIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
  return (
    <nav className="py-3 bg-secondary">
      <div className="container max-w-7xl flex items-center justify-between">
        <Link
          className="scroll-m-20 text-2xl font-semibold tracking-tight"
          href={"/"}
        >
          Shadcn working hours
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size={"icon"} asChild>
            <a href="https://github.com" target="_blank">
              <GithubIcon className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
