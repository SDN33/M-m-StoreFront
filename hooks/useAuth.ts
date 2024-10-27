// hooks/useAuth.js

import { useEffect, useState } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_WC_API_DOMAIN}/wp-json/les-vins-auth/v1/token/validate`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.success);
                if (!data.success) localStorage.removeItem("jwtToken");
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return isAuthenticated;
};

export default useAuth;
