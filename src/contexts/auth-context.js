import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import nookies, { parseCookies } from "nookies";
import Cookies from "js-cookie";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

function getCookie(name) {
  let cookieValue = null;
  if (window.document.cookie && window.document.cookie !== "") {
    const cookies = window.document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      let cookie = Cookies.get("isAuthenticated");

      isAuthenticated = cookie == "true";
    } catch (err) {
      console.error(err);
    }

    console.log(isAuthenticated);

    if (isAuthenticated) {
      try {
        const userSession = window.localStorage.getItem("user");
        const user = JSON.parse(userSession);

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } catch (err) {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
        console.error(err);
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      const user = response.data;

      window.localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
    } catch (error) {
      throw new Error("Invalid email or password");
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/logout",
        {
          withCredentials: true,
        }
      );
      window.localStorage.removeItem("user");
      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    }catch(err){
      console.error(err);
    }


    
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
