import { MessageCircleCode } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-20 chat-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
        <div className="absolute top-40 right-32 w-12 h-12 border-2 border-purple-400/30 rotate-45 animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-32 w-8 h-8 border-2 border-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-20 right-20 w-10 h-10 border-2 border-green-400/30 rotate-45 animate-bounce" style={{ animationDelay: '1s', animationDuration: '9s' }}></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-green-400/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-lg text-center space-y-8 relative z-10">
        {/* Icon Display with 3D effect */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="relative group">
            <div
              className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl transition-all duration-700 hover:scale-110"
              style={{
                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(-15deg) rotateY(15deg) translateY(-10px) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
            >
              <MessageCircleCode className="w-14 h-14 text-white drop-shadow-lg animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl animate-pulse"></div>
            </div>
            <div
              className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-xl animate-bounce"
              style={{
                transform: 'perspective(1000px) rotateX(0deg)',
                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
              }}
            >
              <span className="text-white font-bold text-lg drop-shadow-lg">✨</span>
            </div>
            {/* Additional floating elements */}
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-4 w-4 h-4 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Welcome Text with 3D effect */}
        <div className="space-y-4">
          <h2
            className="text-4xl font-bold text-text-primary drop-shadow-2xl transition-all duration-500 hover:scale-105"
            style={{
              transform: 'perspective(1000px) rotateX(0deg)',
              textShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
            }}
          >
            Welcome to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Yochat</span>
          </h2>
          <p
            className="text-text-secondary text-xl leading-relaxed drop-shadow-lg max-w-md mx-auto"
            style={{
              transform: 'perspective(1000px) rotateX(0deg)',
              textShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
            }}
          >
            Send and receive messages without keeping your phone online.<br />
            Use Yochat on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>

        {/* Feature highlights with 3D cards */}
        <div className="flex justify-center gap-6 mt-12">
          <div
            className="bg-gradient-to-br from-bg-secondary to-bg-tertiary backdrop-blur-xl rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 group relative"
            style={{
              transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-10deg) rotateY(10deg) translateY(-8px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce">💬</div>
            <div className="text-text-primary font-bold text-lg group-hover:text-primary transition-colors duration-300">Real-time Chat</div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div
            className="bg-gradient-to-br from-bg-secondary to-bg-tertiary backdrop-blur-xl rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 group relative"
            style={{
              transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-10deg) rotateY(-10deg) translateY(-8px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce">👥</div>
            <div className="text-text-primary font-bold text-lg group-hover:text-secondary transition-colors duration-300">Group Chats</div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div
            className="bg-gradient-to-br from-bg-secondary to-bg-tertiary backdrop-blur-xl rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 group relative"
            style={{
              transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-10deg) rotateY(10deg) translateY(-8px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce">📱</div>
            <div className="text-text-primary font-bold text-lg group-hover:text-accent transition-colors duration-300">Cross-platform</div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
