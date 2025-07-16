import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, TextInput, Button, Group, Loader, ScrollArea, Avatar } from '@mantine/core';

// Componente para un único mensaje en el chat
const Message = ({ text, isUser }) => {
  return (
    <Group justify={isUser ? 'flex-end' : 'flex-start'} mb="sm">
      <Paper
        shadow="sm"
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: isUser ? '#2563EB' : '#F1F3F5',
          color: isUser ? 'white' : 'black',
          maxWidth: '80%',
        }}
      >
        <Text>{text}</Text>
      </Paper>
    </Group>
  );
};

// Componente principal de la aplicación
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const viewport = useRef(null);

  // Función para hacer scroll automático al final de los mensajes
  const scrollToBottom = () => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    setMessages([{ text: "¡Hola! Soy Xumbot. ¿En qué puedo ayudarte hoy?", isUser: false }]);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'tu-api-key-secreta-12345'
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) throw new Error('La respuesta de la red no fue exitosa.');

      const data = await response.json();
      const botMessage = { text: data.reply, isUser: false };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      const errorMessage = { text: "Lo siento, algo salió mal. Por favor, intenta de nuevo.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper shadow="xl" radius="lg" p="md" style={{ width: '100%', maxWidth: 700, height: '85vh', display: 'flex', flexDirection: 'column' }}>

        {/* Cabecera del Chat */}
        <Group justify="center" p="md" style={{ borderBottom: '1px solid #E9ECEF' }}>
            <Avatar color="blue" radius="xl">X</Avatar>
            <Text size="xl" fw={700}>Chat con XUMTECH</Text>
        </Group>

        {/* Cuerpo de Mensajes */}
        <ScrollArea viewportRef={viewport} style={{ flex: 1, padding: '16px' }}>
          {messages.map((msg, index) => (
            <Message key={index} text={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && <Loader color="blue" size="sm" style={{ alignSelf: 'flex-start', margin: '10px' }} />}
        </ScrollArea>

        {/* Barra de Entrada */}
        <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #E9ECEF' }}>
          <Group>
            <TextInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              style={{ flex: 1 }}
              radius="xl"
              disabled={isLoading}
            />
            <Button type="submit" radius="xl" loading={isLoading}>
              Enviar
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}