import { useState } from 'react'

import './App.css'
import AddFile from './components/AddFile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AddFile/>
    </>
  );
}

export default App
