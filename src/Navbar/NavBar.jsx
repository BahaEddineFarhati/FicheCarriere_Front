import { useState } from 'react';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft ,faCircleInfo ,faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


import ProfilCard from './Profil card/profil_card';






function NavBar({ user}) {


  let is_admin = false; 
  const navigate = useNavigate();
  

  const role = user?.role?.nom;

  if(role === "Admin"){
    is_admin = true;
  }


  const clickhandler0 = () => {
    navigate('/');
  }

  const clickhandler1 = () => {
    navigate('/admin/historique');
  }

  const clickhandler2 = () => {
    navigate('/admin/comptes');
  }

  const clickhandler3 = () => {
    navigate('/admin/informations');
  }

  const clickhandler4 = () => {
    navigate('/admin/dashboard');
  }






  return (
    <div className='nav'>
      <img src="/logobct.png" alt="Central Bank of Tunisia" id='logo_nav' onClick={clickhandler0}/>
      {is_admin && (
          <div className="options">
            <ul>
              <li onClick={clickhandler1}>
                <FontAwesomeIcon icon={faClockRotateLeft} className='icon_navbar' />  
                <h3>Historique</h3>
                </li>

              <li onClick={clickhandler2}>
              <FontAwesomeIcon icon={faUser} className='icon_navbar'/>
              <h3>Comptes</h3>
                </li>

              <li onClick={clickhandler3}> 
              <FontAwesomeIcon icon={faCircleInfo} className='icon_navbar'/>
                <h3>Autre Informations</h3>
                </li>

                <li onClick={clickhandler4}> 
                <FontAwesomeIcon icon={faChartLine} className='icon_navbar'/>
                <h3>Dashboard</h3>
                </li>
            </ul>
          </div>
        )}
      <div className='account'>
        <ProfilCard id="profil_card" user={user}/>
      </div>
    </div>
  )
}

export default NavBar