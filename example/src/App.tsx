import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Index } from "./examples/Index";
import ChatBasic from "@example/chat-basic/src/ChatBasic";
import ChatStreaming from "@example/chat-streaming/src/ChatStreaming";
import FilesImages from "@example/files-images/src/FilesImages";
import RateLimiting from "@example/rate-limiting/src/RateLimiting";
import { WeatherFashion } from "./examples/WeatherFashion";
import RagBasic from "./examples/RagBasic";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <header className="z-50 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
          <nav className="flex gap-4 items-center">
            <Link to="/" className="hover:text-indigo-600">
              <h2 className="text-xl font-semibold accent-text">
                Agent Examples
              </h2>
            </Link>
          </nav>
        </header>
        <main className="flex-1 h-full overflow-scroll">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat-basic" element={<ChatBasic />} />
            <Route path="/chat-streaming" element={<ChatStreaming />} />
            <Route path="/files-images" element={<FilesImages />} />
            <Route path="/rag-basic" element={<RagBasic />} />
            <Route path="/rate-limiting" element={<RateLimiting />} />
            <Route path="/weather-fashion" element={<WeatherFashion />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
