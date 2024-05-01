import React from 'react';
import './profil_card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ProfilCard = ({user}) => {


const default_img = "https://www.w3schools.com/howto/img_avatar.png"


const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}


    return (
        <>
        {user && Object.keys(user).length !== 0 && (
          <div className="profil-card">
            <img 
              src={user.img ? user.img : default_img}
              alt="Profil_Img"
              id='profil_image' />
            <div className='user'>
              <h2>{user?.nom + " " + user?.prenom}</h2>
              <h3>{user?.role?.nom}</h3>
            </div>
            <img src="\devider.png" alt="" id='profil_card_devider'/>
            <FontAwesomeIcon icon={faRightFromBracket} id='logout_icon'onClick={logout}/>
          </div>
        )}
      </>
    );
};

export default ProfilCard;