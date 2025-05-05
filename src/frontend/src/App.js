import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A154B', // Slack purple
    },
    secondary: {
      main: '#36C5F0', // Slack blue
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('newMessage', (data) => {
      setMessages((prevMessages) => [data, ...prevMessages]);
    });

    return () => newSocket.close();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Slack Bot Response Monitor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Real-time monitoring of bot responses
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {new Date(message.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                          Original Message:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {message.originalMessage}
                        </Typography>
                        <Typography variant="body1" color="secondary" sx={{ mb: 1 }}>
                          Bot Response:
                        </Typography>
                        <Typography variant="body2">
                          {message.response}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App; 