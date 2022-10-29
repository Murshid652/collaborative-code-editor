import React from "react";
import { useState } from "react";
import Client from "../components/Client.js";
import Editor from "../components/Editor.js";

const EditorPage = () => {
  const [Clients, SetClients] = useState([
    { socketId: 1, UserName: "Rk" },
    { socketId: 2, UserName: "Mfffffffffr" },
    { socketId: 3, UserName: "Mrc" },
  ]);

  return (
    <div className="EditorPage">
      <div className="Sidebar">
        <div className="SidebarPeople">
          <h3>connected</h3>

          <div className="ClientList">
            {
            Clients.map((client) => (
              <Client key={client.socketId} username={client.UserName} />
            ))}

          </div>
        </div>

          <button className="btn copybtn"> Copy Room ID</button>
          <button className="btn leavebtn"> Leave</button>
      </div>

      <div className="Editor">
        <Editor/>
      </div>
    </div>
  );
};

export default EditorPage;
