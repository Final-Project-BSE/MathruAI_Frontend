import { SiteHeader } from "../site-header";

const Container = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-pink-200">
      <SiteHeader title={title} />
      <main className="">{children}</main>
    </div>
  );
};

export default Container;
