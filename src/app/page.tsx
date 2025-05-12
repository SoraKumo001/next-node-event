"use client";
import { useRef, useSyncExternalStore } from "react";

export default function Page() {
  const storeCtx = useRef({
    subscribe: (onStoreChange: () => void) => {
      storeCtx.onStoreChange = onStoreChange;
      return () => {};
    },
    onStoreChange: () => {},
    ref: (node: HTMLDivElement | null) => {
      if (node) {
        storeCtx.subscribe = () => {
          const observer = new ResizeObserver(() => {
            storeCtx.data = {
              width: node.offsetWidth,
              height: node.offsetHeight,
            };
            storeCtx.onStoreChange();
          });
          observer.observe(node);
          return () => observer.disconnect();
        };
        storeCtx.data = {
          width: node.offsetWidth,
          height: node.offsetHeight,
        };
        storeCtx.onStoreChange();
      }
    },
    data: { width: 0, height: 0 },
  }).current;
  const data = useSyncExternalStore(
    storeCtx.subscribe,
    () => storeCtx.data,
    () => storeCtx.data
  );
  return (
    <div className="whitespace-pre" ref={storeCtx.ref}>
      {JSON.stringify(data, null, 4)}
    </div>
  );
}
