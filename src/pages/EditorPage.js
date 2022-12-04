import React, { useEffect } from "react";
import { useState } from "react";
import Client from "../components/Client.js";
import Editor from "../components/Editor.js";
import ACTIONS from "../ACTIONS.js";
import { useRef } from "react";
import { initSocket } from "../socket.js";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "axios";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [Clients, setClients] = useState([]);
  const { RoomId } = useParams();
  console.log(RoomId);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("Socket Error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        RoomId,
        UserName: location.state?.UserName,
      });

      //listening for join event

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, UserName, socketID }) => {
          if (UserName !== location.state?.UserName) {
            toast.success(UserName + " joined the Room");
            console.log(UserName, " joined");
          }
          setClients(clients);
          // console.log(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketID,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, UserName }) => {
        toast.success(UserName + " left the room.");
        setClients((prev) => {
          return prev.filter((client) => client.socketID !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(RoomId);
      toast.success("Room Id copied");
    } catch (err) {
      toast.error("Could not copy Room Id");
    }
  }

  async function leaveRoom() {
    reactNavigator("/");
  }

  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);

  function compile() {
    setLoading(true);

    var Code=codeRef.current;

    if (Code === ``) {
      return;
    }

    Axios.post(`http://localhost:5000/compile`, {
      code: Code,
      language: "cpp",
      input: userInput,
    })
      .then(
        (res) => {
          if (res.data.output) {
            setUserOutput(res.data.output);
          } else {
            toast.error("Network error in compilation");
            setUserOutput(res.data);
          }
        }
        // console.log(codeRef.current)
      )
      .catch((error) => {
        console.log("error", error);
      })
      .then(() => {
        setLoading(false);
      });
  }

  function clearOutput() {
    setUserOutput("");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="EditorPage">
      <div className="Sidebar">
        <div className="SidebarPeople">
          <h2 className="connClients">CONNECTED</h2>

          <div className="ClientList">
            {Clients.map((client) => (
              <Client key={client.socketID} username={client.UserName} />
            ))}
          </div>
        </div>

        <button className="btn copybtn" onClick={copyRoomId}>
          {" "}
          Copy Room ID
        </button>
        <button className="btn leavebtn" onClick={leaveRoom}>
          {" "}
          Leave
        </button>
      </div>

      <div className="Editor">
        <Editor
          socketRef={socketRef}
          RoomId={RoomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />

        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea
              id="code-inp"
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
            <button className="btn std-input-btn" onClick={() => compile()}>
              Run
            </button>
          </div>
          <h4>Output:</h4>
          {loading ? (
            <pre><h4>LOADING...</h4></pre>
          ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>
              <button
                onClick={() => {
                  clearOutput();
                }}
                className="btn clear-btn"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
