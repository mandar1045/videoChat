import { MessageCircleCode } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 chat-bg">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-success-light flex items-center justify-center">
              <MessageCircleCode className="w-8 h-8 text-success" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-medium text-text-primary">Welcome to Yochat</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Send and receive messages without keeping your phone online.<br />
          Use Yochat on up to 4 linked devices and 1 phone at the same time.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
