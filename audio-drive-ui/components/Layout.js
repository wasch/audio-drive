import React from 'react'
import style from '../styles/layout.module.css'
import { useSession } from 'next-auth/react'

import Navbar from './Navbar'

const Layout = ({ children }) => {

  return (
    <div className={style.container}>
      
      <Navbar />

      {children}

      <div className={style.footer}>
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam fugit, inventore illum fuga, ullam aspernatur vero recusandae voluptatum enim, ratione nostrum minima hic laborum nemo eum consequatur culpa necessitatibus nesciunt?</h3>
      </div>

    </div>
  )
}

export default Layout