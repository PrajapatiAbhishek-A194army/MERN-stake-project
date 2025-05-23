import { useChatStore } from "../../store/useChatStore.js";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletions/MessageSkeleton.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import { formateMessageTime } from "../../lib/utils.js";
const ChatContainer = () => {

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubcribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef=useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubcribeToMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubcribeToMessages,
  ]);


  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader></ChatHeader>
        <MessageSkeleton></MessageSkeleton>
        <MessageInput></MessageInput>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader></ChatHeader>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={messageEndRef}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avtar.jpg"
                      : selectedUser.profilePic || "/avtar.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formateMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput></MessageInput>
    </div>
  );
};
export default ChatContainer;
