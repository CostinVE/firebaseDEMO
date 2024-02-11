import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
    try {
        await signOut(auth);
        setCurrentUser(null); // Update currentUser state to null after logout
    } catch (err) {
        console.error(err);
    }
};


    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
            <input placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
            <button onClick={signIn}>Sign In</button>

            {currentUser && currentUser.email && (
                console.log(currentUser.email)
            )}

            <button onClick={signInWithGoogle}>Sign In With Google</button>

            <button onClick={logout}> LogOut </button>
        </div>
    );
};

