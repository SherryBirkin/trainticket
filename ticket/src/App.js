import Reducer from "@/Reducer";
import Router from "@/Router";
import "_scssPath/global.scss";

function App() {
  return (
    <Reducer>
      <div className="App">
        <Router/>
      </div>
    </Reducer>
  );
}

export default App;
