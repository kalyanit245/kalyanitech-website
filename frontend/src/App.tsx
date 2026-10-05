import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
