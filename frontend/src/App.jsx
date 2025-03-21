import { useState, useEffect } from 'react';
import axios from 'axios';
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

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const drawerWidth = 240;

function App() {
  const [selectedFolder, setSelectedFolder] = useState('Inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_BASE_URL = 'http://localhost:8000';

  // Fetch emails when component mounts or folder changes
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching emails from: ${API_BASE_URL}/emails?folder=${selectedFolder}`);
        
        // Add a small delay to ensure the backend is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await axios.get(`${API_BASE_URL}/emails${selectedFolder ? `?folder=${selectedFolder}` : ''}`);
        console.log('Email data received:', response.data);
        
        if (Array.isArray(response.data)) {
          setEmails(response.data);
          console.log(`Set ${response.data.length} emails in state`);
        } else {
          console.error('Unexpected data format:', response.data);
          setEmails([]);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
        // Display more detailed error information
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        // Set empty array to prevent endless loading state
        setEmails([]);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchEmails();
    
    // Add a timeout to ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      setLoading(false);
      console.log('Loading timeout triggered');
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [selectedFolder]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      console.log(`Searching emails with query: ${searchQuery}`);
      
      // Add a small delay to ensure the backend is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await axios.get(`${API_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`);
      console.log('Search results received:', response.data);
      
      if (Array.isArray(response.data)) {
        setEmails(response.data);
      } else {
        console.error('Unexpected search result format:', response.data);
        setEmails([]);
      }
    } catch (error) {
      console.error('Error searching emails:', error);
      // Display more detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      // Set empty array to prevent endless loading state
      setEmails([]);
    } finally {
      setLoading(false);
    }
    
    // Add a timeout to ensure loading state doesn't get stuck
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

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
        // TODO: Move to archive folder in FastAPI backend
        break;
      case 'delete':
        setEmails(emails.filter(e => e.id !== email.id));
        // TODO: Delete in FastAPI backend
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
            <IconButton onClick={handleSearch}>
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
          {loading ? (
            <Grid item xs={12}>
              <Typography variant="h6" component="div">
                Loading...
              </Typography>
            </Grid>
          ) : (
            emails.map((email) => (
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
            ))
          )}
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
