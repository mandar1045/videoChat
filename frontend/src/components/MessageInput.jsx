import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // handled by store
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  return (
    <div className="px-4 pt-2 pb-3 bg-white border-t" style={{ borderColor: '#d1dae6' }}>
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-2 flex items-center gap-3 px-1">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-xl border shadow-sm"
              style={{ borderColor: '#d1dae6' }}
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={11} />
            </button>
          </div>
          <span className="text-xs" style={{ color: '#6b7a94' }}>Image attached</span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Input pill */}
        <div
          className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all"
          style={{
            background: '#f4f6f9',
            border: '1.5px solid #d1dae6',
          }}
        >
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#0c1f3d' }}
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Attach image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 transition-colors hover:opacity-70"
            title="Attach image"
            style={{ color: imagePreview ? '#c9a84c' : '#6b7a94' }}
          >
            <Image size={18} />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)',
            color: 'white',
          }}
          title="Send (Enter)"
        >
          <Send size={16} />
        </button>
      </form>

      <p className="text-[10px] mt-1.5 px-1" style={{ color: '#b0bcd0' }}>
        Press <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line
      </p>
    </div>
  );
};

export default MessageInput;
