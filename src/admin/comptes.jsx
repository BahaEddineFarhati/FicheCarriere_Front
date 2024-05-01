import React, { useEffect, useState, useContext } from 'react';
import { fetchDataWithToken } from '../Code/fetchWithToken';
import { checkLogin } from '../Code/noLogin';
import { ProfileContext } from '../userContext';
import { fetchDataWithoutToken } from '../Code/fetchWithoutToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/NavBar';
import './Style/comptes.css';

function Comptes() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    checkLogin(token);
    let { userData } = useContext(ProfileContext);
    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modifiedUsername, setModifiedUsername] = useState('');
    const [modifiedDepartement, setModifiedDepartement] = useState('');
    const [modifiedRole, setModifiedRole] = useState('');

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
            try {
                const apiUrl = 'http://localhost:9000/Utilisateur/admin/getAll';
                const responseData = await fetchDataWithToken(apiUrl, token);
                setData(responseData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [token]);

    const handleDeleteUser = async (id) => {
        const apiUrl = `http://localhost:9000/Utilisateur/admin/deleteUtilisateur/${id}`;
        // Assuming the deletion was successful, update the data to reflect the changes
        setData(data.filter(item => item.id !== id));
    };

    const toggleModify = (item) => {
        setSelectedUser(item);
        setModifiedUsername(item.username);
        setModifiedDepartement(item.departement.abreviation);
        setModifiedRole(item.role && item.role.nom);
    };

    const handleUsernameChange = (event) => {
        setModifiedUsername(event.target.value);
    };

    const handleDepartementChange = (event) => {
        setModifiedDepartement(event.target.value);
    };

    const handleRoleChange = (event) => {
        setModifiedRole(event.target.value);
    };

    const handleModifyUser = async () => {
        const handleModifyUser = async () => {
            try {
                const apiUrl = `http://localhost:9000/Utilisateuradmin/updateUtilisateur/${selectedUser.id}`;
                const updatedUserData = {
                    username: modifiedUsername,
                    departement: modifiedDepartement,
                    role: modifiedRole
                };
        
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedUserData)
                });
        
                if (!response.ok) {
                    throw new Error('Failed to update user');
                }
        
                // Refresh data after modification
                fetchData();
                // Reset selectedUser and modified fields
                setSelectedUser(null);
                setModifiedUsername('');
                setModifiedDepartement('');
                setModifiedRole('');
            } catch (error) {
                console.error('Error updating user:', error);
            }
        };
        
    };

    return (
        <div>
            <Navbar user={userData} />
            <div className="head_c">
                <h1>Comptes</h1>
                <div className='button_ajt_c' >
                    <h3>Ajouter</h3>
                </div>
            </div>
            {/* Modification panel or form */}
            {selectedUser && (
                <div className='modify_user'>
                    <h1>Modify User</h1>
                    <label>Username:</label>
                    <input type="text" value={modifiedUsername} onChange={handleUsernameChange} />
                    <label>Departement:</label>
                    <input type="text" value={modifiedDepartement} onChange={handleDepartementChange} />
                    <label>Role:</label>
                    <input type="text" value={modifiedRole} onChange={handleRoleChange} />
                    <button onClick={handleModifyUser}>Save Changes</button>
                </div>
            )}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>matricule</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Username</th>
                        <th>Departement</th>
                        <th>Rôle</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.matricule}</td>
                            <td>{item.nom}</td>
                            <td>{item.prenom}</td>
                            <td>{item.username}</td>
                            <td>{item.departement.abreviation}</td>
                            <td>{item.role && item.role.nom}</td>
                            <td>
                                <div id='SeeMore_c' onClick={() => toggleModify(item)}>
                                    <FontAwesomeIcon icon={faPen} />
                                </div>
                            </td>
                            <td>
                                <div id='SeeMore_c' onClick={() => handleDeleteUser(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Comptes;
