import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Button,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import ReplyCompose from './ReplyCompose';

export default function EmailDetail({ email, open, onClose, onAction }) {
  const [replyMode, setReplyMode] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  if (!email) return null;

  const handleAction = (action) => {
    onAction?.(action, email);
  };

  const handleReply = (mode) => {
    setReplyMode(mode);
  };

  const handlePrint = () => {
    setMenuAnchor(null);
    window.print();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{email.subject}</Typography>
            <Box display="flex" gap={1}>
              <Tooltip title="Star">
                <IconButton onClick={() => handleAction('star')}>
                  {email.isStarred ? <StarIcon color="warning" /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Archive">
                <IconButton onClick={() => handleAction('archive')}>
                  <ArchiveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleAction('delete')}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More">
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {email.sender[0].toUpperCase()}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="subtitle1">{email.sender}</Typography>
              <Typography variant="caption" color="text.secondary">
                to me {email.cc ? `and ${email.cc.split(',').length} others` : ''}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {email.timestamp}
            </Typography>
          </Box>
          
          <Box mb={2}>
            {email.labels?.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{ mr: 0.5 }}
                icon={<LabelIcon />}
              />
            ))}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
            {email.content || email.preview}
          </Typography>
          
          {email.attachments && email.attachments.length > 0 && (
            <Box mt={2} mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments ({email.attachments.length})
              </Typography>
              {email.attachments.map((attachment, index) => (
                <Chip
                  key={index}
                  label={attachment.name}
                  onClick={() => {/* TODO: Handle attachment download */}}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
          
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<ReplyIcon />}
              onClick={() => handleReply('reply')}
            >
              Reply
            </Button>
            <Button
              variant="outlined"
              startIcon={<ReplyAllIcon />}
              onClick={() => handleReply('replyAll')}
            >
              Reply All
            </Button>
            <Button
              variant="outlined"
              startIcon={<ForwardIcon />}
              onClick={() => handleReply('forward')}
            >
              Forward
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handlePrint}>
          <PrintIcon sx={{ mr: 1 }} /> Print
        </MenuItem>
      </Menu>

      <ReplyCompose
        open={!!replyMode}
        onClose={() => setReplyMode(null)}
        originalEmail={email}
        mode={replyMode}
      />
    </>
  );
}
