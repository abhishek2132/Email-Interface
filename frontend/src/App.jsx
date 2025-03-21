import { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Drawer, 
  CssBaseline, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  TextField, 
  IconButton,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Fab,
  Badge,
  Tooltip,
  Button
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Label as LabelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import EmailDetail from './components/EmailDetail';
import ComposeEmail from './components/ComposeEmail';

const drawerWidth = 240;

function App() {
  const [selectedFolder, setSelectedFolder] = useState('Inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [emails, setEmails] = useState([
    {
      id: 1,
      subject: 'Project Update',
      sender: 'john@example.com',
      preview: 'Here are the latest updates on the project...',
      content: 'Here are the latest updates on the project:\n\n1. Frontend development is 80% complete\n2. Backend API endpoints are defined\n3. Database schema is finalized\n\nNext steps:\n- Complete remaining UI components\n- Integrate with backend\n- Start testing phase\n\nLet me know if you have any questions!',
      timestamp: '10:30 AM',
      isStarred: true,
      labels: ['Work', 'Important'],
      unread: true,
      cc: 'team@example.com'
    },
    {
      id: 2,
      subject: 'Team Meeting Tomorrow',
      sender: 'alice@example.com',
      preview: 'Let\'s discuss the upcoming features...',
      content: 'Hi team,\n\nLet\'s meet tomorrow at 10 AM to discuss:\n\n- Current sprint progress\n- Upcoming feature priorities\n- Technical challenges\n- Resource allocation\n\nPlease come prepared with your updates.\n\nBest regards,\nAlice',
      timestamp: '9:15 AM',
      isStarred: false,
      labels: ['Work'],
      unread: true,
      cc: 'team@example.com, manager@example.com'
    },
    {
      id: 3,
      subject: 'Weekend Plans',
      sender: 'friend@example.com',
      preview: 'How about we go hiking this weekend?',
      content: 'Hey!\n\nThe weather looks perfect for hiking this weekend. I was thinking we could try the new trail everyone\'s been talking about.\n\nWe could start early, around 7 AM, and make a day of it. I\'ll bring snacks!\n\nWhat do you think?\n\nCheers',
      timestamp: 'Yesterday',
      isStarred: false,
      labels: ['Personal'],
      unread: false
    }
  ]);

  const folders = [
    { name: 'Inbox', icon: <InboxIcon />, count: emails.filter(e => e.unread).length },
    { name: 'Starred', icon: <StarIcon />, count: emails.filter(e => e.isStarred).length },
    { name: 'Important', icon: <LabelIcon />, count: emails.filter(e => e.labels.includes('Important')).length },
    { name: 'Sent', icon: <MailIcon /> }
  ];

  const handleEmailAction = (action, email) => {
    switch (action) {
      case 'star':
        setEmails(emails.map(e => 
          e.id === email.id ? { ...e, isStarred: !e.isStarred } : e
        ));
        break;
      case 'archive':
        setEmails(emails.filter(e => e.id !== email.id));
        // TODO: Move to archive folder in Flask backend
        break;
      case 'delete':
        setEmails(emails.filter(e => e.id !== email.id));
        // TODO: Delete in Flask backend
        break;
      case 'markRead':
        setEmails(emails.map(e =>
          e.id === email.id ? { ...e, unread: false } : e
        ));
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    handleEmailAction('markRead', email);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Email Interface
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 1, px: 1, mr: 2 }}>
            <TextField
              placeholder="Search emails..."
              variant="standard"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{ disableUnderline: true }}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            fullWidth
            onClick={() => setComposeOpen(true)}
            sx={{ mb: 2 }}
          >
            Compose
          </Button>
          <List>
            {folders.map((folder) => (
              <ListItem 
                button 
                key={folder.name}
                selected={selectedFolder === folder.name}
                onClick={() => setSelectedFolder(folder.name)}
              >
                <ListItemIcon>
                  {folder.count ? (
                    <Badge badgeContent={folder.count} color="primary">
                      {folder.icon}
                    </Badge>
                  ) : folder.icon}
                </ListItemIcon>
                <ListItemText primary={folder.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={2}>
          {emails.map((email) => (
            <Grid item xs={12} key={email.id}>
              <Card 
                sx={{ 
                  '&:hover': { 
                    boxShadow: 6,
                    cursor: 'pointer'
                  },
                  bgcolor: email.unread ? 'action.hover' : 'inherit'
                }}
                onClick={() => handleEmailClick(email)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {email.sender[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        component="div"
                        sx={{ fontWeight: email.unread ? 'bold' : 'regular' }}
                      >
                        {email.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {email.sender}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {email.timestamp}
                      </Typography>
                      <Box>
                        <Tooltip title="Star">
                          <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            handleEmailAction('star', email);
                          }}>
                            {email.isStarred ? <StarIcon color="warning" /> : <StarIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Archive">
                          <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            handleEmailAction('archive', email);
                          }}>
                            <ArchiveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            handleEmailAction('delete', email);
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {email.preview}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {email.labels.map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <EmailDetail 
        email={selectedEmail}
        open={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onAction={handleEmailAction}
      />

      <ComposeEmail
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
      />
    </Box>
  );
}

export default App;
