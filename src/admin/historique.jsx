import React, { useEffect, useState, useContext } from 'react';
import { fetchDataWithToken } from '../Code/fetchWithToken';
import { checkLogin } from '../Code/noLogin';
import { ProfileContext } from '../userContext';
import { fetchDataWithoutToken } from '../Code/fetchWithoutToken';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/NavBar';
import './Style/historique.css';

function Historique() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [hist, setHist] = useState([]);
    const [filteredHist, setFilteredHist] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterNom, setFilterNom] = useState('');
    const [filterMatricule, setFilterMatricule] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    
    checkLogin(token);
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
            const apiUrl = 'http://localhost:9000/Historique/getAllHistoriques';
            const fetchedData = await fetchDataWithToken(apiUrl, token);
            setHist(fetchedData || []);
            setFilteredHist(fetchedData || []);
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filteredData = hist.filter(item => {
            let match = true;
            if (filterDate && !item.date.includes(filterDate)) {
                match = false;
            }
            if (filterNom && !item.nom.toLowerCase().includes(filterNom.toLowerCase())) {
                match = false;
            }
            if (filterMatricule && !item.matricule.toLowerCase().includes(filterMatricule.toLowerCase())) {
                match = false;
            }
            return match;
        });
        setFilteredHist(filteredData);
    }, [filterDate, filterNom, filterMatricule, hist]);

    const toggleWarning = () => {
        setShowWarning(!showWarning);
    };

    const handleDeleteHistoriques = async () => {
        try {
            const deleteUrl = 'http://localhost:9000/Historique/deleteAllHistoriques';
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                // Refresh the historiques after deletion
                setHist([]);
                setFilteredHist([]);
            } else {
                console.error('Failed to delete historiques:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting historiques:', error);
        }
    };

    return (
        <div>
            <Navbar user={userData} />
            {showWarning && <div className='hist_warning'>
                <h3>Attention</h3>
                <p>Vous êtes sur le point de supprimer l'historique. Cette action est irréversible.</p>
                <div className='action_hist'>
                    <button onClick={toggleWarning}>Annuler</button>
                    <button onClick={handleDeleteHistoriques}>Supprimer</button>
                </div>
            </div>}
            <h1 className='hist_title'>Historique</h1>
            <div className="head_hist">
                <div className='sup_btn' onClick={toggleWarning}>
                    <h3>Supprimer</h3>
                </div>
            <div className="filter-container">
                <input type="text" placeholder="Filtrer par date..." value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                <input type="text" placeholder="Filtrer par nom..." value={filterNom} onChange={e => setFilterNom(e.target.value)} />
                <input type="text" placeholder="Filtrer par matricule..." value={filterMatricule} onChange={e => setFilterMatricule(e.target.value)} />
            </div>
            </div>
            <table className="custom-table-hist">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Adresse IP</th>
                        <th>Matricule</th>
                        <th>Département</th>
                        <th>Rôle</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredHist.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.date.substring(0, 10)}</td>
                            <td>{item.date.substring(11, 20)}</td>
                            <td>{item.nom}</td>
                            <td>{item.prenom}</td>
                            <td>{item.adresseIp}</td>
                            <td>{item.matricule}</td>
                            <td>{item.departement}</td>
                            <td>{item.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Historique;
