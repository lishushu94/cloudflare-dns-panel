import { Box, Tabs, Tab, Skeleton, alpha } from '@mui/material';
import {
  Apps as AllIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useProvider } from '@/contexts/ProviderContext';

export default function ProviderAccountTabs() {
  const {
    selectedProvider,
    selectedCredentialId,
    selectCredential,
    getCredentialsByProvider,
    isLoading,
  } = useProvider();

  if (isLoading) {
    return (
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  if (!selectedProvider) {
    return null;
  }

  const accounts = getCredentialsByProvider(selectedProvider);

  if (accounts.length === 0) {
    return null;
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number | 'all') => {
    selectCredential(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', pt: 1 }}>
      <Tabs
        value={selectedCredentialId || 'all'}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="account tabs"
        sx={{
          minHeight: 56,
          px: 2,
          '& .MuiTabs-indicator': { display: 'none' }, // 移除默认下划线
          '& .MuiTab-root': {
            minHeight: 48,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem', // 增大字体
            mr: 1,
            borderRadius: '12px', // 圆角
            transition: 'all 0.2s',
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), // 选中时的背景色
              fontWeight: 700,
            },
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
            }
          },
        }}
      >
        <Tab
          value="all"
          label="全部账户"
          icon={<AllIcon fontSize="small" />}
          iconPosition="start"
        />

        {accounts.map((account) => (
          <Tab
            key={account.id}
            value={account.id}
            label={account.name}
            icon={<AccountIcon fontSize="small" />}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Box>
  );
}
