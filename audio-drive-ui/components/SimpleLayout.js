import React from 'react'
import style from '../styles/layout.module.css'

const SimpleLayout = ({ children }) => {

  return (
    <div className="layoutContainer">
      <main className={style.main}>
        {children}
      </main>
    </div>
  )
}

export default SimpleLayout