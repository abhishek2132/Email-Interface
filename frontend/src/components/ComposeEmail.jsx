import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';

export default function ComposeEmail({ open, onClose }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with Flask backend
    console.log({ to, subject, content, attachments });
    onClose();
  };

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          New Message
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            required
            multiline
            rows={12}
          />
          {attachments.length > 0 && (
            <Box mt={2}>
              {attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => {
                    const newAttachments = [...attachments];
                    newAttachments.splice(index, 1);
                    setAttachments(newAttachments);
                  }}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Box>
            <input
              type="file"
              id="attachment-input"
              multiple
              style={{ display: 'none' }}
              onChange={handleAttachment}
            />
            <label htmlFor="attachment-input">
              <IconButton component="span" color="primary">
                <AttachFileIcon />
              </IconButton>
            </label>
          </Box>
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Discard
            </Button>
            <Button type="submit" variant="contained">
              Send
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}
