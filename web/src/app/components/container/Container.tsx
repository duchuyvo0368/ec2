import React, { FC, ReactNode } from 'react';


interface ContainerProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const Container: FC<ContainerProps> = ({ sidebar, children }) => (
  <div className="flex w-full h-screen overflow-hidden gap-5 mt-2 " >
    {/* Sidebar - luôn cố định và cuộn độc lập */}
    <aside className="w-[240px] h-full overflow-y-auto border-r border-gray-200">
      {sidebar}
    </aside>

    {/* Nội dung chính - cuộn nội dung khi dài */}
    <main className="flex-1 gap-10 h-full overflow-y-auto bg-gray-50 mb-8" >
      {children}
    </main>
  </div>
);

export default Container;


