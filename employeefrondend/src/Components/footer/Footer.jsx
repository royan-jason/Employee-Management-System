import React from 'react'
import "./Footer.css"

const FooterComponent = () => {
  return (
        <footer className='footer'>
            <span>&copy; {new Date().getFullYear()} Employee Management System. All rights reserved.</span>
        </footer>
  )
}

export default FooterComponent
