import Sidebar from "~/components/Sidebar";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="bg-main-dark text-main-text absolute inset-0 flex">
        <Sidebar />
        <section className="relative grow">
          <div className="absolute inset-0 w-full overflow-y-auto">
            <article className="mx-auto max-w-5xl p-6">{children}</article>
          </div>
        </section>
      </main>
    </>
  );
};

export default SidebarLayout;
