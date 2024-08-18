import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";

function NameInput() {
  const { setUserName, userName, userId } = useUserContext();

  return (
    <input
      className="border rounded-md p-2 h-10 my-2 w-full"
      placeholder="Enter your name"
      onChange={(e) => setUserName(e.target.value)}
      value={userName}
    />
  );
}

export default NameInput;
