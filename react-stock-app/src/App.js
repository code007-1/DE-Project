import './App.css';
import LandingPage from './components/landing_page'
import StockContext from './context/stock_context';
import { useState } from 'react';

function App() {
  const [stockSymbol, setStockSymbol] = useState("AMZN");

  return (
    <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
      <LandingPage />
    </StockContext.Provider>
  );
}

export default App;