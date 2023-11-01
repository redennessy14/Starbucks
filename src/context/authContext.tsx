import { AnySoaRecord } from "dns";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useReducer } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ACTIONS_USER, ActionI } from "./helper";

export interface UserI {
  email: string;
  password: string;
  uid: string;
}

interface AuthContextI {
  user: UserI;
  loading: boolean;
  signUp: (email: string, password: string) => void;
  authWithGoogle: () => void;
  signIn: (email: string, password: string) => {};
  logOut: () => {};
}

const authContext = createContext<AuthContextI>({} as AuthContextI);

export const useAuthContext = () => useContext(authContext);

const INIT_STATE = {
  user: null,
  loading: true,
};

function reducer(state = INIT_STATE, action: ActionI) {
  switch (action.type) {
    case ACTIONS_USER.CHECK_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const googleProvider = new GoogleAuthProvider();

  const navigate = useNavigate();

  const checkUser = () => {
    onAuthStateChanged(auth, (user) => {
      dispatch({
        type: ACTIONS_USER.CHECK_USER,
        payload: user,
      });
    });
  };

  useEffect(() => {
    checkUser();
  }, []);

  const authWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {}
  };

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <authContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        signUp,
        signIn,
        authWithGoogle,
        logOut,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
