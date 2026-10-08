import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SITE_INFO } from '../data/initialData';

interface WhatsAppContextType {
  isOpen: boolean;
  hasSent: boolean;
  message: string;
  originalMessage: string;
  recipientNumber: string;
  openWhatsApp: (initialMessage?: string) => void;
  closeWhatsApp: () => void;
  setMessage: (msg: string) => void;
  resetMessage: () => void;
  sendMessage: (customMsg?: string) => void;
}

const DEFAULT_WHATSAPP_MESSAGE = "Hello Doctor Baba Mukisa, I am reaching out for a spiritual consultation.";

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [message, setMessage] = useState(DEFAULT_WHATSAPP_MESSAGE);
  const [originalMessage, setOriginalMessage] = useState(DEFAULT_WHATSAPP_MESSAGE);

  const recipientNumber = SITE_INFO.whatsapp || "256761359634";

  const openWhatsApp = useCallback((initialMessage?: string) => {
    const textToUse = (initialMessage && initialMessage.trim().length > 0)
      ? initialMessage.trim()
      : DEFAULT_WHATSAPP_MESSAGE;

    setMessage(textToUse);
    setOriginalMessage(textToUse);
    setHasSent(false);
    setIsOpen(true);
  }, []);

  const closeWhatsApp = useCallback(() => {
    setIsOpen(false);
  }, []);

  const resetMessage = useCallback(() => {
    setMessage(originalMessage);
  }, [originalMessage]);

  const sendMessage = useCallback((customMsg?: string) => {
    const finalMsg = (customMsg !== undefined ? customMsg : message).trim();
    const encodedText = encodeURIComponent(finalMsg || DEFAULT_WHATSAPP_MESSAGE);
    const url = `https://wa.me/${recipientNumber}?text=${encodedText}`;

    // Safely launch in a new tab to keep the main website window open and active
    try {
      const newWin = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Keep the main window open after sending as requested
    setHasSent(true);
  }, [message, recipientNumber]);

  // Intelligent interceptor: Listen to any click on a WhatsApp link across the entire app
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor || !anchor.href) return;

      // Check if this anchor opts out
      if (anchor.dataset.noIntercept === 'true') return;

      // Check if it's a WhatsApp link
      const href = anchor.getAttribute('href') || '';
      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        e.preventDefault();
        e.stopPropagation();

        try {
          // Parse the text query parameter
          const parsedUrl = new URL(anchor.href, window.location.origin);
          const rawText = parsedUrl.searchParams.get('text');
          const initialText = rawText ? decodeURIComponent(rawText) : DEFAULT_WHATSAPP_MESSAGE;
          openWhatsApp(initialText);
        } catch {
          openWhatsApp(DEFAULT_WHATSAPP_MESSAGE);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [openWhatsApp]);

  return (
    <WhatsAppContext.Provider
      value={{
        isOpen,
        hasSent,
        message,
        originalMessage,
        recipientNumber,
        openWhatsApp,
        closeWhatsApp,
        setMessage,
        resetMessage,
        sendMessage
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = (): WhatsAppContextType => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};
