// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const user = localStorage.getItem('user');
//         if (!user) {
//             window.location.reload();
//             navigate('/auth/sign-in', { replace: true });
//         }
//     }, [navigate]);

//     return children;

// };

// export default PrivateRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('user');
    return (
        <>
            {isAuthenticated ? (
                children
            ) : (
                <Navigate to="/auth/sign-in" replace />
            )}
        </>
        
    );
};

export default PrivateRoute;