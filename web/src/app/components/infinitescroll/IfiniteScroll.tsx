import React, { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
     children: React.ReactNode;
     loader?: React.ReactNode;
     skeleton?: React.ReactNode;
     fetchMore: () => void;
     hasMore: boolean;
     loading?: boolean;
     endMessage?: React.ReactNode;
     className?: string;
     root?: Element | null;
     rootMargin?: string;
     threshold?: number;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
     children,
     loader,
     skeleton,
     fetchMore,
     hasMore,
     loading = false,
     endMessage,
     className = "",
     root = null,
     rootMargin = "0px",
     threshold = 0.5,
}) => {
     const loaderRef = useRef<HTMLDivElement | null>(null);
     const lastTriggerTsRef = useRef(0);
     const observerRef = useRef<IntersectionObserver | null>(null);
     const pendingRef = useRef(false);

     const handleIntersect = useCallback(
          (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
               const target = entries[0];
               if (!target.isIntersecting) return;
               if (!hasMore || loading || pendingRef.current) return;

               const now = Date.now();
               if (now - lastTriggerTsRef.current < 300) return; // debounce 300ms

               lastTriggerTsRef.current = now;
               pendingRef.current = true;

               // Tạm ngắt observe để tránh spam trong lúc fetch
               if (loaderRef.current) {
                    observer.unobserve(loaderRef.current);
               }

               fetchMore();
          },
          [fetchMore, hasMore, loading]
     );

     // Khi loading kết thúc, cho phép trigger lần tiếp theo và re-observe sentinel
     useEffect(() => {
          if (!loading) {
               pendingRef.current = false;
               if (observerRef.current && loaderRef.current) {
                    // reattach observer to sentinel for next page
                    observerRef.current.observe(loaderRef.current);
               }
          }
     }, [loading]);

     useEffect(() => {
          if (!loaderRef.current || !hasMore) return;

          if (observerRef.current) {
               observerRef.current.disconnect();
          }

          const observer = new IntersectionObserver(
               (entries) => handleIntersect(entries, observer),
               {
                    root,
                    rootMargin,
                    threshold,
               }
          );

          observerRef.current = observer;

          if (loaderRef.current) {
               observer.observe(loaderRef.current);
          }

          return () => {
               observer.disconnect();
          };
     }, [handleIntersect, root, rootMargin, threshold, hasMore]);


     return (
          <div className={className}>
               {children}
               <div ref={loaderRef}>
                    {hasMore && (loading || pendingRef.current) && skeleton}
                    {hasMore && !loading && !pendingRef.current && loader}
                    {!hasMore && !loading && endMessage}
               </div>
          </div>
     );
};

export default InfiniteScroll;
