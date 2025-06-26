import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}
export default function AppProviders({ children }: AppProvidersProps) {
  return <div>{children}</div>;
}
