import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BaseModalWrapper from './AuthModal/BaseModalWrapper'

function App() {
  const [count, setCount] = useState(0)

  const [isModalVisible, setIsModeVisable] = useState(false)

  const toggleModal = () => {
    setIsModeVisable(wasModeVisable => !wasModeVisable)
  }

  return (
    <>
      <div className="header">
        <a href='#default' className='logo'>Company Logo</a>
        <div className='header-right'>          
          <a className='active' href='#home'>Home</a>
          <a href='#Calendar'> My Calendar</a>
          <a href='#Watchlist'>Watchlist</a>
          <a href='#News'>News</a>
          <div className="header-wrap">
            <button onClick={toggleModal}>Logout</button>
            <BaseModalWrapper isModalVisible={isModalVisible} onBackdropClick={toggleModal}/>
          </div>
        </div>
      </div>
      
    </>
  )
}

export default App
