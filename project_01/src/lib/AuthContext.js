import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn");
    return storedIsLoggedIn === "true";
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    const parsedUser = storedUser
      ? JSON.parse(storedUser)
      : { userid: "", username: "", role: "", rank: "" };
    return {
      userid: parsedUser.userid || "",
      username: parsedUser.username || "",
      role: parsedUser.role || "",
      rank: parsedUser.rank || "",
    };
  });

  // sessionStorage 동기화
  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", isLoggedIn.toString());
    if (isLoggedIn) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [isLoggedIn, user]);

  const login = (userData) => {
    if (
      userData &&
      typeof userData.userid === "string" && // userid로 변경
      userData.userid.trim() !== "" &&
      typeof userData.username === "string" &&
      userData.username.trim() !== ""
    ) {
      const newUser = {
        userid: userData.userid, // userid 저장
        username: userData.username,
        role: userData.role || "",
        rank: userData.rank || "",
      };
      setUser(newUser);
      setIsLoggedIn(true);
      setIsVerified(false);
      // 디버깅: userData 확인
      console.log("Login userData:", userData);
      console.log("Stored user:", newUser);
    } else {
      console.error("Invalid userData:", userData);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ userid: "", username: "", role: "", rank: "" });
    setIsVerified(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userid: user.userid,
        username: user.username,
        rank: user.rank,
        role: user.role,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isVerified,
        setIsVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
