import { AuthContext } from "../context/auth";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login";

const PrivateRoute = () => {
    const { user } = useContext(AuthContext);

    return ( 
      user ? <Outlet/> : <Login/>
    )
};

export default PrivateRoute;