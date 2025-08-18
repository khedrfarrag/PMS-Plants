import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { contactMessagesPoint } from '../constant/Const';

export interface ContactMessage {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  Government: string;
  Message: string;
  SentAt: string;
  IsRead: boolean;
  Service_type: string;
  User_type: string;
}

interface ContactMessageContextType {
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  fetchMessages: () => Promise<void>;
}

export const ContactMessageContext = createContext<ContactMessageContextType | undefined>(undefined);

export const ContactMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(contactMessagesPoint.GetAllContactMessages, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` }
      });
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setMessages(data);
    } catch (error) {
      setMessages([]);
    }
  }, []);

  return (
    <ContactMessageContext.Provider value={{ messages, setMessages, fetchMessages }}>
      {children}
    </ContactMessageContext.Provider>
  );
}; 