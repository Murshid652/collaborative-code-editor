import React, { useState } from "react";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [RoomId, SetRoomId] = useState("");
  const [UserName, SetUserName] = useState("");

  const CreateNewRoom = (e) => {
    const id = v4();
    SetRoomId(id);
    toast.success("created a new room");
  };

  const JoinRoom = () => {
    if (!RoomId || !UserName) {
      toast.error("RoomId and Username are required");
      return;
    }

    navigate("/editor/" + RoomId, {
      state: {
        UserName,
      },
    });
  };

  const handleInputEnter = (e) => {
    console.log("event", e.code);
    if (e.code === "Enter") {
      JoinRoom();
    }
  };

  return (
    <div className="HomePage">
      <div className="Form">
        <h4 className="FormLabel">Enter Room Id and Username</h4>

        <div className="FormInputs">
          <input
            className="InputBox"
            placeholder="ROOM ID"
            value={RoomId}
            onChange={(e) => SetRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            className="InputBox"
            placeholder="USERNAME"
            value={UserName}
            onChange={(e) => SetUserName(e.target.value)}
            onKeyUp={handleInputEnter}
          />

          <div className="buttons">
            <button className="btn Joinbtn" onClick={JoinRoom}>
              Join
            </button>
            <button className="btn Create" onClick={CreateNewRoom}>
              New Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
