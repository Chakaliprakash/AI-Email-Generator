import { useState } from "react";
import "./App.css";
import axios from "axios";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError("Please enter the original email.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedReply("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2)
      );
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server error while generating the email."
        );
      } else if (err.request) {
        setError(
          "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        fontWeight="bold"
      >
        AI Email Reply Generator
      </Typography>

      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "#fff",
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={8}
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="tone-label">Tone</InputLabel>

          <Select
            labelId="tone-label"
            value={tone}
            label="Tone"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Formal">Formal</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading || !emailContent.trim()}
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Generate Reply"
          )}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 3 }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Generated Reply
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={10}
              value={generatedReply}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {
                navigator.clipboard.writeText(generatedReply);
              }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;