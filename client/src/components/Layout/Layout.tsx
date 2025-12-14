import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Typography,
  Link
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import Sidebar from './Sidebar';

const drawerWidth = 260;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e293b' }}>
      <Sidebar onClose={() => isMobile && setMobileOpen(false)} />
    </Box>
  );

  // 简单的面包屑逻辑
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbNameMap: { [key: string]: string } = {
    logs: '操作日志',
    settings: '系统设置',
    domain: '域名管理',
    hostnames: '主机名管理',
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      
      {/* 移动端菜单按钮 */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(4px)',
          boxShadow: 1,
          display: { sm: 'none' },
          '&:hover': { bgcolor: 'white' }
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* 侧边栏容器 */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#1e293b', 
              borderRight: '1px solid rgba(255,255,255,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#1e293b', 
              borderRight: '1px solid rgba(255,255,255,0.1)',
              height: '100%' 
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          pt: { xs: 8, sm: 3 }, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
      >
        {/* 面包屑导航栏 */}
        <Box sx={{ mb: 3, display: { xs: 'none', sm: 'block' } }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ '& .MuiBreadcrumbs-li': { fontWeight: 500 } }}
          >
            <Link 
              underline="hover" 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              仪表盘
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const name = breadcrumbNameMap[value] || value;

              return last ? (
                <Typography color="text.primary" key={to} sx={{ fontWeight: 700 }}>
                  {name}
                </Typography>
              ) : (
                <Link 
                  underline="hover" 
                  color="inherit" 
                  onClick={() => navigate(to)}
                  key={to}
                  sx={{ cursor: 'pointer' }}
                >
                  {name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
}