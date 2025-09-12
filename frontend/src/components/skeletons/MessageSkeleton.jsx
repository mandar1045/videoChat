const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className="flex items-end gap-2 max-w-[85%]">
            {idx % 2 === 0 && (
              <div className="size-10 rounded-full bg-gray-400 animate-pulse" />
            )}
            <div className="flex flex-col">
              <div className="mb-1">
                <div className="h-4 w-16 bg-gray-400 rounded animate-pulse" />
              </div>
              <div className="p-3 rounded-xl">
                <div className="h-16 w-[200px] bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
