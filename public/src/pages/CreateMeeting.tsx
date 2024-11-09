import React, { useState, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAppSelector } from "./redux";

const appId = 1044134370;
const serverSecret = "1ae8e04c89553561675c96cd5da2cc02";

const JoinMeeting: React.FC = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const username = useAppSelector((zoom) => zoom.userInfo.userInfo?.username);
  const [meetingCode, setMeetingCode] = useState("");
  const validCode = "123456"; // Set your valid meeting code here

  // Function to generate a valid user ID by allowing only alphanumeric characters
  const generateValidUserId = (username: string) => {
    const fallbackUserId = `user-${Math.floor(Math.random() * 10000)}`;
    return username && /^[a-zA-Z0-9]+$/.test(username)
      ? username
      : fallbackUserId;
  };

  // Use the sanitized userId
  const userId = generateValidUserId(username!);

  // Function to handle joining the meeting
  const myMeeting = async (element: any) => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      meetingCode, // Using the meeting code as the room ID
      userId, // Use sanitized user ID
      username // Replace with actual user name logic
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      maxUsers: 50,
      sharedLinks: [
        {
          name: "Personal Link",
          url: window.location.origin,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  // Function to check if user-provided code is valid
  const handleJoin = () => {
    if (meetingCode === validCode) {
      setIsAllowed(true);
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      {!isAllowed ? (
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Enter Meeting Code</h2>
            <input
              type="text"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              placeholder="Enter code"
              className="input input-bordered w-full mb-4"
            />
            <button onClick={handleJoin} className="btn btn-primary">
              Join Meeting
            </button>
          </div>
        </div>
      ) : (
        <div className="myCallContainer w-full h-screen" ref={myMeeting}></div>
      )}
    </div>
  );
};

export default JoinMeeting;
