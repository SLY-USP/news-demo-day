import { useState, useEffect } from "react";
import axios from "axios";
import CategorySelector from "./components/CategorySelector";
import NewsList from "./components/NewsList";
import Pagination from "./components/Pagination";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 20;

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // CHANGE THIS URL:
      // Instead of https://newsapi.org/..., use your local /api/news route
      const response = await axios.get(`/api/news`, {
        params: {
          category: category,
          page: currentPage,
          pageSize: PAGE_SIZE,
        },
      });

      const articles = response.data.articles || [];
      setNews(articles);
      setTotalResults(response.data.totalResults || 0);
      setTotalPages(Math.ceil((response.data.totalResults || 0) / PAGE_SIZE));
    } catch (err) {
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, currentPage]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-primary text-primary-content p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">News App</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="mb-6">
          <CategorySelector
            category={category}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="mb-6 text-center">
          <p className="text-lg">Total results: {totalResults}</p>
        </div>
        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && !error && (
          <>
            <NewsList articles={news} />
            {totalPages > 1 && (
              <div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
