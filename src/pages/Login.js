import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db} from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate} from "react-router-dom";

const Login = () => {
    const [ data, setData ] = useState({
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const navigate = useNavigate();

    const { email, password, error, loading } = data;

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({...data, error: null, loading: true});
        if(!email ||  !password){
            setData({...data, error: "All fields are required"});
        }

        try{
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            )
            .catch((err) => {
                if(!err){
                    setData({ email: "", error: err.message, password: "", loading: false});
                }
            });
            

            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true,
            })
            .then(() => {
                setData({ email: "", error: null, password: "", loading: false});
            })
            .catch((err) => {
                setData({...data, error: err.message, loading: false});
            })
            navigate("/");
        }catch(err){}
    }
    return (
        <section>
            <h3>Log In To Your Account</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={handleChange}/>
                </div>
                <div className="input_container">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={handleChange}/>
                </div>
                { error ? <p className="error">{error}</p> : null}
                <div className="btn-container">
                    <button className="btn" disabled={loading}>
                        {loading ? "Logging in to account..." : "Login"}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Login;