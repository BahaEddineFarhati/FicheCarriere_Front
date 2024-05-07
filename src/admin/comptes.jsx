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
    const { userData, setUserData } = useContext(ProfileContext);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modifiedUsername, setModifiedUsername] = useState('');
    const [modifiedRole, setModifiedRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [warning, setWarning] = useState(false);
    const [itemDelete, setItemDelete] = useState(null);
    const [addC_panel, setAddC_panel] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [newUser, setNewUser] = useState({
        id: '',
        username: '',
        password: '',
        role: { 
            id:''
        }
    });

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

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const apiUrl = 'http://localhost:9000/Role/getAll';
                const responseData = await fetchDataWithToken(apiUrl, token);
                setRoles(responseData);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, [token]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const apiUrl = 'http://localhost:9000/Employe/getEmployesInfoBase';
                const responseData = await fetchDataWithToken(apiUrl, token);
                setEmployees(responseData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, [token]);

    const handleDeleteUser = async (id) => {
        const apiUrl = `http://localhost:9000/Utilisateur/admin/deleteUtilisateur/${id}`;
      
        try {
          const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}` // Include token in Authorization header
            },
          });
      
          if (!response.ok) {
            // Handle non-200 status codes
            throw new Error(`API request failed with status ${response.status}`);
          }
      
          // Assuming no data needs to be returned from the server after deletion:
          setData(data.filter(item => item.id !== id));
          setItemDelete(null);
          setWarning(false);
      
          console.log('User successfully deleted'); // Optional success message
      
        } catch (error) {
          console.error('Error deleting user:', error);
          // Handle errors appropriately, e.g., display an error message to the user
        }
      };
      

    const toggleModify = (item) => {
        if (item.id === userData.id) {
            alert('Tu ne peux pas modifier ton propre compte !');
            return;
        }
        setSelectedUser(item);
        setModifiedUsername(item.username);
        setModifiedRole(item.role && item.role.id);
    };

    const handleUsernameChange = (event) => {
        setModifiedUsername(event.target.value);
    };

    const handleRoleChange = (event) => {
        setModifiedRole(event.target.value);
    };

    const handleModifyUser = async () => {
        try {
            const apiUrl = `http://localhost:9000/Utilisateur/admin/updateUtilisateur/${selectedUser.id}`;
            const updatedUserData = {
                'username': modifiedUsername,
                'role': {
                    'id' : modifiedRole }
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
            // Reset selectedUser and modified fields
            setSelectedUser(null);
            setModifiedUsername('');
            setModifiedRole('');
            window.location.reload();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const closePanel = () => {
        setSelectedUser(null);
        setModifiedUsername('');
        setModifiedRole('');
    }

    const handleWarning = (item) => {
        if(warning){
            setWarning(false);
            setItemDelete(null);
        }
        else{
            setItemDelete(item);
            setWarning(true);
        }
    }

    const handleAddC = () => {
        setAddC_panel(!addC_panel);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "role") {
            setNewUser({
                ...newUser,
                role: {
                    id: value
                }
            });
        } else {
            setNewUser({
                ...newUser,
                [name]: value
            });
        }
    };

    const handleAddUser = async () => {
        try {
            const apiUrl = `http://localhost:9000/Utilisateur/admin/addUtilisateur`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            // Refresh data after adding
            window.location.reload();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div>
            <Navbar user={userData} />
            <div className="head_c">
                <h1>Comptes</h1>
                <div className='button_ajt_c' onClick={handleAddC}>
                    <h3>Ajouter</h3>
                </div>
            </div>
            {warning &&  <div className="supp_comp">
                <h1>Supprimer un compte</h1>
                <div className='warning_c'>
                        <h3>Attention !</h3>
                        <p>Vous êtes sur le point de supprimer un compte, cette action est irréversible.</p>
                        <div id='suppComp_warn_btn'>
                            <button onClick={() => handleWarning(null)}>Annuler</button>
                            <button onClick={() => handleDeleteUser(itemDelete.id)}>Supprimer</button>
                        </div>
                </div>
            </div>}
            <div>
                {addC_panel && (
                    <div className='addC_panel'>
                        <label>Employee:</label>
                        <select name="id" value={newUser.id} onChange={handleInputChange}>
                            <option value="">Select Employee</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>{employee.nom} {employee.prenom}</option>
                            ))}
                        </select>
                        <label>Username:</label>
                        <input type="text" name="username" value={newUser.username} onChange={handleInputChange} />
                        <label>Password:</label>
                        <input type="password" name="password" value={newUser.password} onChange={handleInputChange} />
                        <label>Role:</label>
                        <select name="role" value={newUser.role.id} onChange={handleInputChange}>
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nom}</option>
                            ))}
                        </select>
                        <button onClick={handleAddUser}>Ajouter</button>
                        <button onClick={handleAddC}>Annuler</button>
                    </div>
                )}
            </div>
            {selectedUser && (
                <div className='modify_user'>
                    <h1>Modify User</h1>
                    <label>Username:</label>
                    <input type="text" value={modifiedUsername} onChange={handleUsernameChange} />
                    <label>Role:</label>
                    <select value={modifiedRole} onChange={handleRoleChange}>
                        {roles.map(role => (
                            <option key={role.id} value={role.id} selected={modifiedRole === role.id}>{role.nom}</option>
                        ))}
                    </select>
                    <button onClick={handleModifyUser}>Enregistrer</button>
                    <button onClick={closePanel}>Fermer</button>
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
                                <div id='SeeMore_c' onClick={() => handleWarning(item)}>
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
