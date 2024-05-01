import { useState } from 'react'
import '../NavBar.css'


function NavBar({ user}) {


  return (
    <div className='nav'>
      <img src="src\assets\logobct.png" alt="Central Bank of Tunisia" id='logo_nav'/>
      <div className='account'>
      </div>
    </div>
  )
}

export default NavBar