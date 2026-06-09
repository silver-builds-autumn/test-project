# 2026 端午广州龙舟珠海三日图文攻略

纯静态响应式 Web/H5 站点，支持手机与电脑访问。

## 在线预览

将项目部署到任意静态服务器后，通过浏览器访问 `index.html` 即可。

## 项目结构

```
dragon-boat-guide/
├── index.html          # 主页面
├── css/
│   └── style.css       # 响应式样式（移动优先）
├── js/
│   ├── data.js         # 攻略数据
│   ├── map.js          # 天地图 API 封装
│   └── app.js          # 页面交互与渲染
├── images/
│   ├── from-docx/      # docx 提取的原始图片
│   └── web/            # 补充的网络素材
└── README.md
```

## 本地预览

无需构建工具，直接在浏览器中打开 `index.html` 即可预览：

```bash
# 方式1：直接打开文件
open index.html

# 方式2：用本地服务器（推荐，解决跨域）
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# 然后访问 http://localhost:8080
```

## 部署到服务器

本项目为纯静态站点，可直接部署到以下平台：

### Nginx / Apache
将 `dragon-boat-guide` 目录上传到服务器 web 根目录即可。

### GitHub Pages
1. 将代码推送到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. Source 选择 Deploy from a branch，选择 `main` 分支和 `/ (root)` 目录
4. 访问 `https://<username>.github.io/<repo-name>/`

### 阿里云 OSS / 腾讯云 COS
1. 创建 Bucket，开启静态网站托管
2. 上传所有文件
3. 绑定自定义域名并配置 CDN

### Vercel / Netlify
1. 导入 GitHub 仓库
2. 构建命令留空，发布目录设为 `./`
3. 自动部署

## 图片替换说明

项目中的图片路径：
- `images/from-docx/image*.png` — 从 docx 提取的原始图片
- `images/web/*.jpg` — 需要补充的景点/餐饮/住宿实图

若图片缺失，页面会自动显示占位图。请按以下方式替换：

1. 从 docx 提取图片到 `images/from-docx/`
2. 搜索并下载对应景点/餐厅/酒店图片到 `images/web/`
3. 修改 `js/data.js` 中的 `images` 数组，指向正确的图片路径

## 地图密钥

当前使用的天地图密钥：`a2ca005a710864da5d797e35e0f45b3b`

如密钥失效，请前往 [天地图开发者中心](https://console.tianditu.gov.cn/) 申请新密钥，并修改 `index.html` 中天地图 API 的 `tk` 参数：

```html
<script src="https://api.tianditu.gov.cn/api?v=4.0&tk=你的密钥"></script>
```

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- 天地图 JavaScript API 4.0
- 响应式设计（移动优先）
- 无构建工具、无框架依赖

## 浏览器兼容

- Chrome / Edge / Safari / Firefox 最新版
- iOS Safari 12+
- Android Chrome 80+

## 许可证

仅供个人旅行参考使用。