import React from 'react'
import style from '../styles/layout.module.css'

const Layout = ({ children }) => {
  return (
    <div className={style.container}>
        <div className={style.top}>
            <h3>Audio Streaming</h3>
        </div>

        { children }
        
        <div className={style.footer}>
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam fugit, inventore illum fuga, ullam aspernatur vero recusandae voluptatum enim, ratione nostrum minima hic laborum nemo eum consequatur culpa necessitatibus nesciunt?</h3>
        </div>

    </div>
  )
}

export default Layout