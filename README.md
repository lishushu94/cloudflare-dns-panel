# Cloudflare DNS 管理面板 (Docker版)

一个现代化、基于 Docker 部署的 Cloudflare DNS 管理 Web 应用。支持多用户、自定义主机名 (Custom Hostname) 管理、SSL 证书监控及回退源 (Fallback Origin) 设置。

## ✨ 主要特性

- 🐳 **Docker 部署**：支持 Docker Compose 一键拉起，也支持单一镜像部署，轻松集成 Dokploy/Portainer。
- 🔐 **安全认证**：多用户系统，支持 JWT 登录，每个用户独立管理自己的 Cloudflare Token（Token 加密存储）。
- 🌐 **域名管理**：直观查看和搜索账户下的所有域名。
- 📝 **DNS 记录**：快速添加、修改、删除 DNS 记录，支持批量操作。
- 🚀 **自定义主机名 (Custom Hostname)**：
    - 完整的生命周期管理（创建/删除）。
    - 实时查看 SSL 证书验证状态及 TXT 记录。
    - **回退源 (Fallback Origin)**：图形化配置回退源地址。
- 📊 **操作日志**：全量记录用户操作，便于审计和回溯。

## 🚀 快速开始 (Docker 推荐)

您可以通过 Docker Compose 快速启动本项目。

### 1. 启动服务

在项目根目录下运行：

```bash
docker-compose up -d
```

### 2. 访问应用

- **前端面板**：[http://localhost](http://localhost) (80端口)
- **API 服务**：[http://localhost:3000](http://localhost:3000) (后端接口)

### 3. 初始配置

1. 访问前端页面，注册一个新账户。
2. 登录后，进入 **"设置"** 页面。
3. 填入您的 **Cloudflare API Token**。
   > *注意：Token 需要具备 Zone:Edit, DNS:Edit 等权限。*

## 🛠️ 手动部署 (开发环境)

如果您想进行二次开发或不使用 Docker，可以手动启动。

### 前置要求
- Node.js 18+
- SQLite

### 步骤

1. **后端启动**:
   ```bash
   cd server
   cp .env.example .env  # 务必修改 JWT_SECRET
   npm install
   npx prisma migrate dev
   npm run dev
   ```

2. **前端启动**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## ⚙️ 环境变量配置

本项目主要通过环境变量配置后端服务的安全性。在 Docker 环境中，您可以直接修改 `docker-compose.yml` 或注入环境变量。

| 变量名 | 描述 | 默认值/示例 | 是否必须 |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | 运行环境 | `production` | 是 |
| `PORT` | 后端端口 | `3000` | 是 |
| `DATABASE_URL` | 数据库路径 | `file:/app/data/dev.db` | 是 |
| `JWT_SECRET` | JWT签名密钥 | **务必修改为随机长字符串** | **是 (极重要)** |
| `JWT_EXPIRES_IN` | Token过期时间 | `7d` | 否 |
| `ENCRYPTION_KEY` | 敏感数据加密密钥 | 32位随机字符串 | 否 (建议修改) |

> **注意**：`CF_API_TOKEN` **不需要**在环境变量中配置。它是按用户隔离的，由每个用户在 Web 界面中自行设置。

## 📦 项目结构

```
CF/
├── docker-compose.yml   # Docker编排文件
├── Dockerfile           # 多阶段构建文件 (单镜像方案)
├── client/              # React 前端
│   ├── Dockerfile
│   └── nginx.conf       # Nginx 反向代理配置
└── server/              # Node.js 后端
    ├── Dockerfile
    └── prisma/          # 数据库模型 (SQLite)
```

## 🛡️ 关于 Cloudflare Token

本应用设计为多用户SaaS模式：
1. 系统管理员部署面板。
2. 用户注册账户。
3. 用户在“设置”中填入**自己的** Cloudflare API Token。
4. 后端将 Token 加密存储在数据库中，仅在发起请求时解密使用。

## License

MIT