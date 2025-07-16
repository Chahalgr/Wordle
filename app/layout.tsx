import { Provider } from "@/components/ui/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style = {{background:'white'}}><Provider>{children}</Provider></body>
    </html>
  );
}
