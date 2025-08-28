import React from "react";
import {
     Copy,
     Share2,
     Edit3,
     Users,
     Link,
     ExternalLink,
     Send,
} from "lucide-react";

interface ShareDropdownProps {
     onClose: () => void;
}

const actions: Array<{ icon: React.ReactNode; label: string; color: string }> = [
     { icon: <Copy className="w-4 h-4" />, label: "Copy content", color: "text-pink-500" },
     { icon: <Share2 className="w-4 h-4" />, label: "Quick share", color: "text-orange-500" },
     { icon: <Edit3 className="w-4 h-4" />, label: "Create new post", color: "text-purple-500" },
     { icon: <Users className="w-4 h-4" />, label: "Share with friends", color: "text-indigo-500" },
     { icon: <Users className="w-4 h-4" />, label: "Share to group", color: "text-yellow-500" },
     { icon: <Send className="w-4 h-4" />, label: "Send in message", color: "text-sky-500" },
     { icon: <ExternalLink className="w-4 h-4" />, label: "Open in another app", color: "text-fuchsia-500" },
     { icon: <Link className="w-4 h-4" />, label: "Copy link", color: "text-purple-600" },


];

const ShareDropdown: React.FC<ShareDropdownProps> = ({ onClose }) => {
     return (
          <div className="absolute right-0 mt-58 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-[10000] overflow-hidden">
               {/* Mũi tên nhỏ chỉ xuống */}
               <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>

               <ul className="py-2 max-h-96 overflow-auto">
                    {actions.map((item, idx) => (
                         <li
                              key={idx}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                              onClick={onClose}
                         >
                              <span className={item.color}>{item.icon}</span>
                              <span>{item.label}</span>
                         </li>
                    ))}
               </ul>
          </div>
     );
};

export default ShareDropdown;
