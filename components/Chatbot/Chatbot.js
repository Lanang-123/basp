"use client";

import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import { GoX, GoChevronDown } from "react-icons/go";
import { AiOutlineCheckCircle } from "react-icons/ai";
import ChatbotForm from './ChatbotForm';
import ChatMessage from './ChatMessage';
import DraggableRating from '../Chatbot/DraggableRating'; // Pastikan path sesuai
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const apiAdmin = process.env.NEXT_PUBLIC_ADMIN_API_ENDPOINT;

function Chatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [ratingValue, setRatingValue] = useState(null);
  const [showRestartPrompt, setShowRestartPrompt] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);

  const conversationCreated = useRef(false);
  const chatBodyRef = useRef();
  const inactivityTimer = useRef(null);
  const autoEndTimer = useRef(null);

  // Fungsi membuat conversation baru
  const createConversation = async () => {
    try {
      const convRequestBody = {
        user_id: '',
        guest_token: '',
        session_token: '',
        start_time: '',
        end_time: ''
      };
      const res = await fetch(`${apiAdmin}/api/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convRequestBody)
      });
      if (!res.ok) throw new Error("Gagal membuat conversation");

      const convData = await res.json();
      if (convData && convData.data) {
        setConversationData(convData.data);
        conversationCreated.current = true;
        return convData.data;
      } else {
        throw new Error("Response conversation tidak valid");
      }
    } catch (error) {
      console.error("Error membuat conversation:", error);
      return null;
    }
  };

  // Toggle buka/tutup chat
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  // Kata kunci penutup yang akan memicu endChat secara manual
  const closeKeywords = [
    "cukup",
    "tidak ada lagi",
    "terima kasih",
    "terimakasih",
    "sudah cukup",
    "tidak"
  ];

  // Saat user mengirim pesan
  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    let currentConversation = conversationData;
    if (!currentConversation) {
      currentConversation = await createConversation();
      if (!currentConversation) return;
    }

    const newUserMessage = { role: 'user', text: messageContent };
    setChatHistory(prev => [...prev, newUserMessage]);

    await sendMessageToAPI('user', messageContent, currentConversation.id);

    // Jika pesan mengandung kata kunci penutup, langsung akhiri percakapan
    const lowerMsg = messageContent.toLowerCase();
    if (closeKeywords.some(keyword => lowerMsg.includes(keyword))) {
      await endChat();
      return;
    }

    // Jika bukan kata penutup, panggil respons AI
    await generateBotResponse([...chatHistory, newUserMessage], currentConversation.id);
  };

  const sendMessageToAPI = async (sender, messageContent, forcedConvId) => {
    const convId = forcedConvId || (conversationData && conversationData.id);
    if (!convId) return;

    try {
      await fetch(`${apiAdmin}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: convId,
          sender,
          message_content: messageContent,
        }),
      });
    } catch (error) {
      console.error("Error mengirim pesan:", error);
    }
  };

  // Memanggil API assistant untuk mendapatkan respons AI
  const generateBotResponse = async (history, forcedConvId) => {
    const updateHistory = (text) => {
      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== "Merespon..."),
        { role: "model", text }
      ]);
    };

    // Gabungkan chatHistory dengan format "role: text"
    const formattedHistory = history.map(({ role, text }) => `${role}: ${text}`).join("\n");

    try {
      setChatHistory(prev => [...prev, { role: 'model', text: "Merespon..." }]);

      const res = await fetch('/api/assistant', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: formattedHistory })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const aiResponse = data.response.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(aiResponse);
      await sendMessageToAPI('AI', aiResponse, forcedConvId);
    } catch (error) {
      console.error("Error generateBotResponse:", error);
      updateHistory("Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
  };

  // Fungsi untuk mengakhiri percakapan
  const endChat = async () => {
    if (!conversationData || !conversationData.id) {
      console.warn("Conversation data tidak tersedia untuk endChat");
      return;
    }
    try {
      const summaryPrompt = chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n');
      const summaryRes = await fetch('/api/assistant', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: summaryPrompt, mode: "summary" })
      });
      const summaryData = await summaryRes.json();
      if (!summaryRes.ok) throw new Error("Gagal membuat summary");
      if (!summaryData.response) throw new Error("Summary response kosong");

      const completeRes = await fetch(`${apiAdmin}/api/conversation/${conversationData.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: summaryData.response })
      });
      if (!completeRes.ok) {
        const errData = await completeRes.json();
        throw new Error("Error complete conversation: " + errData.message);
      }

      setChatEnded(true);
    } catch (error) {
      console.error("Error mengakhiri chat:", error);
    }
  };

  // Timer inaktivitas & auto-end
  useEffect(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
    if (isChatOpen && !chatEnded && conversationData && chatHistory.some(msg => msg.role === 'user')) {
      inactivityTimer.current = setTimeout(() => {
        setShowInactivityPrompt(true);
      }, 30000);

      autoEndTimer.current = setTimeout(async () => {
        await endChat();
        setRatingValue(0);
        setIsChatOpen(false);
      }, 1800000);
    }
    return () => {
      clearTimeout(inactivityTimer.current);
      clearTimeout(autoEndTimer.current);
    };
  }, [chatHistory, isChatOpen, chatEnded, conversationData]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory, isChatOpen]);

  // Set rating otomatis jika chat berakhir tanpa feedback
  useEffect(() => {
    if (chatEnded && ratingValue === null) {
      const timer = setTimeout(() => {
        setRatingValue(0);
        setShowRestartPrompt(false);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [chatEnded, ratingValue]);

  // Restart percakapan setelah feedback
  useEffect(() => {
    if (chatEnded && ratingValue !== 0 && feedbackSubmitted && !showRestartPrompt) {
      const timer = setTimeout(() => {
        restartConversation();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [chatEnded, ratingValue, feedbackSubmitted, showRestartPrompt]);

  const handleRatingChange = async (rating) => {
    console.log("User memberi rating:", rating);
    setRatingValue(rating);
    if (!conversationData || !conversationData.id) {
      console.error("Tidak ada conversation data untuk mengirim feedback");
      return;
    }
    try {
      const ratingAPI = await fetch(`${apiAdmin}/api/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationData.id,
          guest_token: conversationData.guest_token,
          rating
        })
      });
      const responseRating = await ratingAPI.json();
      console.log("Feedback response:", responseRating);
    } catch (error) {
      console.error("Error mengirim feedback:", error);
    }
    setShowRestartPrompt(true);
  };

  const restartConversation = async () => {
    conversationCreated.current = false;
    setConversationData(null);
    setChatHistory([]);
    setChatEnded(false);
    setRatingValue(null);
    setShowRestartPrompt(false);
    setFeedbackSubmitted(false);
    setShowInactivityPrompt(false);
  };

  return (
    <div className='chatbot-container'>
      <button
        id='chatbot-toggler'
        onClick={toggleChat}
        title="Sapa Bli Surya"  // Tooltip bawaan browser
        style={{
          width: "80px",
          height: "80px",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderRadius: "50%",
          padding: 0,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
        }}
      >
        {isChatOpen ? null : (
          <DotLottieReact
            src="https://lottie.host/0117c9d8-d60a-409a-852a-65a824c41a09/stlsJ73z25.lottie"
            loop
            autoplay
            style={{ width: '100px', height: '80px', backgroundColor: 'white', borderRadius: '50%' }}
          />
        )}
      </button>


      {isChatOpen && (
        <div className='chatbot-popup' style={{ position: 'relative' }}>
          {/* Header */}
          <div className='chat-header' style={{ position: 'relative' }}>
            <div className='header-info'>
              <ChatbotIcon />
              <h2 className='chatbot-logo-text' style={{ color: 'white', fontWeight: '500' }}>
                Bli Surya
              </h2>
            </div>
            {!chatEnded && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="minimize-button"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Minimize chat"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
                >
                  <GoChevronDown size={25} color="white" />
                </button>
                <button
                  className="close-button"
                  aria-label="Close chat"
                  onClick={() => {
                    if (!conversationData || !conversationData.id) {
                      // Jika belum ada percakapan, close saja
                      setIsChatOpen(false);
                    } else {
                      // Jika sudah ada, tampilkan modal konfirmasi
                      setShowConfirmationModal(true);
                    }
                  }}
                >
                  <GoX size={25} color="white" />
                </button>
              </div>
            )}
          </div>

          {showConfirmationModal && (
            <div className="confirmation-overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(2px)',
              zIndex: 10
            }}>
              <div className="confirmation-modal" style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center'
              }}>
                <h4>Konfirmasi</h4>
                <p>Apakah Anda yakin ingin mengakhiri chat?</p>
                <div className="modal-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <button
                    className="confirm-button"
                    style={{ background: '#dc2626', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    onClick={async () => {
                      await endChat();
                      setShowConfirmationModal(false);
                    }}
                  >
                    End Chat
                  </button>
                  <button
                    className="cancel-button"
                    style={{ background: '#64748b', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setShowInactivityPrompt(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showInactivityPrompt && (
            <div className="inactivity-overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10
            }}>
              <div className="inactivity-modal" style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center'
              }}>
                <p>Apakah Anda masih ingin melanjutkan percakapan? Jika tidak, chat akan segera diakhiri.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={() => setShowInactivityPrompt(false)}
                    style={{ background: '#10B981', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Saya masih ada
                  </button>
                  <button
                    onClick={async () => {
                      await endChat();
                      setShowInactivityPrompt(false);
                      setIsChatOpen(false);
                    }}
                    style={{ background: '#dc2626', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Akhiri Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className='chat-body' ref={chatBodyRef}>
            {chatHistory.length === 0 ? (
              <div className='message bot-message'>
                <ChatbotIcon />
                <div className='flex flex-col gap-2'>
                  <p className='message-text'>
                    Halo saya Bli Surya. Assistant virtual yang akan menjawab informasi yang kamu butuhkan kepada perusahaan kami 🙌
                  </p>
                  <p className='message-text'>Ada yang bisa saya bantu?</p>
                </div>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className='flex flex-col gap-2'>
                  <ChatMessage chat={chat} />
                  {chat.role === "model" && chat.text !== "Merespon..." && (
                    <div className='message bot-message'>
                      <ChatbotIcon />
                      <p className='message-text'>Ada yang bisa saya bantu lagi?</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className='chat-footer'>
            {chatEnded ? (
              <div className='chat-feedback' style={{ textAlign: 'center', padding: '1rem' }}>
                {feedbackSubmitted ? (
                  <p style={{ fontSize: '1.5rem', marginTop: '1rem', color:'#25d366', fontWeight:'600' }}>
                    Terima kasih atas percakapan Anda 👏
                  </p>
                ) : showRestartPrompt ? (
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                      onClick={async () => {
                        setFeedbackSubmitted(true);
                        await restartConversation();
                      }}
                      style={{ background: '#10B981', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Ya, mulai percakapan baru
                    </button>
                    <button
                      onClick={() => {
                        setFeedbackSubmitted(true);
                        setShowRestartPrompt(false);
                      }}
                      style={{ background: '#dc2626', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Tidak, selesai
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '14px', margin: '0.5rem 0' }}>
                      Terima kasih sudah menggunakan layanan kami!
                    </p>
                    <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                      Bagaimana pengalaman Anda?
                    </p>
                    <DraggableRating onRatingChange={handleRatingChange} />
                  </>
                )}
                {(!showRestartPrompt && ratingValue === 0 && !feedbackSubmitted) && (
                  <div style={{
                    marginTop: '-11rem',
                    backgroundColor: 'green',
                    borderRadius: '0.375rem',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <AiOutlineCheckCircle style={{ color: '#10B981', fontSize: '1.2rem' }} />
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: 500
                    }}>
                      Percakapan telah selesai.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <ChatbotForm onSendMessage={handleSendMessage} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
