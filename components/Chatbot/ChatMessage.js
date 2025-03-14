import React from 'react'
import ChatbotIcon from './ChatbotIcon'

function ChatMessage({chat}) {
    const { role, text } = chat;

  return (
    <div className={`message ${role === "model" ? 'bot':'user'}-message`}>
        {chat.role === 'model' && <ChatbotIcon />}
        <p 
        className="message-text"
        dangerouslySetInnerHTML={{ __html: text }}
        />
    </div>
  )
}

export default ChatMessage
