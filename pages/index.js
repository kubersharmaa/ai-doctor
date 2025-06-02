import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);
  const messagesRef = useRef([]); // for reliable access to latest messages

  // MAIN sendMessage function
  const sendMessage = async (text) => {
    if (!text) return;
    setInput("");

    // Add user + loading message
    const newMessages = [
      ...messagesRef.current,
      { role: "user", text },
      { role: "assistant", text: "⏳ जवाब तैयार हो रहा है..." },
    ];
    setMessages(newMessages);

    // Get last 6 from localStorage for context
    const saved = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const updatedHistory = [...saved, { role: "user", text }];
    const trimmedHistory = updatedHistory.slice(-6);

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: trimmedHistory }),
    });

    const data = await res.json();

    // Replace loading with actual reply
    setMessages((prev) =>
      prev
        .filter((m) => m.text !== "⏳ जवाब तैयार हो रहा है...")
        .concat({ role: "assistant", text: data.reply })
    );

    speakText(data.reply);
  };

  const speakText = (text) => {
    const video = document.getElementById("avatarVideo");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    video.play();
    utterance.onend = () => video.pause();
    window.speechSynthesis.speak(utterance);
  };

  const initSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice input not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);
    recognition.onerror = () => setRecognizing(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognitionRef.current = recognition;
  };

  useEffect(() => {
    // Save to localStorage on every messages change
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    messagesRef.current = messages; // keep ref updated
  }, [messages]);

  useEffect(() => {
    initSpeech(); // initialize speech

    // Load chat history from localStorage if available
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ role: "assistant", text: "⏳ जवाब तैयार हो रहा है..." }]);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]); // Runs every time messages change

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-xl flex gap-4">
        <div className="w-48 h-60 overflow-hidden rounded-lg shadow shrink-0 bg-black mt-12">
          <video
            id="avatarVideo"
            src="/doctor-avatar.mp4"
            muted
            loop
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">
            AI Doctor - हेल्थ सहायक
          </h1>
          <div
            ref={chatRef}
            className="h-[400px] overflow-y-auto bg-gray-50 p-4 rounded-lg border space-y-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[75%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-100 self-end ml-auto"
                    : "bg-green-100 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex mt-4 space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="अपना सवाल पूछें..."
              className="flex-1 border border-gray-300 rounded px-4 py-2"
            />
            <button
              onClick={() => recognitionRef.current?.start()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {recognizing ? "🎙️..." : "🎤"}
            </button>
            <button
              onClick={() => sendMessage(input)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
            <button
              onClick={() => {
                setMessages([]);
                localStorage.removeItem("chatHistory");
              }}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
