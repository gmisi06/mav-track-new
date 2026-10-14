import { createContext, useContext, useState, type ReactNode } from "react";

interface StackItem {
  id: string;
  component: ReactNode;
}

interface StackContextType {
  stack: StackItem[];
  push: (item: StackItem) => void;
  pop: () => void;
}

const StackContext = createContext<StackContextType | undefined>(undefined);

export const StackProvider = ({
  children,
  initialView,
}: {
  children: ReactNode;
  initialView: StackItem;
}) => {
  const [stack, setStack] = useState<StackItem[]>([initialView]);

  const push = (item: StackItem) => {
    setStack((prev) => [...prev, item]);
  };

  const pop = () => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <StackContext.Provider value={{ stack, push, pop }}>
      {children}
    </StackContext.Provider>
  );
};

export const useStack = () => {
  const ctx = useContext(StackContext);
  if (!ctx) throw new Error("useStack must be used within a StackProvider");
  return ctx;
};
