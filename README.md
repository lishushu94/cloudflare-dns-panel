# Cloudflare DNS 管理面板

一个现代化、基于 Docker 部署的 Cloudflare DNS 管理 Web 应用。支持多用户、自定义主机名 (Custom Hostname) 管理、SSL 证书监控及回退源 (Fallback Origin) 设置。

## ✨ 主要特性

- 🐳 **Docker 部署**：单镜像多阶段构建，前后端一体化部署，轻松集成 Dokploy/Portainer
- 🔐 **安全认证**：多用户系统，JWT 登录，Cloudflare Token 加密存储（AES-256-CBC）
- 🌐 **域名管理**：直观查看和搜索账户下的所有域名
- 📝 **DNS 记录**：快速添加、修改、删除 DNS 记录，支持 A/AAAA/CNAME/MX/TXT/SRV/CAA 等类型
- 🚀 **自定义主机名 (Custom Hostname)**：
    - 完整的生命周期管理（创建/删除）
    - 实时查看 SSL 证书验证状态及 TXT 记录
    - **回退源 (Fallback Origin)**：图形化配置回退源地址
- 📊 **操作日志**：全量记录用户操作，便于审计和回溯
- 💾 **数据持久化**：SQLite 数据库，支持 Volume 挂载

## 🚀 快速开始

### 方式一：Docker Compose（推荐）

#### 1. 配置环境变量

创建 `.env` 文件（或直接修改 `docker-compose.yml`）：

```bash
# 🔴 必须设置（生产环境）
JWT_SECRET=your-random-jwt-secret-min-32-chars-here
ENCRYPTION_KEY=your-32-character-encryption-key!!

# 🟡 建议设置
CORS_ORIGIN=http://localhost:3000
```

**生成安全密钥：**
```bash
# 生成 JWT_SECRET（建议 32+ 字符）
openssl rand -base64 48

# 生成 ENCRYPTION_KEY（必须 32 字符）
openssl rand -hex 16
```

#### 2. 启动服务

```bash
docker-compose up -d
```

#### 3. 访问应用

- **Web 界面**：[http://localhost:3000](http://localhost:3000)
- **健康检查**：[http://localhost:3000/health](http://localhost:3000/health)

#### 4. 初始配置

1. 访问 Web 界面，注册一个新账户
2. 登录后，进入 **"设置"** 页面
3. 填入您的 **Cloudflare API Token**
   > *注意：Token 需要具备 `Zone:Read`, `Zone:Edit`, `DNS:Edit`, `SSL and Certificates:Edit` 权限*

### 方式二：Docker 单镜像部署

```bash
# 构建镜像
docker build -t cf-dns-manager .

# 运行容器
docker run -d \
  --name cf-dns-manager \
  -p 3000:3000 \
  -e JWT_SECRET=your-secret-here \
  -e ENCRYPTION_KEY=your-32-char-key-here \
  -e DATABASE_URL=file:/app/data/database.db \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  cf-dns-manager
```

## 🛠️ 手动部署（开发环境）

如果您想进行二次开发或不使用 Docker，可以手动启动。

### 前置要求
- Node.js 18+
- npm 或 yarn

### 步骤

1. **克隆项目**:
   ```bash
   git clone <repository-url>
   cd CF
   ```

2. **后端配置与启动**:
   ```bash
   cd server

   # 安装依赖
   npm install

   # 配置环境变量
   cp .env.example .env
   # 编辑 .env 文件，设置 JWT_SECRET 和 ENCRYPTION_KEY

   # 初始化数据库
   npx prisma generate
   npx prisma migrate dev

   # 启动开发服务器
   npm run dev
   ```

3. **前端配置与启动**（新终端）:
   ```bash
   cd client

   # 安装依赖
   npm install

   # 启动开发服务器
   npm run dev
   ```

4. **访问应用**:
   - 前端：http://localhost:5173
   - 后端 API：http://localhost:3000

## ⚙️ 环境变量配置

本项目通过环境变量配置后端服务。在 Docker 环境中，可以通过 `docker-compose.yml` 或 `.env` 文件设置。

### 完整环境变量列表

| 变量名 | 描述 | 默认值 | 必须设置 | 说明 |
| :--- | :--- | :--- | :---: | :--- |
| `JWT_SECRET` | JWT 签名密钥 | `default-secret-key` | 🔴 **是** | 用于签名用户登录 Token，生产环境必须修改 |
| `ENCRYPTION_KEY` | 数据加密密钥 | `default-32-character-key-here!` | 🔴 **是** | 用于加密 Cloudflare API Token，必须 32 字符 |
| `DATABASE_URL` | 数据库路径 | `file:./database.db` | 🟡 建议 | SQLite 数据库文件路径，建议挂载到 volume |
| `CORS_ORIGIN` | CORS 允许的源 | `http://localhost:5173` | 🟡 建议 | 生产环境需设置为实际域名 |
| `NODE_ENV` | 运行环境 | `development` | ❌ 否 | `production` 或 `development` |
| `PORT` | 服务器端口 | `3000` | ❌ 否 | 后端监听端口 |
| `JWT_EXPIRES_IN` | Token 过期时间 | `7d` | ❌ 否 | 支持格式：`7d`, `24h`, `60m` |
| `LOG_RETENTION_DAYS` | 日志保留天数 | `90` | ❌ 否 | 操作日志保留时长 |

### 安全性说明

⚠️ **重要**：
- `JWT_SECRET` 和 `ENCRYPTION_KEY` 在生产环境中**必须**设置为强随机值
- 使用默认值会导致严重的安全风险
- `ENCRYPTION_KEY` 一旦设置后不要更改，否则已加密的数据将无法解密

> **注意**：`CF_API_TOKEN` **不需要**在环境变量中配置。它是按用户隔离的，由每个用户在 Web 界面的"设置"页面中自行配置。

## 📦 项目结构

```
CF/
├── docker-compose.yml          # Docker Compose 配置文件
├── Dockerfile                  # 多阶段构建 Dockerfile（单镜像方案）
├── .env.example                # 环境变量示例文件
├── README.md                   # 项目文档
│
├── client/                     # React + TypeScript 前端
│   ├── src/
│   │   ├── components/         # React 组件
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # API 服务
│   │   └── types/              # TypeScript 类型定义
│   ├── package.json
│   └── vite.config.ts          # Vite 配置
│
└── server/                     # Node.js + Express 后端
    ├── src/
    │   ├── config/             # 配置文件
    │   ├── middleware/         # Express 中间件
    │   ├── routes/             # API 路由
    │   ├── services/           # 业务逻辑
    │   │   ├── auth.ts         # 认证服务
    │   │   ├── cloudflare.ts   # Cloudflare API 封装
    │   │   └── logger.ts       # 日志服务
    │   ├── utils/              # 工具函数
    │   │   └── encryption.ts   # AES-256 加密工具
    │   ├── types/              # TypeScript 类型定义
    │   └── index.ts            # 入口文件
    ├── prisma/
    │   └── schema.prisma       # 数据库模型（SQLite）
    ├── package.json
    └── tsconfig.json
```

## 🛡️ 安全特性

### 多层安全保护

1. **JWT 认证**
   - 用户登录后颁发 JWT Token
   - Token 包含用户 ID、用户名、邮箱等信息
   - 可配置过期时间（默认 7 天）

2. **API Token 加密存储**
   - 使用 AES-256-CBC 算法加密用户的 Cloudflare API Token
   - 加密密钥通过环境变量配置
   - 数据库中仅存储加密后的 Token

3. **密码安全**
   - 使用 bcrypt 加密用户密码（10 轮 salt）
   - 强制密码复杂度要求：
     - 最少 8 位
     - 必须包含大小写字母和数字

4. **速率限制**
   - 登录接口：1 分钟内最多 5 次
   - DNS 操作：1 分钟内最多 30 次
   - 一般接口：1 分钟内最多 100 次

5. **操作日志**
   - 记录所有 DNS 操作（创建、更新、删除）
   - 记录操作者 IP 地址
   - 支持按时间、用户、操作类型筛选

### 关于 Cloudflare Token

本应用设计为**多用户 SaaS 模式**：

1. 系统管理员部署面板
2. 用户自行注册账户
3. 用户在"设置"页面填入**自己的** Cloudflare API Token
4. 后端将 Token 加密存储在数据库中
5. 仅在调用 Cloudflare API 时临时解密使用

**Token 权限要求**：
- `Zone:Read` - 读取域名列表
- `Zone:Edit` - 编辑域名设置
- `DNS:Edit` - 管理 DNS 记录
- `SSL and Certificates:Edit` - 管理自定义主机名和 SSL

## 🔧 常见问题

### 1. 容器启动后无法访问？

检查端口映射和防火墙设置：
```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs cf-dns-manager

# 检查健康状态
curl http://localhost:3000/health
```

### 2. 数据库文件在哪里？

默认位置：`./data/database.db`（宿主机）

查看数据库内容：
```bash
sqlite3 ./data/database.db
.tables
.schema users
```

### 3. 如何备份数据？

```bash
# 备份数据库
cp ./data/database.db ./data/database.db.backup

# 或使用 SQLite 导出
sqlite3 ./data/database.db .dump > backup.sql
```

### 4. 如何更新到最新版本？

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 5. 忘记了 ENCRYPTION_KEY 怎么办？

⚠️ **警告**：如果更改 `ENCRYPTION_KEY`，所有已加密的 Cloudflare API Token 将无法解密！

解决方案：
- 保持原有的 `ENCRYPTION_KEY` 不变
- 或者让所有用户重新设置他们的 Cloudflare API Token

## 📝 开发指南

### 技术栈

**前端**：
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**后端**：
- Node.js 18
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT
- bcrypt

### 本地开发

1. 安装依赖并启动后端：
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. 安装依赖并启动前端：
   ```bash
   cd client
   npm install
   npm run dev
   ```

### 数据库迁移

```bash
cd server

# 创建新的迁移
npx prisma migrate dev --name your_migration_name

# 应用迁移
npx prisma migrate deploy

# 重置数据库（开发环境）
npx prisma migrate reset
```

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过 GitHub Issues 联系。