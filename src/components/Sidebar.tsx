import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Activity, CaretDoubleRight } from "phosphor-react";

import { api } from "~/utils/api";

const Sidebar = () => {
  const { data: session } = useSession({ required: true });
  const [hidden, setHidden] = useState(true);

  const { data: conversations } = api.conversation.getConversations.useQuery();

  return (
    <aside
      className={`bg-main-medium border-main-border absolute inset-y-0 z-50 flex shrink-0 flex-col justify-between border-r bg-white sm:relative ${
        hidden ? "-translate-x-full sm:translate-x-0" : ""
      } duration-100`}
    >
      <div>
        <Link
          className="border-main-border flex items-center gap-2 border-b p-4"
          href="/"
        >
          <Activity size={32} />
          <h1 className="mx-2 text-lg font-bold tracking-tight">PsyVector</h1>
        </Link>
        <div className="border-main-border flex flex-col gap-1 border-b px-2 py-2">
          {conversations?.map((conversation) => (
            <Link
              className="link"
              href={`/${conversation.id}`}
              key={conversation.id}
            >
              <span>{conversation.id}</span>
            </Link>
          ))}
        </div>
      </div>
      {session?.user.image && (
        <div className="relative">
          <div className="border-main-border flex items-center gap-4 border-t px-4 py-4">
            <Image
              src={session?.user.image}
              alt="avatar"
              width={35}
              height={35}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <Link
                className="hover:underline"
                href={`/account/${session.user.id}/settings`}
              >
                {session?.user.name}
              </Link>
              <Link href="/api/auth/signout" className="text-sm opacity-80">
                Sign out
              </Link>
            </div>
          </div>
        </div>
      )}
      <CaretDoubleRight
        size={28}
        className={`text-main-light absolute inset-y-0 right-0 my-auto cursor-pointer ${
          hidden ? "translate-x-full" : "rotate-180"
        } duration-0 sm:hidden`}
        onClick={() => setHidden((prev) => !prev)}
      />
    </aside>
  );
};

export default Sidebar;
