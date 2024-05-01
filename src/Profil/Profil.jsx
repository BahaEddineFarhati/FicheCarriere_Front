import React, { useEffect, useState ,useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/NavBar';
import { fetchDataWithToken } from '../Code/fetchWithToken';
import { checkLogin } from '../Code/noLogin';
import { ProfileContext } from '../userContext';
import './profil.css';
import { useNavigate } from 'react-router-dom';
import { fetchDataWithoutToken } from '../Code/fetchWithoutToken';

const Profil = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [details , setDetails ] = useState([]);
    const [projets , setProjets] = useState([]);
    const token = localStorage.getItem('token');
    checkLogin(token);
    const navigate = useNavigate();
    let { userData } = useContext(ProfileContext);

    const [user, setUser] = useState([]);
    if (userData == null) {
        useEffect(() => {
            try {
                const fetchData = async () => {
                    const apiUrl = 'http://localhost:9000/Utilisateur/auth/GetUser?token=' + token;
                    const fetchedData = await fetchDataWithoutToken(apiUrl);
                    setUser(fetchedData || []);
                };

                fetchData();
            } catch (error) {
                navigate('/login');
            }
        }, []);

        userData = user;
    }


    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = 'http://localhost:9000/Employe/getEmployeProfilBaseInfo/' + id;
            const fetchedData = await fetchDataWithToken(apiUrl, token);
            setData(fetchedData || []);
        };

        fetchData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = "http://localhost:9000/EmployeProjet/dto/" + id;
            const fetchedData = await fetchDataWithToken(apiUrl, token);
            setProjets(fetchedData || []);
        };

        fetchData();
    }, []);




    useEffect(() => {
      const fetchData = async () => {
        let apiUrl; // Initialize to avoid potential errors
  
        if (userData && userData.role && userData.role.nom === 'Rh') {
          apiUrl = 'http://localhost:9000/Employe/getEmployeRhInfo/' + id; // Replace with your RH API endpoint
        } else if (userData && userData.role && userData.role.nom === 'Admin') {
          apiUrl = 'http://localhost:9000/Employe/admin/getEmploye/' + id; // Replace with your admin API endpoint
        }
        else if(userData && userData.role && userData.role.nom === 'Projet') {
            apiUrl = "http://localhost:9000/Employe/getEmployeProjetInfo/" + id;
        }
        else {
          // Handle case where role is neither 'Rh' nor 'admin' (optional: display message, redirect, etc.)
          console.warn('Unrecognized user role:', userData?.role?.nom);
          return; // Exit the useEffect hook if role is not recognized
        }
  
        const fetchedData = await fetchDataWithToken(apiUrl, token);
        setDetails(fetchedData || []);
      };
  
      fetchData();
    }, [userData]); // Dependency array ensures useEffect runs when userData changes
  


    if (!data || !data.formationUniv || !data.fonction) {
      return (
        <div>
          <Navbar user={userData} />
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      );
    }

    const { formationUniv, fonction } = data;

    const formattedDate = new Date(data.dateDeNaissance).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <div>
            <Navbar user={userData} />
            <div className='profil_content'>
                <div className='base_content'>
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Profil image" className='avatar_image' />
                    <h2 id='nom'>{data.nom} {data.prenom}</h2>
                    <div className='det'>
                    <h2 className="text_profil">Matricule : <span>{data.matricule}</span></h2>
                    <h2 className="text_profil">Email : <span>{data.email}</span></h2>
                    <h2 className="text_profil">Date de Naissance : <span>{formattedDate}</span></h2>
                    <h2 className="text_profil">Numero de telephone : <span>{data.numeroTelephone}</span></h2>
                    <h2 className="text_profil">Adresse : <span>{data.adresse}</span></h2>
                    <h2 className="text_profil">Departement : <span>{data.departement?.nom}</span></h2>
                    </div>
                </div>
                <div className="details">
                    <h2>Information d'employé(e)</h2>
                    <table className="custom-table">
                        <tbody>
                            <tr>
                                <th colSpan="8">Formation Universitaire</th>
                            </tr>
                            <tr>
                                <td className='h_text' colSpan="2">Type:</td>
                                <td>{formationUniv.type}</td>
                                <td className='h_text'>Nom de Diplome:</td>
                                <td>{formationUniv.nomDuDiplome}</td>
                                <td colSpan="2" className='h_text'>Date d'Obtention:</td>
                                <td colSpan="2">{new Date(formationUniv.dateDobtention).toLocaleDateString()}</td>
                            </tr>
                            <br />
                            <tr>
                                <th colSpan="8">Fonction</th>
                            </tr>
                            <tr>
                                <td colSpan="2" className='h_text'>Nom:</td>
                                <td colSpan="2">{fonction.nom}</td>
                                <td colSpan="2" className='h_text'>Date:</td>
                                <td colSpan="2">{new Date(fonction.date).toLocaleDateString()}</td>
                            </tr>

                            <br />

                            
                        </tbody>
                    </table>
                            <tr>
                                {details.publications && details.publications.length === 0 && <p>Aucune Publication trouvée</p>}
                                {details.publications && details.publications.length > 0 && (
                                    <div>
                                        <table className="custom-table">
                                            <thead>
                                            <tr>
                                                <th colSpan="8">Publications</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {details.publications.map((publication) => (
                                                    <tr key={publication.id}>
                                                        <td colSpan="1" className='h_text'>Nom</td>
                                                        <td colSpan="2">{publication.nom}</td>
                                                        <td colSpan="1" className='h_text'>Lien</td>
                                                        <td colSpan="2"><a href={"https://" + publication.lien}>{publication.lien}</a></td>
                                                        <td colSpan="1" className='h_text'>Date</td>
                                                        <td colSpan="2">{new Date(publication.date).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )    
                                }

                            </tr>
                            


                    <div>
            <br />
            {((details.disponibilitePourDesMissionALEtranger) || details.disponibilitePourDesMissionALEtranger === false )   && <hr />}
            <div>
                {((details.disponibilitePourDesMissionALEtranger) || details.disponibilitePourDesMissionALEtranger === false )   && <h3>Disponibilité</h3>}
                <div className='dispo'>
                {details.disponibilitePourDesMissionALEtranger && (<p>● Disponibilite Pour Des Mission ALEtranger : <span>oui</span></p>)}
                </div>
                <div className='dispo'>
                {details.disponibilitePourDesMissionALEtranger === false && (<p>● Disponibilite Pour Des Mission A l'étranger : <span>non </span></p>)}
                </div>

                <div className='dispo'>
                {details.disponibilitePourDesChangementsDePoste && (<p>● Disponibilite Pour Des Changements De Poste : <span>oui</span></p>)}
                </div>
                <div className='dispo'>
                {details.disponibilitePourDesChangementsDePoste === false && (<p>● Disponibilite Pour Des Changements De Poste : <span>non </span></p>)}
                </div>

                <div className='dispo'>
                {details.disponibilitePourDesDeplacements && (<p>● Disponibilite Pour Des Deplacements : <span>oui</span></p>)}
                </div>
                <div className='dispo'>
                {details.disponibilitePourDesDeplacements === false && (<p>● Disponibilite Pour Des Deplacements : <span>non </span></p>)}
                </div>

                {(details.responsabilite || details.recompenceEtReconnaissance) && <hr />}
                {details.responsabilite && <h3>Responsabilité</h3>}
                {details.responsabilite && <div className="data_block">
                    <h4>{details.responsabilite}</h4>
                    </div>}

                {details.recompenceEtReconnaissance && <h3>Recompence et Reconnaissance</h3>}
                {details.recompenceEtReconnaissance && <div className="data_block">
                    <h4>{details.recompenceEtReconnaissance}</h4>
                    </div>}    
                    {(userData.role.nom === "Admin" || userData.role.nom === "Rh" || userData.role.nom === "Projet" ) && <div><br /> <hr /></div>}  
                    {(userData.role.nom === "Admin" || userData.role.nom === "Rh" || userData.role.nom === "Projet" ) && <h3>Formations</h3>}
                    {details.formations && details.formations.length === 0 && <p>Aucune Formation trouvée</p>}
                    {details.formations && details.formations.length > 0 && (
                        <div>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Sujet</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.formations.map((formation) => (
                                        <tr key={formation.id}>
                                            <td>{formation.nom}</td>
                                            <td>{formation.sujet}</td>
                                            <td>{formation.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
 
                {(userData.role.nom === "Admin" || userData.role.nom === "Projet" ) &&  
                <div>
                <br />
                <hr />
                <h3>Projets</h3>
                {projets && projets.length === 0 && <p>Aucun Projet trouvé</p>}
                {projets && projets.map((projet) => (
                <div key={projet.id}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>description</th>
                                <th>role dans le Projet</th>
                                <th>date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{projet.nom}</td>
                                <td>{projet.description}</td>
                                <td>{projet.roleProjet}</td>
                                <td>{projet.date.substring(0, 10)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
            ))}
            </div>}

            {(userData.role.nom === "Admin" || userData.role.nom === "Rh" || userData.role.nom === "Projet" ) && <div><br /> <hr /></div>}  
            {(userData.role.nom === "Admin" || userData.role.nom === "Rh" || userData.role.nom === "Projet" ) && <h3>Compétences Informatiques</h3>}
            {details.competenceInformatique && details.competenceInformatique.length === 0 && <p>Aucune Compétence informatique trouvée</p>}
                    {details.competenceInformatique && details.competenceInformatique.length > 0 && (
                        <div className='data_block'>

                                    {details.competenceInformatique.map((competence) => (
                                        <h4> ● {competence.nom}</h4>
                                    ))}
                        </div>
                    )}

             
            {(userData.role.nom === "Admin" || userData.role.nom === "Rh" || userData.role.nom === "Projet" ) && <h3>Compétences Techniques</h3>}
            {details.competenceTechnique && details.competenceTechnique.length === 0 && <p>Aucune Compétence technique trouvée</p>}
                    {details.competenceTechnique && details.competenceTechnique.length > 0 && (
                        <div className="data_block">

                                    {details.competenceTechnique.map((competence) => (
                                        <h4> ● {competence.nom}</h4>
                                    ))}
                        </div>
                    )}


{(userData.role.nom === "Admin" || userData.role.nom === "Rh") && <div><br /> <hr /></div>}  
            {(userData.role.nom === "Admin" || userData.role.nom === "Rh" ) && <h3>Niveau linguistique</h3>}
                    {details.niveauLangueFrancais && (
                        <div className='dispo'>
                            <p>● Francais : <span>{details.niveauLangueFrancais}</span></p>
                        </div>
                    )}      

                        {details.niveauLangueAnglais && (
                        <div className='dispo'>
                            <p>● Anglais : <span>{details.niveauLangueAnglais}</span></p>
                        </div>
                    )}    
            


            </div>
            
        </div>

                </div>
            </div>
        </div>
    );
};

export default Profil;
