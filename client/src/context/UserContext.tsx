import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from 'uuid';

interface UserValue {
    userId: string;
    userName: string;
    setUserName: (userName: string) => void;
}

export const UserContext = createContext<UserValue>({
    userId: "",
    userName: "",
    setUserName: (userName) => {},
});

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [userId] = useState(uuidV4());
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );

/*     useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    useEffect(() => {
        sessionStorage.setItem("userId", userId);
    }, [userId]);
 */
    return (
        <UserContext.Provider value={{ userId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext=()=>{
    const userContext = useContext(UserContext)
    return userContext
}