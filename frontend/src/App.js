import Home from "./Component/Home/Home";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
function App() {

  return (
    
    <div className="App" >
        <Routes>
          <Route path="/:slug" element={<Home/>}>
            {/* <Home path="/welcome" component={Home}/> */}
          </Route>
          <Route path="/" element={<Home/>}>
            {/* <Home path="/welcome" component={Home}/> */}
          </Route>
        </Routes>
    </div>
  );
}

export default App;
