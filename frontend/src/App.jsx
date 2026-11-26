import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Analyze from "./pages/Analyze";
import Result from "./pages/Result";
import History from "./pages/History";

const NotFound = () => (
  <div className="py-24 text-center">
    <h1 className="text-2xl font-semibold">Page not found</h1>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <Routes>
          <Route path="/" element={<Analyze />} />
          <Route path="/analysis/:id" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
