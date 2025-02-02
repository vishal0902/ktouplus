import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TiptapEditor from './components/Editor'

function App() {
  const [count, setCount] = useState(0)

  return (<div><TiptapEditor /></div>)
}

export default App
