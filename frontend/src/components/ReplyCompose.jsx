import { useState, useEffect } from 'react';
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
  Typography,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  ArrowForward as ForwardIcon
} from '@mui/icons-material';

export default function ReplyCompose({ open, onClose, originalEmail, mode = 'reply' }) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (originalEmail) {
      if (mode === 'reply') {
        setTo(originalEmail.sender);
        setSubject(`Re: ${originalEmail.subject}`);
        setContent(`\n\n-------- Original Message --------\nFrom: ${originalEmail.sender}\nDate: ${originalEmail.timestamp}\n\n${originalEmail.content || originalEmail.preview}`);
      } else if (mode === 'replyAll') {
        setTo(originalEmail.sender);
        setCc(originalEmail.cc || '');
        setSubject(`Re: ${originalEmail.subject}`);
        setContent(`\n\n-------- Original Message --------\nFrom: ${originalEmail.sender}\nDate: ${originalEmail.timestamp}\n\n${originalEmail.content || originalEmail.preview}`);
      } else if (mode === 'forward') {
        setSubject(`Fwd: ${originalEmail.subject}`);
        setContent(`\n\n-------- Forwarded Message --------\nFrom: ${originalEmail.sender}\nDate: ${originalEmail.timestamp}\n\n${originalEmail.content || originalEmail.preview}`);
      }
    }
  }, [originalEmail, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with Flask backend
    console.log({ to, cc, subject, content, attachments, mode });
    onClose();
  };

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const getTitle = () => {
    switch (mode) {
      case 'reply': return 'Reply';
      case 'replyAll': return 'Reply All';
      case 'forward': return 'Forward Email';
      default: return 'Compose';
    }
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
          <Box display="flex" alignItems="center">
            {mode === 'forward' && <ForwardIcon sx={{ mr: 1 }} />}
            {getTitle()}
          </Box>
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
          {mode === 'replyAll' && (
            <TextField
              fullWidth
              label="Cc"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              margin="normal"
            />
          )}
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
