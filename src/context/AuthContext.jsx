import {createContext, useContext, useEffect, useState} from "react";
import {login, logout, onUserStateChange} from "../api/firebase";

const AuthContext = createContext(null);

export function AuthContextProvider({children}) {
  const [user,setUser] = useState();
  
  useEffect(() => {
    //컴포넌트가 마운트 될 때 사용자 상태가 어떤지 판단해서 user 상태에 넣어주기
    onUserStateChange(user => {
      console.log(user);
      setUser(user);
    });
  }, []);
  
  return (
    <AuthContext.Provider value={{user, uid:user && user.uid, login,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuthContext() {
  return useContext(AuthContext);
}
