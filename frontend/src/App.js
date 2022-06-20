import Home from "./Component/Home/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {

  return (
  
       <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/:slug" element={<Home/>} />
        </Routes>
      </Router>
  );
}

export default App;
