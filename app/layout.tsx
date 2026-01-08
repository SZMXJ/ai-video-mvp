import "./globals.css";
import { UserProvider } from "./context/UserContext";

export const metadata = {
  title: "AI 视频 MVP",
  description: "AI 视频生成演示项目",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
