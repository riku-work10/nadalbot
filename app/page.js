"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// ✅ ナダル風アバター（フリー素材 or ナダル本人画像に差し替え可）
const botAvatarUrl = "https://bandresume.s3.ap-northeast-1.amazonaws.com/profile_images/jimeng-2025-06-20-892-%E7%9B%AE%E5%85%83%E4%BB%A5%E5%A4%96%E3%82%82%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E9%A2%A8%E3%81%AB%E3%81%97%E3%81%A6%E3%81%BB%E3%81%97%E3%81%84.jpeg"; // 仮アイコン：坊主の男性風（差し替えOK）

function App() {
  const [input, setInput] = useState("");
  const [isDrunkMode, setIsDrunkMode] = useState(false);

  const nadalIntro = {
    role: "assistant",
    content: `
ナダルやけどぉ〜〜！？呼んだん、君！？  
やっべぇぞ！！クセ強トーク、始めよか！！

【使い方】  
なんでも聞いてくれてええで。答えるかどうかは…ワイの気分やけどな〜〜？笑
「これ、進化させて〜！」って言われたら、
ナダルが独自の“ナダル・リバース・エボリューション”理論で言葉を進化 or 逆進化させて返したる！
進化してるか退化してるかは気にすんな！感じろ！

⚠️【注意】  
・急にキレることあるで？愛やけどな！  
・嘘もつくかも。やっべぇぞ！  
・おもんない質問、スルーするぞ！お前誰やねん！

さぁ、トーク開始や！！
    `.trim(),
  };

  const [messages, setMessages] = useState([nadalIntro]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/nadal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, isDrunk: isDrunkMode }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "API Error");
      }

      const data = await res.json();
      const botMsg = { role: "assistant", content: data.text };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        role: "assistant",
        content: `ナダルやけど、なんかエラー出たわ！やっべぇぞ！→ ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 text-white p-6 flex flex-col items-center font-sans">
  <h1 className="text-3xl font-extrabold mb-4 text-fuchsia-400 tracking-wider drop-shadow-sm">
    今日も一日やっべぇぞ！
  </h1>

  <div className="w-full max-w-xl bg-purple-900/80 backdrop-blur-md shadow-inner rounded-3xl p-4 space-y-4 overflow-y-auto h-[450px] border border-fuchsia-800">
    {messages.map((msg, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex items-end ${
          msg.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {msg.role === "assistant" && (
          <img
            src={botAvatarUrl}
            alt="NadalBot"
            className="w-10 h-10 rounded-full mr-2 border border-purple-500 shadow"
          />
        )}
        <div
          className={`px-4 py-3 max-w-xs rounded-2xl text-sm shadow-md ${
            msg.role === "user"
              ? "bg-fuchsia-600 text-white rounded-br-none"
              : "bg-violet-300 text-purple-900 rounded-bl-none"
          }`}
        >
          {msg.content}
        </div>
      </motion.div>
    ))}
  </div>

  <div className="w-full max-w-xl mt-6 flex flex-col items-center">
    <div className="flex w-full">
      <input
        className="flex-1 px-4 py-3 rounded-l-2xl border border-fuchsia-400 bg-purple-100/80 text-purple-900 placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="ナダルに話しかけてみ？"
      />
      <button
        className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-6 py-3 rounded-r-2xl transition-all duration-300 shadow-md"
        onClick={handleSend}
      >
      送信や！
      </button>
    </div>

    <button
      className={`mt-4 px-6 py-2 rounded-full font-bold transition-all duration-300 shadow ${
        isDrunkMode
          ? "bg-pink-500 hover:bg-pink-600 text-white"
          : "bg-pink-200 hover:bg-pink-300 text-pink-800"
      }`}
      onClick={() => setIsDrunkMode(!isDrunkMode)}
    >
      {isDrunkMode ? "普通のナダルと話す" : "ナダル・リバース・エボリューション"}
    </button>
  </div>
</div>
  );
}

export default App;
