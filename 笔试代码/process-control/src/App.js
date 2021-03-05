import Pipeline from './components/Pipeline'

import { mockData } from './constants'

function App() {
  return (
    <div className="App">
      <Pipeline data={mockData} />
    </div>
  );
}

export default App;
