import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from "./Component/Home/Home";


function App() {

  return (
       <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
