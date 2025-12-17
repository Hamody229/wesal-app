import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#f5f6f8", minHeight: "100vh" }}>
      <Navbar />
      <div className="container py-4">
        {children}
      </div>
    </div>
  );
}
