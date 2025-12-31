import React, { useState } from 'react';
import API from '../api'; // This uses your existing axios setup

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ text: "Hello, I am MealMitra AI, how can i help you?", sender: 'bot' }]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await API.post('/api/ai/chat', { message: input });
      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Error connecting to server.", sender: 'bot' }]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition"
      >
        {isOpen ? '✖' : '💬 Help'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-96 mt-2 rounded-lg shadow-2xl flex flex-col border border-gray-200">
          <div className="bg-orange-500 text-white p-3 rounded-t-lg font-bold">Meal Mitra Assistant</div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-orange-100 ml-auto' : 'bg-white border'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 border p-2 rounded-l-md outline-none"
              placeholder="Type here..."
            />
            <button onClick={handleSend} className="bg-orange-500 text-white px-4 rounded-r-md">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;