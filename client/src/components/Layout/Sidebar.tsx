import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Skeleton,
  Tooltip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  CloudQueue as CloudflareIcon,
  Storage as AliyunIcon,
  Language as DnspodIcon,
  Cloud as HuaweiIcon,
  CloudCircle as BaiduIcon,
  Public as WestIcon,
  Whatshot as HuoshanIcon,
  CloudDone as JdcloudIcon,
  Dns as DnslaIcon,
  Label as NamesiloIcon,
  PowerSettingsNew as PowerdnsIcon,
  RocketLaunch as SpaceshipIcon,
  Add as AddIcon,
  CloudQueue as CloudIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useProvider } from '@/contexts/ProviderContext';
import { ProviderType } from '@/types/dns';
import { useNavigate } from 'react-router-dom';
import { clearAuthData, getStoredUser } from '@/services/auth';

const PROVIDER_CONFIG: Record<ProviderType, { icon: React.ReactNode; color: string; name: string }> = {
  cloudflare: { icon: <CloudflareIcon />, color: '#f38020', name: 'Cloudflare' },
  aliyun: { icon: <AliyunIcon />, color: '#ff6a00', name: '阿里云' },
  dnspod: { icon: <DnspodIcon />, color: '#0052d9', name: 'DNSPod' },
  huawei: { icon: <HuaweiIcon />, color: '#e60012', name: '华为云' },
  baidu: { icon: <BaiduIcon />, color: '#2932e1', name: '百度云' },
  west: { icon: <WestIcon />, color: '#1e88e5', name: '西部数码' },
  huoshan: { icon: <HuoshanIcon />, color: '#1f54f7', name: '火山引擎' },
  jdcloud: { icon: <JdcloudIcon />, color: '#e1251b', name: '京东云' },
  dnsla: { icon: <DnslaIcon />, color: '#4caf50', name: 'DNSLA' },
  namesilo: { icon: <NamesiloIcon />, color: '#2196f3', name: 'NameSilo' },
  powerdns: { icon: <PowerdnsIcon />, color: '#333333', name: 'PowerDNS' },
  spaceship: { icon: <SpaceshipIcon />, color: '#7e57c2', name: 'Spaceship' },
};

const PROVIDER_ORDER: ProviderType[] = [
  'cloudflare', 'aliyun', 'dnspod', 'huawei', 'baidu', 'west',
  'huoshan', 'jdcloud', 'dnsla', 'namesilo', 'powerdns', 'spaceship',
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = getStoredUser();
  const {
    providers,
    selectedProvider,
    selectProvider,
    getCredentialCountByProvider,
    isLoading,
  } = useProvider();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleSelectProvider = (type: ProviderType) => {
    selectProvider(type);
    navigate('/'); // 确保回到仪表盘查看该提供商的资源
    if (onClose) onClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)' }} />
        ))}
      </Box>
    );
  }

  const sortedProviders = PROVIDER_ORDER
    .map(type => providers.find(p => p.type === type))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: 'white' }}>
                                  {/* 品牌 Logo 区域 */}
                                  <Box sx={{ 
                                    px: 3.5,
                                    pt: 3,
                                    pb: 1, // 收紧底部
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    color: 'white',
                                  }}>
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: theme.palette.primary.main,
                                        width: 48,
                                        height: 48,
                                        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`
                                      }}
                                      variant="rounded"
                                    >
                                      <CloudIcon fontSize="medium" />
                                    </Avatar>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                      <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.1, letterSpacing: 0.5, color: 'white', fontSize: '1.2rem' }}>
                                        CF Panel
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontSize: '0.8rem', fontWeight: 500 }}>
                                        DNS 管理系统
                                      </Typography>
                                    </Box>
                                  </Box>
                            
                                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 3.5, mt: 1.5, mb: 0.5 }} />                      
                            
                      
      {/* 仪表盘入口 */}
      <Box sx={{ px: 2, mb: 0 }}>
        <ListItemButton
                      
                            
                      
                                            onClick={() => {
                      
                            
                      
                                               // 查找第一个有账户的提供商
                      
                            
                      
                                               const firstActiveProvider = PROVIDER_ORDER.find(type => getCredentialCountByProvider(type) > 0);
                      
                            
                      
                                               
                      
                            
                      
                                               if (firstActiveProvider) {
                      
                            
                      
                                                 selectProvider(firstActiveProvider);
                      
                            
                      
                                               } else {
                      
                            
                      
                                                 selectProvider(null);
                      
                            
                      
                                               }
                      
                            
                      
                                               
                      
                            
                      
                                               navigate('/');
                      
                            
                      
                                               if (onClose) onClose();
                      
                            
                      
                                            }}
                      
                            
                      
                                            sx={{
                      
                            
                      
                                              borderRadius: '12px',
                      
                            
                      
                                              py: 1.2,
                      
                            
                      
                                              px: 2,
                      
                            
                      
                                              // 当选中了某个提供商，且该提供商就是第一个有账户的提供商时，理论上仪表盘也算“激活”状态
                      
                            
                      
                                              // 但为了简单区分，只有当 selectedProvider 为 null 时（未选中特定，或全览模式）才高亮？
                      
                            
                      
                                              // 不，现在逻辑变了，点击仪表盘 = 选中第一个。
                      
                            
                      
                                              // 所以这里的高亮逻辑可能需要调整。
                      
                            
                      
                                              // 暂时保持原样：如果 selectedProvider 为 null (没找到有账户的或者手动清空)，高亮。
                      
                            
                      
                                              // 或者，我们可以让这个按钮永远不高亮（因为它只是一个快捷入口），或者总是高亮如果当前在 Dashboard 页面且选中的是自动匹配的那个。
                      
                            
                      
                                              // 鉴于用户习惯，可能希望点击后看到内容，而左侧哪个 Provider 被选中就高亮哪个。
                      
                            
                      
                                              // 所以这个“仪表盘”按钮本身可能不需要高亮，或者只有在完全没选中时高亮。
                      
                            
                      
                                              color: 'rgba(255,255,255,0.7)',
                      
                            
                      
                                              bgcolor: 'transparent',
                      
                            
                      
                                              '&:hover': {
                      
                            
                      
                                                bgcolor: 'rgba(255,255,255,0.08)',
                      
                            
                      
                                                color: 'white'
                      
                            
                      
                                              }
                      
                            
                      
                                            }}
                      
                            
                      
                                          >
                      
                            
                      
                                            <Box
                      
                            
                      
                                              sx={{
                      
                            
                      
                                                width: 32,
                      
                            
                      
                                                height: 32,
                      
                            
                      
                                                borderRadius: '8px',
                      
                            
                      
                                                display: 'flex',
                      
                            
                      
                                                alignItems: 'center',
                      
                            
                      
                                                justifyContent: 'center',
                      
                            
                      
                                                bgcolor: 'rgba(255,255,255,0.05)',
                      
                            
                      
                                                color: 'white',
                      
                            
                      
                                                mr: 2,
                      
                            
                      
                                              }}
                      
                            
                      
                                            >
                      
                            
                      
                                              <DashboardIcon fontSize="small" />
                      
                            
                      
                                            </Box>
                      
                            
                      
                                            <ListItemText 
                      
                            
                      
                                              primary="仪表盘" 
                      
                            
                      
                                              primaryTypographyProps={{ 
                      
                            
                      
                                                variant: 'body2', 
                      
                            
                      
                                                fontWeight: 500,
                      
                            
                      
                                                fontSize: '0.9rem'
                      
                            
                      
                                              }}
                      
                            
                      
                                            />
                      
                            
                      
                                          </ListItemButton>
                      
                            
                      
                                        </Box>
                      
                            
                      
                                        {/* 供应商列表区域 */}
                      
                            
                      
                                        <List component="nav" sx={{ 
                      
                            
                      
                                          px: 2, 
                      
                            
                      
                                          pt: 0,
                      
                            
                      
                                          flexGrow: 1, 
                      
                            
                      
                                          overflowY: 'auto',
                      
                                          '&::-webkit-scrollbar': { width: '4px' },
                      
                                          '&::-webkit-scrollbar-track': { background: 'transparent' },
                      
                                          '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' },
                      
                                          '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255, 255, 255, 0.2)' },
                      
                                        }}>
                      
                                          {sortedProviders.map((provider) => {
                      
                                            const config = PROVIDER_CONFIG[provider.type];
                      
                                            const count = getCredentialCountByProvider(provider.type);
                      
                                            const isSelected = selectedProvider === provider.type;
                      
                                            const hasAccounts = count > 0;
                      
                                  
                      
                                            return (
                      
                                              <Box key={provider.type} sx={{ mb: 0.8 }}>
                      
                                                <ListItemButton
                      
                                                  onClick={() => hasAccounts ? handleSelectProvider(provider.type) : undefined}
                      
                                                  sx={{
                      
                                                    borderRadius: '12px',
                      
                                                    py: 1.2,
                      
                                                    px: 2,
                      
                                                    bgcolor: isSelected ? alpha(config.color, 0.12) : 'transparent',
                      
                                                    border: '1px solid',
                      
                                                    borderColor: isSelected ? alpha(config.color, 0.3) : 'rgba(255,255,255,0.06)',
                      
                                                    color: isSelected ? 'white' : 'rgba(255,255,255,0.75)',
                      
                                                    transition: 'all 0.2s ease',
                      
                                                    '&:hover': {
                      
                                                      bgcolor: isSelected ? alpha(config.color, 0.18) : 'rgba(255,255,255,0.04)',
                      
                                                      borderColor: isSelected ? config.color : 'rgba(255,255,255,0.2)',
                      
                                                      color: 'white',
                      
                                                      transform: 'translateX(4px)'
                      
                                                    },
                      
                                                    opacity: hasAccounts ? 1 : 0.5,
                      
                                                    cursor: hasAccounts ? 'pointer' : 'default',
                      
                                                  }}
                      
                                                >
                      
                                                  <Box
                      
                                                    sx={{
                      
                                                      width: 32,
                      
                                                      height: 32,
                      
                                                      borderRadius: '8px',
                      
                                                      display: 'flex',
                      
                                                      alignItems: 'center',
                      
                                                      justifyContent: 'center',
                      
                                                      bgcolor: alpha(config.color, 0.15),
                      
                                                      color: config.color,
                      
                                                      mr: 2,
                      
                                                      '& svg': { fontSize: 20 },
                      
                                                    }}
                      
                                                  >
                      
                                                    {config.icon}
                      
                                                  </Box>
                      
                                  
                      
                                                  <ListItemText 
                      
                                                    primary={config.name} 
                      
                                                    primaryTypographyProps={{ 
                      
                                                      variant: 'body2', 
                      
                                                      fontWeight: isSelected ? 700 : 500,
                      
                                                      fontSize: '0.9rem'
                      
                                                    }}
                      
                                                  />
                      
                                                  
                      
                                                  {hasAccounts && (
                      
                                                    <Box
                      
                                                      sx={{
                      
                                                        bgcolor: isSelected ? config.color : 'rgba(255,255,255,0.1)',
                      
                                                        color: isSelected ? 'white' : 'rgba(255,255,255,0.5)',
                      
                                                        fontSize: '0.7rem',
                      
                                                        fontWeight: 'bold',
                      
                                                        borderRadius: '10px',
                      
                                                        minWidth: 20,
                      
                                                        height: 20,
                      
                                                        display: 'flex',
                      
                                                        alignItems: 'center',
                      
                                                        justifyContent: 'center',
                      
                                                        px: 0.8
                      
                                                      }}
                      
                                                    >
                      
                                                      {count}
                      
                                                    </Box>
                      
                                                  )}
                      
                                                </ListItemButton>
                      
                                              </Box>
                      
                                            );
                      
                                          })}
                      
                                        </List>
                      
                                        
                      
                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 3 }} />
                      
                                  
                      
                                        {/* 底部功能菜单：操作日志 & 系统设置 */}
                      
                                        <Box sx={{ px: 2, py: 2 }}>
                      
                                          <ListItemButton
                      
                                            onClick={() => { navigate('/logs'); if (onClose) onClose(); }}
                      
                                            sx={{
                      
                                              borderRadius: '12px',
                      
                                              py: 1.2,
                      
                                              px: 2,
                      
                                              mb: 1,
                      
                                              color: location.pathname === '/logs' ? 'white' : 'rgba(255,255,255,0.7)',
                      
                                              bgcolor: location.pathname === '/logs' ? 'rgba(255,255,255,0.1)' : 'transparent',
                      
                                              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }
                      
                                            }}
                      
                                          >
                      
                                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                      
                                              <HistoryIcon fontSize="small" />
                      
                                            </ListItemIcon>
                      
                                            <ListItemText primary="操作日志" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                      
                                          </ListItemButton>
                      
                                  
                      
                                          <ListItemButton
                      
                                            onClick={() => { navigate('/settings'); if (onClose) onClose(); }}
                      
                                            sx={{
                      
                                              borderRadius: '12px',
                      
                                              py: 1.2,
                      
                                              px: 2,
                      
                                              color: location.pathname === '/settings' ? 'white' : 'rgba(255,255,255,0.7)',
                      
                                              bgcolor: location.pathname === '/settings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                      
                                              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }
                      
                                            }}
                      
                                          >
                      
                                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                      
                                              <SettingsIcon fontSize="small" />
                      
                                            </ListItemIcon>
                      
                                            <ListItemText primary="系统设置" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                      
                                          </ListItemButton>
                      
                                        </Box>
                      
                                        
                      
                                        {/* 底部用户区域 */}
                      
                                        <Box sx={{ p: 2, pt: 0 }}>
                      
                                          <Box 
                      
                                            sx={{ 
                      
                                              display: 'flex', 
                      
                                              alignItems: 'center', 
                      
                                              gap: 2,
                      
                                              p: 1.5,
                      
                                              borderRadius: '12px',
                      
                                              bgcolor: 'rgba(255,255,255,0.03)',
                      
                                              border: '1px solid rgba(255,255,255,0.05)',
                      
                                              cursor: 'pointer',
                      
                                              transition: 'all 0.2s',
                      
                                              '&:hover': { 
                      
                                                bgcolor: 'rgba(255,255,255,0.08)',
                      
                                                borderColor: 'rgba(255,255,255,0.1)'
                      
                                              }
                      
                                            }}
                      
                                            onClick={handleUserMenuOpen}
                      
                                          >
                      
                                            <Avatar 
                      
                                              sx={{ 
                      
                                                width: 36, 
                      
                                                height: 36, 
                      
                                                bgcolor: theme.palette.primary.light,
                      
                                                fontSize: '1rem'
                      
                                              }}
                      
                                            >
                      
                                              {user?.username?.charAt(0).toUpperCase()}
                      
                                            </Avatar>
                      
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      
                                              <Typography variant="subtitle2" color="white" noWrap fontWeight="bold">
                      
                                                {user?.username}
                      
                                              </Typography>
                      
                                              <Typography variant="caption" color="rgba(255,255,255,0.5)" noWrap>
                      
                                                管理员
                      
                                              </Typography>
                      
                                            </Box>
                      
                                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      
                                              <LogoutIcon fontSize="small" />
                      
                                            </IconButton>
                      
                                          </Box>
                      
                                          
                      
                                          <Menu
                      
                                            anchorEl={anchorEl}
                      
                                            open={Boolean(anchorEl)}
                      
                                            onClose={handleUserMenuClose}
                      
                                            PaperProps={{
                      
                                              sx: {
                      
                                                mt: -1,
                      
                                                ml: 1,
                      
                                                width: 220,
                      
                                                bgcolor: '#1e293b',
                      
                                                color: 'white',
                      
                                                border: '1px solid rgba(255,255,255,0.1)'
                      
                                              }
                      
                                            }}
                      
                                            transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      
                                            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                      
                                          >
                      
                                            <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.light, '&:hover': { bgcolor: 'rgba(255,50,50,0.1)' } }}>
                      
                                              <ListItemIcon sx={{ color: theme.palette.error.light }}>
                      
                                                <LogoutIcon fontSize="small" />
                      
                                              </ListItemIcon>
                      
                                              <ListItemText primary="退出登录" />
                      
                                            </MenuItem>
                      
                                          </Menu>
                      
                                        </Box>
    </Box>
  );
}
