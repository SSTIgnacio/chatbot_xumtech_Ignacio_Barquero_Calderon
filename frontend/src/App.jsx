/**
 * @description Componente principal que renderiza la interfaz completa del chatbot.
 * Maneja el estado de los mensajes, la entrada del usuario y la comunicación con la API.
 */

import React, { useState, useEffect, useRef } from 'react';
// Importación de componentes pre-diseñados de la biblioteca Mantine.
import { Paper, Text, TextInput, Button, Group, Loader, ScrollArea, Avatar } from '@mantine/core';

/**
 * Componente para renderizar una única burbuja de mensaje.
 * @param {{ text: string, isUser: boolean }} props - Propiedades del mensaje.
 */
const Message = ({ text, isUser }) => {
  return (
    // 'Group' alinea el mensaje a la derecha si es del usuario, y a la izquierda si es del bot.
    <Group justify={isUser ? 'flex-end' : 'flex-start'} mb="sm">
      <Paper
        shadow="sm"
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: isUser ? '#2563EB' : '#F1F3F5', // Azul para el usuario, gris para el bot.
          color: isUser ? 'white' : 'black',
          maxWidth: '80%',
        }}
      >
        <Text>{text}</Text>
      </Paper>
    </Group>
  );
};

/**
 * Componente principal de la aplicación.
 */
export default function App() {
  // --- ESTADOS DE REACT ---
  // Almacena el array de todos los mensajes de la conversación.
  const [messages, setMessages] = useState([]);
  // Controla el valor del campo de texto de entrada.
  const [input, setInput] = useState('');
  // Controla si se está esperando una respuesta del backend.
  const [isLoading, setIsLoading] = useState(false);
  // Referencia al contenedor de mensajes para poder hacer scroll.
  const viewport = useRef(null);

  // --- EFECTOS SECUNDARIOS (useEffect) ---
  // Función para hacer scroll automático al final de los mensajes.
  const scrollToBottom = () => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  };

  // Este efecto se ejecuta cada vez que 'messages' o 'isLoading' cambian, asegurando el scroll.
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Este efecto se ejecuta solo una vez al cargar el componente para mostrar el mensaje de bienvenida.
  useEffect(() => {
    setMessages([{ text: "¡Hola! Soy Xumbot. ¿En qué puedo ayudarte hoy?", isUser: false }]);
  }, []);

  /**
   * Maneja el envío del formulario cuando el usuario presiona "Enviar".
   * @param {React.FormEvent} e - Evento del formulario.
   */
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Previene que la página se recargue.
    if (!input.trim() || isLoading) return; // No hacer nada si el input está vacío o si ya está cargando.

    // Actualización optimista de la UI: añade el mensaje del usuario inmediatamente.
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput(''); // Limpia el input.
    setIsLoading(true); // Muestra el indicador de carga.

    try {
      // Lee la URL y la API Key desde las variables de entorno del frontend.
      // Vite requiere el prefijo 'VITE_' para exponer variables al cliente.
      const apiUrl = import.meta.env.VITE_API_URL;
      const apiKey = import.meta.env.VITE_API_KEY;

      // Realiza la petición POST a la API del backend.
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey // Usa la clave desde las variables de entorno.
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) throw new Error('Respuesta de red no fue exitosa.');
      
      const data = await response.json();
      const botMessage = { text: data.reply, isUser: false };
      // Añade la respuesta del bot a la lista de mensajes.
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      // En caso de error, muestra un mensaje amigable en la UI.
      const errorMessage = { text: "Lo siento, algo salió mal. Por favor, intenta de nuevo.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Se asegura de que el estado de carga se desactive siempre.
      setIsLoading(false);
    }
  };

  // --- RENDERIZADO JSX ---
  return (
    // Contenedor principal de la página.
    <div style={{ background: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* La ventana principal del chat. */}
      <Paper shadow="xl" radius="lg" p="md" style={{ width: '100%', maxWidth: 700, height: '85vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Cabecera del Chat */}
        <Group justify="center" p="md" style={{ borderBottom: '1px solid #E9ECEF' }}>
            <Avatar color="blue" radius="xl">X</Avatar>
            <Text size="xl" fw={700}>Chat con XUMTECH</Text>
        </Group>

        {/* Cuerpo de Mensajes con scroll */}
        <ScrollArea viewportRef={viewport} style={{ flex: 1, padding: '16px' }}>
          {messages.map((msg, index) => (
            <Message key={index} text={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && <Loader color="blue" size="sm" style={{ alignSelf: 'flex-start', margin: '10px' }} />}
        </ScrollArea>

        {/* Barra de Entrada de texto */}
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
