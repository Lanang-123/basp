import React, { useRef } from 'react';
import { GoChevronUp } from "react-icons/go";

function ChatbotForm({ onSendMessage }) {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    onSendMessage(userMessage);
  };

  return (
    <form className='chat-form' onSubmit={handleFormSubmit}>
      <input
        type='text'
        ref={inputRef}
        placeholder='Tanya sesuatu...'
        className='message-input'
        required
      />
      <button type="submit">
        <GoChevronUp className='send-chat'/>
      </button>
    </form>
  );
}

export default ChatbotForm;
