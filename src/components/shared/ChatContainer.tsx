import { SiteHeader } from "../site-header";

const ChatContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="h-screen flex flex-col bg-[#fed2cc]">
      <SiteHeader title={title} />
      <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
    </div>
  );
};

export default ChatContainer;
