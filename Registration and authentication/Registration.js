

import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
    const [registrationData, setRegistrationData] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const registerCompany = async () => {
        try {
            const response = await axios.post('http://loalhost:4000/register', {
                companyName: "goMart",
                ownerName: "Geetha Priya",
                rollNo: "1",
                ownerEmail: "geethapriyakps@gmail.com",
                accessCode: "vwYtrN"
            });
            setRegistrationData(response.data);
            console.log('Registration Successful', response.data);
        } catch (error) {
            console.error('Registration Error', error);
        }
    };

    const authenticateCompany = async () => {
        try {
            if (!registrationData) {
                console.error('Register the company first');
                return;
            }
            const { clientID, clientSecret } = registrationData;
            const response = await axios.post('http://localhost:4000/auth', {
                clientID,
                clientSecret
            });
            setAuthToken(response.data.token);
            console.log('Authentication Successful', response.data.token);
        } catch (error) {
            console.error('Authentication Error', error);
        }
    };

    return (
        <div>
            <h1>Company Registration and Authentication</h1>
            <button onClick={registerCompany}>Register Company</button>
            <button onClick={authenticateCompany} disabled={!registrationData}>Authenticate Company</button>
            {registrationData && (
                <div>
                    <h2>Registration Data:</h2>
                    <pre>{JSON.stringify(registrationData, null, 2)}</pre>
                </div>
            )}
            {authToken && (
                <div>
                    <h2>Auth Token:</h2>
                    <pre>{authToken}</pre>
                </div>
            )}
        </div>
    );
};

export default Registration;
