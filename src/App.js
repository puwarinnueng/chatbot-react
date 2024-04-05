import "./App.css";
// import image from "./img/bot_image.jpg";
import image from "./img/logo_1days.png";
import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import { FormControl } from "@mui/base/FormControl";
import LoadingButton from "@mui/lab/LoadingButton";
// import Divider from '@mui/material/Divider';


function App() {
  const [data, setData] = useState([]);
  // console.log("data", data);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [data]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [data]);

  const [searchvalue, setsearchValue] = useState("");
  const [isload, setIsload] = useState(false);
  const callAPI = async () => {
    const newMessage = { user: "user", text: searchvalue };
    // setData([...data, newMessage])
    setData((prevData) => [...prevData, newMessage]);

    setIsload(true);
    try {
      const response = await axios.get(
        `http://localhost:3333/geminis/?question=${searchvalue}`
      );
      if (response.status === 200) {
        setIsload(false);
        setsearchValue("");
        console.log("api", response.data.output.result);
        const botResponse = {
          user: "bot",
          text: response.data.output.result.response,
        };
        // setData([...data , botResponse])
        setData((prevData) => [...prevData, botResponse]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (event) => {
    if (searchvalue !== "") {
      callAPI();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleinput = (event) => {
    setsearchValue(event.target.value);
  };

  return (
    <div className="App">
      <div className="wrapper">
        <div className="content">
          <div className="header">
            <div className="img">
              <img src={image} alt="" />
            </div>
            <div className="right">
              <div className="name">น้องพอใจ</div>
              <div className="status">
                <Box sx={{ color: "green" }}>ออนไลน์</Box>
              </div>
            </div>
          </div>
          {/* <Divider /> */}
          <Box
            ref={chatContainerRef}
            className="chat-container"
            sx={{
              height: "200px",
              padding: 3,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {data.map((data, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: index % 2 === 0 ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Box
                  sx={{
                    color: index % 2 === 0 ? "black" : "white",
                    bgcolor: index % 2 === 0 ? "#EDECED" : "#074E9F",
                    borderRadius: "8px",
                    padding: "8px",
                    width: "40%",
                  }}
                >
                  {data.text}
                </Box>
              </Box>
            ))}
          </Box>
          <div className="bottom">
            <div className="btm">
              <div className="input">
                <TextField
                  size="small"
                  placeholder="โปรดระบุคำถามของคุณ"
                  value={searchvalue}
                  onChange={(e) => handleinput(e)}
                  onKeyDown={handleKeyPress}
                  disabled={isload}
                  sx={{ justifyContent: "center", height: "20px" }}
                />
              </div>

              <LoadingButton
                onClick={handleSubmit}
                loading={isload}
                loadingPosition="start"
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  width: "100px",
                  height: "50px",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  background: "#074E9F",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1.1em",
                  marginLeft: "10px"
                }}
              >
                ส่ง
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
