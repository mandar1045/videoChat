import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();

  return (
    <div className="h-[calc(100vh-64px)] mt-16">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {!selectedUser && !selectedGroup ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
