import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

/* ─── Date separator helper ─── */
const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
};

const isSameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

const ChatContainer = () => {
  const {
    messages, getMessages, isMessagesLoading,
    selectedUser, selectedGroup,
    subscribeToMessages, unsubscribeFromMessages,
    subscribeToUserUpdates, unsubscribeFromUserUpdates,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    const chatId = selectedUser?._id || selectedGroup?._id;
    if (chatId) {
      getMessages(chatId);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, selectedGroup?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    subscribeToUserUpdates();
    return () => unsubscribeFromUserUpdates();
  }, [subscribeToUserUpdates, unsubscribeFromUserUpdates]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <ChatHeader />

      {/* ── Message List ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1" style={{ background: '#f8f9fb' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0c1f3d, #1e3a5c)' }}>
              <img src="/yochat-logo.svg" alt="LexConnect" className="w-10 h-10" />
            </div>
            <p className="text-sm font-medium" style={{ color: '#0c1f3d' }}>
              Start your secure consultation
            </p>
            <p className="text-xs" style={{ color: '#6b7a94' }}>🔒 End-to-end encrypted</p>
          </div>
        )}

        {messages.map((message, index) => {
          const isOwn = authUser && message.senderId === authUser._id;
          const prevMsg = messages[index - 1];
          const showDate = !prevMsg || !isSameDay(prevMsg.createdAt, message.createdAt);
          const isLast = index === messages.length - 1;

          /* consecutive messages from same sender — reduce avatar/spacing */
          const nextMsg = messages[index + 1];
          const isLastInGroup = !nextMsg || nextMsg.senderId !== message.senderId;

          const senderPic = selectedUser
            ? selectedUser.profilePic || "/avatar.png"
            : message.senderId?.profilePic || "/avatar.png";

          return (
            <div key={message._id} ref={isLast ? messageEndRef : null}>
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ background: '#d1dae6' }} />
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: '#eaeff5', color: '#6b7a94' }}>
                    {formatDateLabel(message.createdAt)}
                  </span>
                  <div className="flex-1 h-px" style={{ background: '#d1dae6' }} />
                </div>
              )}

              {/* Message row */}
              <div className={`flex items-end gap-2.5 ${isOwn ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-3' : 'mb-0.5'}`}>
                {/* Avatar — only for received, only last in group */}
                {!isOwn && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {isLastInGroup
                      ? <img src={senderPic} alt="avatar" className="w-8 h-8 rounded-full object-cover border" style={{ borderColor: '#d1dae6' }} />
                      : <div className="w-8 h-8" />
                    }
                  </div>
                )}

                <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                  {/* Group sender name */}
                  {selectedGroup && !isOwn && isLastInGroup && (
                    <p className="text-[11px] font-semibold mb-1 px-1" style={{ color: '#6b7a94' }}>
                      {message.senderId?.fullName}
                    </p>
                  )}

                  {/* Bubble */}
                  <div
                    className="px-4 py-2.5 shadow-sm"
                    style={{
                      background: isOwn
                        ? 'linear-gradient(135deg, #0c1f3d, #1a3a5c)'
                        : 'white',
                      color: isOwn ? 'white' : '#0c1f3d',
                      borderRadius: isOwn
                        ? (isLastInGroup ? '20px 20px 4px 20px' : '20px 20px 20px 20px')
                        : (isLastInGroup ? '20px 20px 20px 4px' : '20px 20px 20px 20px'),
                      border: isOwn ? 'none' : '1px solid #d1dae6',
                      wordBreak: 'break-word',
                      lineHeight: '1.45',
                    }}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[220px] rounded-xl mb-2 shadow-sm"
                      />
                    )}
                    {message.text && <p className="text-sm leading-snug">{message.text}</p>}
                  </div>

                  {/* Time + read receipt */}
                  {isLastInGroup && (
                    <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px]" style={{ color: '#94a3b8' }}>
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {isOwn && (
                        <span className="text-[10px] font-semibold" style={{ color: '#c9a84c' }}>✓✓</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
