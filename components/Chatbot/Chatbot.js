"use client";

import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import { GoX, GoChevronDown } from "react-icons/go";
import { AiOutlineCheckCircle } from "react-icons/ai";
import ChatbotForm from './ChatbotForm';
import ChatMessage from './ChatMessage';
import DraggableRating from '../Chatbot/DraggableRating';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageDetect from 'languagedetect';
import translations from '@/utils/translations';

const apiAdmin = process.env.NEXT_PUBLIC_ADMIN_API_ENDPOINT;

/**
 * Semua tema menggunakan warna #25d366
 */
const themeStyles = {
  id: {
    headerBg: "#25d366",    // Hijau
    headerText: "white",
  },
  eng: {
    headerBg: "#25d366",    // Hijau
    headerText: "white",
  },
};

function Chatbot() {
  const [activeLanguage, setActiveLanguage] = useState("id");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [ratingValue, setRatingValue] = useState(null);
  const [showRestartPrompt, setShowRestartPrompt] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);

  // Modal pilihan bahasa hanya di dalam area chatbot
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(true);

  const conversationCreated = useRef(false);
  const chatBodyRef = useRef();
  const inactivityTimer = useRef(null);
  const autoEndTimer = useRef(null);

  // Daftar kata kunci untuk mengakhiri percakapan (contoh untuk bahasa Indonesia)
  const closeKeywords = [
    "cukup",
    "tidak ada lagi",
    "terima kasih",
    "terimakasih",
    "sudah cukup",
    "tidak"
  ];

  // Fungsi deteksi bahasa menggunakan 'languagedetect'
  const detectLanguage = (text) => {
    const languageDetector = new LanguageDetect();
    const languages = languageDetector.detect(text);
    console.log("Detected languages:", languages[0]); // Debug log
  
    // Turunkan threshold ke 0.2 jika diperlukan
    if (languages.length > 0 && languages[0][1] > 0.3) {
      const mainLanguage = languages[0][0].toLowerCase();
      if (mainLanguage.includes("english")) return "eng";
      if (mainLanguage.includes("indonesian") || mainLanguage.includes("malay")) return "id";
    }
    return activeLanguage; // Pertahankan bahasa sebelumnya jika deteksi kurang akurat
  };
  

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

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  // Fungsi untuk mengirim pesan dari pengguna
  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    const detectedLang = detectLanguage(messageContent);
    if (detectedLang !== activeLanguage) {
      toast.info(
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {translations[detectedLang].languageChanged}
        </div>,
        {
          containerId: "chatbotToast",
        }
      );
      setActiveLanguage(detectedLang);
    }

    let currentConversation = conversationData;
    if (!currentConversation) {
      currentConversation = await createConversation();
      if (!currentConversation) return;
    }

    const newUserMessage = { role: 'user', text: messageContent };
    setChatHistory(prev => [...prev, newUserMessage]);

    await sendMessageToAPI('user', messageContent, currentConversation.id);

    const lowerMsg = messageContent.toLowerCase();
    const isQuestion = messageContent.trim().endsWith('?');
    const isCloseKeyword = !isQuestion && closeKeywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      return regex.test(lowerMsg);
    });

    if (isCloseKeyword) {
      await endChat();
      return;
    }

    await generateBotResponse([...chatHistory, newUserMessage], currentConversation.id, detectedLang);
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

  const generateBotResponse = async (history, forcedConvId, detectedLang) => {
    const updateHistory = (text) => {
      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== translations[activeLanguage].responding),
        { role: "model", text }
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => `${role}: ${text}`).join("\n");

    try {
      // Tampilkan placeholder "Merespon..." atau "Responding..."
      setChatHistory(prev => [...prev, { role: 'model', text: translations[activeLanguage].responding }]);

      const res = await fetch('/api/assistant', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: formattedHistory, language: detectedLang })
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
      // Timer inaktivitas (30 detik contoh)
      inactivityTimer.current = setTimeout(() => {
        setShowInactivityPrompt(true);
      }, 30000);

      // Timer auto-end (30 menit contoh)
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

  // Pilih style theme berdasarkan activeLanguage (keduanya sama #25d366)
  const currentTheme = themeStyles[activeLanguage] || themeStyles.id;

  return (
    <div className='chatbot-container'>
      {/* Tombol Toggler */}
      <button
        id='chatbot-toggler'
        onClick={toggleChat}
        title={translations[activeLanguage].togglerTitle}
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
          {/* Header dengan tema #25d366 */}
          <div 
            className='chat-header' 
            style={{ 
              position: 'relative',
              backgroundColor: currentTheme.headerBg,  // #25d366
              color: currentTheme.headerText          // white
            }}
          >
            <div className='header-info'>
              <ChatbotIcon />
              <h2 className='chatbot-logo-text' style={{ fontWeight: '500' }}>
                {translations[activeLanguage].chatbotName}
              </h2>
            </div>
            {!chatEnded && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="minimize-button"
                  onClick={() => setIsChatOpen(false)}
                  aria-label={translations[activeLanguage].tooltipMinimize}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: currentTheme.headerText
                  }}
                >
                  <GoChevronDown size={25} color={currentTheme.headerText} />
                </button>
                <button
                  className="close-button"
                  aria-label={translations[activeLanguage].tooltipClose}
                  onClick={() => {
                    if (!conversationData || !conversationData.id) {
                      setIsChatOpen(false);
                    } else {
                      setShowConfirmationModal(true);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: currentTheme.headerText
                  }}
                >
                  <GoX size={25} color={currentTheme.headerText} />
                </button>
              </div>
            )}
          </div>

          <ToastContainer
            enableMultiContainer
            containerId="chatbotToast"
            position="top-right"
            autoClose={3000}
            closeOnClick={true}
            closeButton={false}
            pauseOnHover={false}
            style={{
              position: 'absolute',
              top: '55px',
              right: '15px',
              width: 'auto',
              zIndex: 9999,
              transform: 'none'
            }}
            toastStyle={{
              background: 'white',
              color: '#0376d5',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight:'600',
              maxWidth: '300px',
              boxShadow: '0 4px 12px rgba(18, 115, 64, 0.3)'
            }}
            bodyStyle={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            progressStyle={{
              background: 'rgba(255,255,255,0.9)',
              height: '2px',
              marginBottom: '-2px'
            }}
          />

          {/* Modal Konfirmasi End Chat */}
          {showConfirmationModal && (
            <div
              className="confirmation-overlay"
              style={{
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
              }}
            >
              <div
                className="confirmation-modal"
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  width: '100%',
                  maxWidth: '300px',
                  textAlign: 'center'
                }}
              >
                <h4>{translations[activeLanguage].confirmationTitle}</h4>
                <p>{translations[activeLanguage].endChatConfirm}</p>
                <div
                  className="modal-buttons"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginTop: '1rem'
                  }}
                >
                  <button
                    className="confirm-button"
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      padding: '0.5rem 1.5rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                    onClick={async () => {
                      await endChat();
                      setShowConfirmationModal(false);
                    }}
                  >
                    {translations[activeLanguage].endChat}
                  </button>
                  <button
                    className="cancel-button"
                    style={{
                      background: '#64748b',
                      color: '#fff',
                      padding: '0.5rem 1.5rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setShowInactivityPrompt(false);
                    }}
                  >
                    {translations[activeLanguage].cancel}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Inaktivitas */}
          {showInactivityPrompt && (
            <div
              className="inactivity-overlay"
              style={{
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
              }}
            >
              <div
                className="inactivity-modal"
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  width: '100%',
                  maxWidth: '300px',
                  textAlign: 'center'
                }}
              >
                <p>{translations[activeLanguage].inactivityPrompt}</p>
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginTop: '1rem'
                  }}
                >
                  <button
                    onClick={() => setShowInactivityPrompt(false)}
                    style={{
                      background: '#10B981',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {translations[activeLanguage].stillHere}
                  </button>
                  <button
                    onClick={async () => {
                      await endChat();
                      setShowInactivityPrompt(false);
                      setIsChatOpen(false);
                    }}
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {translations[activeLanguage].endChat}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Pilihan Bahasa */}
          {isLanguageModalOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',   // Jarak dari bawah agar terlihat lebih ke atas
                left: 0,
                right: 0,
                margin: '0 auto', 
                width: '90%',     // Sesuaikan lebar
                maxWidth: '320px',
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: '1rem',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <h4 style={{
                margin: 0,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#333'
              }}>
                Pilih Bahasa / Select Language
              </h4>

              <button
                onClick={() => {
                  setActiveLanguage("id");
                  setIsLanguageModalOpen(false);
                }}
                style={{
                  display: 'flex',
                  width:'100%',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f4f4f4',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e6e6e6'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f4f4f4'}
              >
                <img 
                  src="/assets/flag/id.png" 
                  alt="Flag Indonesia" 
                  style={{ width: '24px', height: '24px' }}
                />
                <span style={{ color: '#333' }}>Indonesia</span>
              </button>

              <button
                onClick={() => {
                  setActiveLanguage("eng");
                  setIsLanguageModalOpen(false);
                }}
                style={{
                  display: 'flex',
                  width:'100%',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f4f4f4',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e6e6e6'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f4f4f4'}
              >
                <img 
                  src="/assets/flag/eng.png" 
                  alt="Flag English" 
                  style={{ width: '24px', height: '24px' }}
                />
                <span style={{ color: '#333' }}>English</span>
              </button>
            </div>
          )}



          {/* Bagian Body Chat */}
          <div className='chat-body' ref={chatBodyRef}>
            {chatHistory.length === 0 ? (
              <div className='message bot-message'>
                <ChatbotIcon />
                <div className='flex flex-col gap-2'>
                  <p className='message-text'>{translations[activeLanguage].greeting}</p>
                  <p className='message-text'>{translations[activeLanguage].askHelp}</p>
                </div>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className='flex flex-col gap-2'>
                  <ChatMessage chat={chat} />
                  {chat.role === "model" && chat.text !== translations[activeLanguage].responding && (
                    <div className='message bot-message'>
                      <ChatbotIcon />
                      <p className='message-text'>{translations[activeLanguage].askHelp}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className='chat-footer'>
            {chatEnded ? (
              <div className='chat-feedback' style={{ textAlign: 'center', padding: '1rem' }}>
                {feedbackSubmitted ? (
                  <p style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#25d366', fontWeight: '600' }}>
                    {translations[activeLanguage].chatFeedbackThanks}
                  </p>
                ) : showRestartPrompt ? (
                  <div
                    style={{
                      marginTop: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem'
                    }}
                  >
                    <button
                      onClick={async () => {
                        setFeedbackSubmitted(true);
                        await restartConversation();
                      }}
                      style={{
                        background: '#10B981',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {translations[activeLanguage].newConversation}
                    </button>
                    <button
                      onClick={() => {
                        setFeedbackSubmitted(true);
                        setShowRestartPrompt(false);
                      }}
                      style={{
                        background: '#dc2626',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {translations[activeLanguage].finish}
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '14px', margin: '0.5rem 0' }}>
                      {translations[activeLanguage].thanksUsingService}
                    </p>
                    <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                      {translations[activeLanguage].experienceQuestion}
                    </p>
                    <DraggableRating onRatingChange={handleRatingChange} />
                  </>
                )}
                {(!showRestartPrompt && ratingValue === 0 && !feedbackSubmitted) && (
                  <div
                    style={{
                      marginTop: '-11rem',
                      backgroundColor: 'green',
                      borderRadius: '0.375rem',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <AiOutlineCheckCircle style={{ color: '#10B981', fontSize: '1.2rem' }} />
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        color: 'white',
                        fontWeight: 500
                      }}
                    >
                      {translations[activeLanguage].chatEnded}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              !isLanguageModalOpen && <ChatbotForm onSendMessage={handleSendMessage} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
