
      import React, { useState } from 'react';
      import './LoginForum.css';
      import { useNavigate } from 'react-router-dom';


      function LoginForum() { 
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();
    
      const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setError(''); // Clear previous errors when user starts typing
      };
    
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(''); // Clear previous errors when user starts typing
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
      
        try {
          const response = await fetch('http://localhost:9000/Utilisateur/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
      
          if (!response.ok) { // Handle non-2xx status codes
            if (response.status === 401) {
              setError('Username or password is incorrect');
            } else {
              setError('An error occurred during authentication (status code: ' + response.status + ').');
            }
          } else { // Successful authentication (assuming response.ok is true)
            const user_data = await response.json();
            console.log('Authentication successful:', user_data);
            localStorage.setItem('token', user_data.token);
            navigate('/', { state : user_data });
          }
        } catch (error) {
          console.error('Authentication error:', error.message);
          setError('An unexpected error occurred. Please try again later.'); // More user-friendly error message
        }
      };
    
      return (
        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit" className='login_button'>Login</button>
          </form>
        </div>
      );
        }

      export default LoginForum;