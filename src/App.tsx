import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='header'>
        <a href='#default' className='logo'>Company Logo</a>
        <div className='header-right'>
          <a className='active' href='#home'>Home</a>
          <a href='#Calendar'> My Calendar</a>
          <a href='#Watchlist'>Watchlist</a>
          <a href='#News'>News</a>
        </div>
      </div>
    </>
  )
}

export default App
