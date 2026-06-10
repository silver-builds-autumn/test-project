# Backend

这是当前仓库全栈改造里的后端服务层，不再只是接口骨架。

当前已落地能力：
- FastAPI 启动入口
- SQLAlchemy Async 数据访问
- 本地 SQLite 开发数据库
- 启动建表 + 种子初始化
- 点位、路线、人工点位、通行方式、实景资源接口

## 本地开发默认值

- 服务地址：`http://localhost:8000`
- 健康检查：`http://localhost:8000/health`
- 数据库文件：`backend/data/dragon_boat_guide.db`
- 默认数据库连接：`sqlite+aiosqlite:///backend/data/dragon_boat_guide.db`

## 安装依赖

```bash
python -m pip install -e .
```

## 启动方式

### 直接启动

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 用仓库脚本启动

```bash
powershell -ExecutionPolicy Bypass -File ../scripts/start_backend.ps1
```

## 启动后会发生什么

- 自动创建数据库目录
- 自动建表
- 如果数据库为空，自动写入三日行程种子数据
- 自动生成初始路线段

## 常用接口

- `GET /health`
- `GET /spots?itineraryId=1`
- `POST /spots`
- `PATCH /spots/{spot_id}`
- `PATCH /spots/reorder`
- `GET /routes?itineraryId=1`
- `POST /routes/optimize`
- `POST /routes/recalculate`
- `POST /manual-locations`
- `POST /transport-configs`
- `GET /resources/real-scenes`

## 当前目标定位

当前阶段目标：
- 跑通真实数据库读写
- 给前端提供稳定 DTO 边界
- 保留后续路线算法、地址解析和资源增强的扩展口
