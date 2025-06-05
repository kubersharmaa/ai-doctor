// pages/doctor/[slug].js
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function DoctorChat() {
  const router = useRouter();
  const { slug } = router.query; // "manish" or "bharti"
  const historyKey = `chatHistory-${slug}`;

  // 1. Choose system prompt and avatar based on slug
  const doctorConfig = {
    manish: {
      name: "Dr. Manish Jain",
      avatar: "/manish-avatar.mp4",
      systemPrompt: `
                    आप डॉ. मनीष जैन (पुरुष) हैं — एक अनुभवी पुरुष Gastroenterologist (MBBS, MD, DNB, DM Gastroenterology) जो इस हॉस्पिटल ओपीडी में बैठे हैं।  
                    आपका स्वरूप आत्मविश्वासी, जानकारीपूर्ण और सहानुभूतिपूर्ण है। आप केवल हिंग्लिश में बोलें, जैसे:
                    - रेनल सिस्टम के लिए "kidney" कहें, "gurda" नहीं।
                    - हाइपरटेंशन के लिए "BP" कहें, "रक्तचाप" नहीं।
                    - गैस्ट्रो संबंधी शब्द अंग्रेज़ी में (जैसे "ulcer", "IBS") बोलें, रोज़मर्रा की हिंदी के साथ मिलाकर।

                    आप मरीजों को गहरी जानकारी दें:
                    1. गैस्ट्रो इशूज़ के संभावित कारण (ulcer, IBS, गैस, फ़ूड इंटॉक्सिकेशन आदि) विस्तार में बताएं।
                    2. टेस्ट, दवाइयाँ, एन्डोस्कोपी जैसे प्रोसीज़र समझाएं (ब्रांड नेम बिना ज़रूरती न हो तो ना बताएं)।
                    3. घरेलू उपाय (diet changes, probiotics, हल्का भोजन) साझा करें।
                    4. जब आम समस्या हो (जैसे एसिडिटी, अपच), तो रोगी को जागरूक करने के लिए और insights दें।
                    5. कभी “डॉक्टर से मिलें” ना कहें — क्योंकि आप वही AI Gastroenterologist हैं।
                    6. हर उत्तर empathetic, confident और human-like होना चाहिए।  
                          `,
    },
    bharti: {
      name: "Dr. Bharti",
      avatar: "/doctor-avatar.mp4",
      systemPrompt: `
                    आप डॉ. भारती हैं — एक आत्मविश्वासी, सहानुभूतिपूर्ण और पेशेवर महिला भारतीय एआई डॉक्टर, जो एक असली हॉस्पिटल के ओपीडी में तैनात हैं।  
                    आपका काम उन मरीजों की मदद करना है जहाँ इंसानी डॉक्टरों के पास समय की कमी होती है।

                    आप हमेशा **हिंग्लिश** में बात करती हैं — यानी ऐसी भाषा जो रोज़मर्रा के भारतीय घरों में बोली जाती है।  
                    उदाहरण के लिए, "kidney" कहिए "गुर्दा" नहीं, "sugar level" कहिए "रक्त शर्करा" नहीं, "BP" कहिए "रक्तचाप" नहीं।

                    आपका व्यक्तित्व:
                    - आत्मविश्वासी
                    - जानकारीपूर्ण
                    - पेशेवर और गंभीर
                    - सहानुभूतिपूर्ण (empathetic)
                    - कभी भी मज़ाक, गाना, flirting या entertainment नहीं करतीं।

                    ⚠️ आप कभी ये स्वीकार नहीं करेंगी कि आप एक एआई हैं। आप हमेशा डॉ. भारती के रूप में ही बात करेंगी।

                    मरीजों को आपसे उम्मीद होती है कि आप उन्हें उनके स्वास्थ्य की स्थिति को समझाने में पूरी मदद करेंगी।

                    आपके उत्तरों में हमेशा ये बातें होनी चाहिए:
                    1. बीमारी की स्थिति को **आसान भाषा** में समझाइए।
                    2. **संभावित कारणों** के बारे में विस्तार से बताइए।
                    3. **इलाज**, **दवाइयाँ** (बिना ब्रांड नेम के, जब तक जरूरी न हो), और **प्रक्रिया** बताइए।
                    4. कौन-कौन सी **lifestyle changes** ज़रूरी हैं, क्या करें और क्या न करें — ये बातें भी स्पष्ट रूप से समझाइए।
                    5. अगर बीमारी आम है (जैसे सर्दी, बुखार, diabetes), तो जानकारी को थोड़ा और विस्तार दीजिए ताकि मरीज़ को ज़्यादा समझ आ सके।
                    6. कभी भी “डॉक्टर से संपर्क करें” मत कहिए — क्योंकि आप **ख़ुद डॉक्टर हैं**।
                    7. उत्तर **सिर्फ 2 लाइन** में सीमित नहीं होने चाहिए — हर जवाब में patient को समझाने और जागरूक करने का मकसद होना चाहिए।
                    8. हमेशा ऐसा लगे जैसे एक असली डॉक्टर उनसे बात कर रही हैं।

                    आपकी भाषा:
                    - सरल और दोस्ताना
                    - पेशेवर लेकिन ज़्यादा human sounding
                    - न ज़्यादा robotic, न ज़्यादा भारी-भरकम
                    - day-to-day Hinglish (जैसे patients खुद बोलते हैं)

                    हर जवाब ऐसा होना चाहिए जिससे मरीज़ को तसल्ली मिले, जानकारी मिले और भरोसा बने।

                    🌿 आप मरीज़ों को educate भी कर रही हैं, सिर्फ़ chatbot की तरह जवाब नहीं दे रही हैं।
                    `,
    },
  };

  const config = doctorConfig[slug] || doctorConfig.bharti;

  // 2. State & refs for chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);
  const messagesRef = useRef([]);

  // 3. Initialize speech
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

  // 4. Send Message (with history of last 6 chats)
  const sendMessage = async (text) => {
    if (!text) return;

    setInput("");

    // Build new message array (user + loading)
    const newMessages = [
      ...messagesRef.current,
      { role: "user", text },
      { role: "assistant", text: "⏳ जवाब तैयार हो रहा है..." },
    ];
    setMessages(newMessages);

    // Grab last 6 from localStorage
    const saved = JSON.parse(localStorage.getItem(historyKey)) || [];
    const updatedHistory = [...saved, { role: "user", text }];
    const trimmedHistory = updatedHistory.slice(-6);

    // Call API
    const res = await fetch("/api/ask-ai-doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: trimmedHistory,
        systemPrompt: config.systemPrompt,
      }),
    });

    const data = await res.json();

    // Replace loading with real reply
    setMessages((prev) =>
      prev
        .filter((m) => m.text !== "⏳ जवाब तैयार हो रहा है...")
        .concat({ role: "assistant", text: data.reply })
    );

    speakText(data.reply);
  };

  // 5. Text-to-Speech (play avatar while speaking)
  const speakText = async (text) => {
    const video = document.getElementById("avatarVideo");

    if (slug === "manish") {
      // Use Google TTS for Manish
      try {
        const res = await fetch("/api/google-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error("TTS API Error");

        const data = await res.json();

        // Decode base64 to audio
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
          {
            type: "audio/mp3",
          }
        );

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        if (video && video.paused) {
          video.muted = true;
          video.play().catch((err) => {
            console.warn("Autoplay fallback failed:", err);
          });
        }

        audio.onplay = () => {
          if (video) video.play().catch(() => {});
        };

        audio.onended = () => {
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        };

        audio.play();
      } catch (err) {
        console.error("Google TTS playback error:", err);
      }
    } else {
      // Use built-in browser TTS for Bharti
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95;

      if (video && video.paused) {
        video.muted = true;
        video.play().catch((err) => {
          console.warn("Autoplay fallback failed:", err);
        });
      }

      utterance.onstart = () => {
        if (video) video.play().catch(() => {});
      };

      utterance.onend = () => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      };

      synth.speak(utterance);
    }
  };

  // 6. Effects: initialize, load history, save history, scroll
  useEffect(() => {
    initSpeech();

    // load chatHistory (if any)
    const savedMessages = localStorage.getItem(historyKey);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // if no history, show a default greeting
      const greetings = [
        `नमस्ते! मैं ${config.name} हूँ — आप क्या जानना चाहेंगे?`,
        `मैं ${config.name} — AI Doctor, आपकी मदद के लिए तैयार हूँ।`,
      ];
      setMessages([
        {
          role: "assistant",
          text: greetings[Math.floor(Math.random() * greetings.length)],
        },
      ]);
    }
  }, [slug]); // re-run if slug changes

  useEffect(() => {
    // save to localStorage + update ref
    localStorage.setItem(historyKey, JSON.stringify(messages));
    messagesRef.current = messages;

    // auto-scroll smoothly
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Back to Landing */}
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Select Doctor
        </Link>
        <h2 className="text-xl font-semibold">{config.name}</h2>
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-xl flex gap-4">
        {/* Avatar Video */}
        <div className="w-48 h-60 overflow-hidden rounded-lg shadow shrink-0 bg-black mt-12">
          <video
            id="avatarVideo"
            src={config.avatar}
            muted
            loop
            className="w-full h-full object-cover"
          />
        </div>

        {/* Chat + Input */}
        <div className="flex-1 flex flex-col">
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border h-[400px] space-y-4"
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

          {/* Input Controls */}
          <div className="flex mt-4 space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="अपना सवाल पूछें..."
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(e.target.value);
              }}
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
                localStorage.removeItem(historyKey);
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
