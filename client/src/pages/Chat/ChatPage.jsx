import { useEffect, useState } from "react";

import axios from "axios";

import io from "socket.io-client";

import Sidebar from "../../layouts/Sidebar";

const socket = io("http://localhost:5000");

const ChatPage = () => {

    const [messages, setMessages] = useState([]);

    const [text, setText] = useState("");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const room = "general";

    useEffect(() => {

        fetchMessages();

        socket.emit("joinRoom", room);

        socket.on("receiveMessage", (message) => {

            setMessages((prev) => [...prev, message]);

        });

        return () => {
            socket.off("receiveMessage");
        };

    }, []);

    // FETCH OLD MESSAGES
    const fetchMessages = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:5000/api/chat/${room}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    // SEND MESSAGE
    const sendMessage = async () => {

        if (!text.trim()) return;

        try {

            const token =
                localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/api/chat",
                {
                    text,
                    room,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            socket.emit(
                "sendMessage",
                res.data
            );

            setText("");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">

            {/* SIDEBAR */}
            <div className="hidden md:block fixed h-screen">
                <Sidebar setSidebarOpen={setSidebarOpen} />
            </div>

            {sidebarOpen && (
                <div className="fixed z-50 md:hidden">
                    <Sidebar setSidebarOpen={setSidebarOpen} />
                </div>
            )}

            {/* MAIN */}
            <div className="flex-1 md:ml-64 p-6 flex flex-col">

                <h1 className="text-3xl font-bold mb-6">
                    Team Chat
                </h1>

                {/* CHAT BOX */}
                <div className="flex-1 bg-white rounded-2xl shadow border p-5 overflow-y-auto space-y-4">

                    {messages.map((msg) => (

                        <div
                            key={msg._id}
                            className="bg-gray-100 rounded-xl p-4"
                        >

                            <div className="flex justify-between mb-1">

                                <h3 className="font-semibold">
                                    {msg.sender?.name}
                                </h3>

                                <span className="text-xs text-gray-500">
                                    {new Date(
                                        msg.createdAt
                                    ).toLocaleTimeString()}
                                </span>

                            </div>

                            <p className="text-gray-700">
                                {msg.text}
                            </p>

                        </div>
                    ))}

                </div>

                {/* INPUT */}
                <div className="mt-5 flex gap-3">

                    <input
                        type="text"
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        placeholder="Type message..."
                        className="flex-1 border rounded-xl px-4 py-3"
                    />



                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl"
                    >
                        Send
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ChatPage;