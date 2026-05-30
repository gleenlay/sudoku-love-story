"use client";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Ошибка входа:", e);
    }
  };

  if (loading) return <div className="screen">Загрузка... 💖</div>;

  if (!user) {
    return (
      <div className="screen">
        <HeartsBackground />
        <div className="card">
          <h1>💗 Sudoku: A Love Story</h1>
          <p className="subtitle">Войдите, чтобы начать историю ✨</p>
          <button className="start-btn" onClick={login}>Войти через Google</button>
        </div>
        <Styles />
      </div>
    );
  }

  if (started) return <AppFlow name={name} city={city} />;

  return (
    <div className="screen">
      <HeartsBackground />
      <div className="card">
        <h1>💗 Sudoku: A Love Story</h1>
        <p className="subtitle">введите вашу историю ✨</p>

        <input placeholder="Имя" onChange={(e) => setName(e.target.value)} value={name} />
        <input placeholder="Город" onChange={(e) => setCity(e.target.value)} value={city} />

        <button
          className="music-btn"
          onClick={() => {
            if (audio) return;
            const a = new Audio("/back.mp3");
            a.loop = true;
            a.volume = 0.7;
            a.play().catch(() => {});
            setAudio(a);
          }}
        >
          🎵 Включить музыку
        </button>

        <button
          className="start-btn"
          onClick={() => setStarted(true)}
          disabled={!name || !city}
        >
          Начать историю 💕
        </button>
      </div>
      <Styles />
    </div>
  );
}

/* ================= КОМПОНЕНТ СЕРДЕЧЕК ================= */
function HeartsBackground() {
  return (
    <div className="hearts">
      {Array.from({ length: 20 }).map((_, i) => (
        <span 
          key={i} 
          style={{ 
            left: `${Math.random() * 100}%`, 
            animationDuration: `${5 + Math.random() * 5}s`, 
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${16 + Math.random() * 20}px` 
          }}
        >
          {["💗", "💖", "💞", "💘", "💓"][i % 5]}
        </span>
      ))}
    </div>
  );
}

/* ================= APP FLOW ================= */

function AppFlow({ name, city }) {
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState("STORY");
  const [fade, setFade] = useState(true);

  const transitionTo = (newPhase, newLevel = level) => {
    setFade(false);
    setTimeout(() => {
      setLevel(newLevel);
      setPhase(newPhase);
      setFade(true);
    }, 1000);
  };

  const handleGameComplete = () => {
    if (level === 4) {
      transitionTo("FINAL");
    } else {
      transitionTo("STORY", level + 1);
    }
  };

  const scenesData = {
    1: { images: ["/katok.png"], text: "Алуа впервые встала на коньки, несмело разглядывая, как яркие огни отражаются на блестящем льду. Вокруг шумно проносились люди, что немного пугало, но, крепко держась за бортик, она ловила равновесие и всем телом чувствовала бодрящий холод катка." },
    2: { images: ["/second.png"], text: "В какой-то момент ноги предательски разъехались, и Алуа полетела на лед, но не успела она расстроиться, как услышала незнакомый голос, и чья-то крепкая рука — как оказалось, известного фигуриста Каната — уверенно помогла ей подняться." },
    3: { images: ["/third1.png", "/third2.png"], text: "Они начали быстро сближаться: на катке Канат терпеливо учил её держать равновесие и делать первые уверенные шаги, а вскоре их общение переросло ледовую арену, и они стали проводить вместе всё свободное время." },
    4: { images: ["/forth1.png", "/forth2.png", "/forth3.png"], text: "Каток закрыли, а Канат уезжает в другой город на тренировки, оставляя Алуа наедине с пустым льдом и главным вопросом: что дальше?" }
  };

  return (
    <div style={{ opacity: fade ? 1 : 0, transition: "opacity 1s ease-in-out", height: "100vh" }}>
      {phase === "STORY" && (
        <StoryScene 
          data={scenesData[level]} 
          onComplete={() => transitionTo("GAME")} 
          isFinal={level === 4}
        />
      )}
      
      {phase === "GAME" && (
        <SudokuGame 
          level={level} 
          onComplete={handleGameComplete} 
        />
      )}

      {phase === "FINAL" && <FinalScreen />}
      <Styles />
    </div>
  );
}

/* ================= СЮЖЕТНАЯ СЦЕНА ================= */

function StoryScene({ data, onComplete, isFinal }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleNext = () => {
    if (imgIndex < data.images.length - 1) {
      setFade(false);
      setTimeout(() => {
        setImgIndex(imgIndex + 1);
        setFade(true);
      }, 800);
    } else {
      onComplete();
    }
  };

  return (
    <div className="screen">
      <HeartsBackground />
      <img src={data.images[imgIndex]} alt="Scene" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", zIndex: 1, opacity: fade ? 1 : 0, transition: "opacity 0.8s" }} />
      <div style={{ position: "absolute", bottom: "10%", zIndex: 2, textAlign: "center", width: "90%", maxWidth: "400px" }}>
        <p style={{ color: "#fff", fontSize: "20px", background: "rgba(0,0,0,0.6)", padding: "20px", borderRadius: "20px" }}>{data.text}</p>
        <button onClick={handleNext} style={{ marginTop: "20px", padding: "15px 40px", fontSize: "18px", background: "#d63384", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "bold" }}>Дальше ➔</button>
      </div>
    </div>
  );
}

/* ================= ИГРА (СУДОКУ) ================= */

function SudokuGame({ level, onComplete }) {
  const [board, setBoard] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [time, setTime] = useState(0);
  const [lost, setLost] = useState(false);
  const [error, setError] = useState("");

  const puzzles = {
    1: { board: [[1, 0, 0, 4], [0, 4, 1, 0], [0, 1, 4, 0], [4, 0, 0, 1]], time: 60 },
    2: { board: [[0, 0, 1, 2], [0, 0, 4, 3], [4, 3, 0, 0], [2, 1, 0, 0]], time: 60 },
    3: { board: [[1, 0, 3, 4, 0, 6], [0, 5, 6, 0, 2, 3], [2, 3, 1, 5, 6, 4], [0, 6, 4, 2, 3, 0], [3, 1, 0, 6, 4, 5], [0, 4, 5, 0, 1, 2]], time: 120 },
    4: { board: [[1, 0, 0, 2], [0, 2, 1, 0], [0, 1, 2, 0], [2, 0, 0, 1]], time: 60 },
  };

  useEffect(() => {
    const p = puzzles[level];
    if (!p) return;
    setBoard(p.board.map((r) => [...r]));
    setFixed(p.board.map((r) => r.map((c) => c !== 0)));
    setTime(p.time);
    setLost(false);
    setError("");
  }, [level]);

  useEffect(() => {
    if (lost || time <= 0) {
      if (time <= 0 && board.length > 0) setLost(true);
      return;
    }
    const t = setInterval(() => setTime((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [time, lost, board]);

  function update(i, j, v) {
    if (fixed[i][j]) return;
    const val = v === "" ? 0 : Number(v);
    if (isNaN(val)) return;
    const copy = board.map((r) => [...r]);
    copy[i][j] = val;
    setBoard(copy);
    setError("");
  }

  function isComplete(b) { return b.every((r) => r.every((c) => c !== 0)); }

  function isValid(b) {
    const n = b.length;
    for (let i = 0; i < n; i++) {
      const row = new Set();
      const col = new Set();
      for (let j = 0; j < n; j++) {
        if (b[i][j] !== 0) { if (row.has(b[i][j])) return false; row.add(b[i][j]); }
        if (b[j][i] !== 0) { if (col.has(b[j][i])) return false; col.add(b[j][i]); }
      }
    }
    return true;
  }

  const handleCheck = () => {
    if (!isComplete(board)) return setError("Заполните все пустые клетки 💔");
    if (!isValid(board)) return setError("Где-то ошибка, проверьте правила 💔");
    onComplete();
  };

  if (!board.length) return null;

  return (
    <div className="screen">
      <HeartsBackground />
      <div className="card" style={{ zIndex: 2 }}>
        <h2 style={{ color: "#d63384", margin: "0 0 10px 0" }}>Глава {level} - Судоку</h2>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: lost ? "red" : "#333", marginBottom: "15px" }}>⏱ Осталось: {time} сек.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${board.length}, 45px)`, gap: "5px", background: "#333", padding: "5px", borderRadius: "10px", justifyContent: "center" }}>
          {board.map((r, i) => r.map((c, j) => (
            <input key={`${i}-${j}`} value={c || ""} onChange={(e) => update(i, j, e.target.value)} disabled={fixed[i][j]} maxLength={1} style={{ width: "45px", height: "45px", textAlign: "center", fontSize: "20px", fontWeight: fixed[i][j] ? "bold" : "normal", color: fixed[i][j] ? "#333" : "#d63384", background: fixed[i][j] ? "#e0e0e0" : "#fff", border: "none", borderRadius: "5px" }} />
          )))}
        </div>
        
        <button onClick={handleCheck} style={{ marginTop: "20px", padding: "12px 40px", fontSize: "18px", background: "linear-gradient(90deg, #ff4da6, #ff85c1)", color: "white", border: "none", borderRadius: "20px", cursor: "pointer", width: "100%" }}>Проверить</button>
        {error && <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>{error}</p>}
      </div>
    </div>
  );
}

function FinalScreen() {
  return (
    <div className="screen">
      <HeartsBackground />
      <div className="card" style={{ zIndex: 2 }}>
        <h1 style={{ fontSize: "28px" }}>✨ Финал</h1>
        <p style={{ color: "#555", margin: "20px 0", fontSize: "16px" }}>
          История первой части завершена. Но самое интересное ждет тебя впереди...
        </p>
        <button 
          className="start-btn" 
          onClick={() => window.open("https://t.me/oceana_rackushka", "_blank")}
        >
          Купить доступ к продолжению 💖
        </button>
        <p style={{ fontSize: "12px", color: "#aaa", marginTop: "15px" }}>Получи полный доступ навсегда</p>
      </div>
    </div>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      .screen { height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #ffd6e8, #ffeef7, #fff0f5); overflow: hidden; position: relative; font-family: sans-serif; }
      .card { width: 320px; padding: 30px; border-radius: 30px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2); text-align: center; }
      h1 { color: #d63384; margin-bottom: 10px; }
      .subtitle { color: #ff69b4; margin-bottom: 20px; }
      input { border: 1px solid #ffb6c1; outline: none; }
      .start-btn { padding: 15px; border: none; border-radius: 15px; font-weight: bold; cursor: pointer; background: linear-gradient(90deg, #ff4da6, #ff85c1); color: white; width: 100%; font-size: 16px; }
      .music-btn { width: 100%; padding: 12px; border: none; border-radius: 15px; font-weight: bold; cursor: pointer; margin-top: 10px; background: #fff; border: 2px solid #ff85c1; color: #ff4da6; }
      .hearts { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: hidden; }
      .hearts span { position: absolute; top: 100%; animation: floatUp linear infinite; opacity: 0; }
      @keyframes floatUp { 0% { transform: translateY(0); opacity: 0; } 30% { opacity: 0.6; } 100% { transform: translateY(-110vh); opacity: 0; } }
    `}</style>
  );
}