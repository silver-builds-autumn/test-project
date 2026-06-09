# Nginx 部署说明

本文档说明如何把当前静态前端项目部署到 Nginx。

## 部署信息

- 项目类型：纯静态前端项目
- 前端部署目录：`/home/projects/web/dragon-boat-guide`
- Nginx 配置文件：`/etc/nginx/sites-enabled/dragon-boat-guide.conf`
- 入口文件：`index.html`
- 静态资源目录：`css/`、`js/`、`images/`
- SSH开源工具-Tabby Terminal：https://github.com/Eugeny/tabby
- 文件传输工具-WinSCP（windows）：https://winscp.net/eng/download.php

## 服务器前置条件

服务器需要已安装 Nginx。

```bash
nginx -v
```

如果未安装，可在 Debian / Ubuntu 系统上执行：

```bash
sudo apt update
sudo apt install -y nginx
```

## 创建部署目录

```bash
sudo mkdir -p /home/projects/web/dragon-boat-guide
```

建议把目录归属设置为当前部署用户，Nginx 只需要读取权限即可。

```bash
sudo chown -R $USER:$USER /home/projects/web/dragon-boat-guide
```

## 上传前端文件

本项目不需要构建，直接上传项目静态文件即可。

需要上传的核心内容：

```text
index.html
css/
js/
images/
README.md
LICENSE
UPDATE_LOG.md
```

如果需要保留原始 Word / PPT 资料，也可以上传：

```text
端午节攻略/
```

如果只用于线上访问，不建议上传 `.git/`、临时文件、编辑器缓存文件。

示例上传方式：

```bash
rsync -av --delete \
  --exclude '.git' \
  --exclude '.DS_Store' \
  ./ /home/projects/web/dragon-boat-guide/
```

上传后确认入口文件存在：

```bash
ls -la /home/projects/web/dragon-boat-guide/index.html
```

## 配置 Nginx

编辑配置文件：

```bash
sudo vim /etc/nginx/sites-enabled/dragon-boat-guide.conf
```

写入以下配置。请把 `server_name` 替换为实际域名；如果暂时没有域名，可以先使用服务器 IP 或 `_`。

```nginx
server {
    listen 80;
    server_name example.com;

    root /home/projects/web/dragon-boat-guide;
    index index.html;

    access_log /var/log/nginx/dragon-boat-guide.access.log;
    error_log /var/log/nginx/dragon-boat-guide.error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:css|js|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    location ~* \.(?:html)$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        try_files $uri =404;
    }
}
```

如果使用服务器 IP 直接访问，可以临时写成：

```nginx
server_name _;
```

## 检查 Nginx 配置

```bash
sudo nginx -t
```

看到类似结果表示配置通过：

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## 重载 Nginx

```bash
sudo systemctl reload nginx
```

如果 Nginx 尚未启动：

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 访问验证

浏览器访问：

```text
http://你的域名/
```

或：

```text
http://服务器IP/
```

需要确认：

- 首页可以正常打开
- `css/style.css` 加载正常
- `js/data.js`、`js/map.js`、`js/app.js` 加载正常
- `images/from-docx/` 图片显示正常
- 地图区域能正常渲染
- 浏览器控制台无明显 404 错误

## 常见问题

### 页面打开后没有样式

检查静态资源是否上传完整：

```bash
ls -la /home/projects/web/dragon-boat-guide/css/style.css
```

检查 Nginx 是否指向了正确目录：

```bash
sudo nginx -T | grep -n "dragon-boat-guide" -C 5
```

### 地图不显示

当前项目依赖外部 CDN 与天地图服务，服务器或客户端网络需要能访问：

```text
https://cdn.jsdelivr.net
https://api.tianditu.gov.cn
https://t0.tianditu.gov.cn
https://t1.tianditu.gov.cn
https://t2.tianditu.gov.cn
https://t3.tianditu.gov.cn
https://t4.tianditu.gov.cn
https://t5.tianditu.gov.cn
https://t6.tianditu.gov.cn
https://t7.tianditu.gov.cn
```

如果页面能打开但地图空白，优先检查浏览器控制台和网络请求。

### 403 Forbidden

通常是目录权限或 Nginx 读取权限问题。

确认目录存在且 Nginx 有读取权限：

```bash
namei -l /home/projects/web/dragon-boat-guide/index.html
```

必要时设置读取权限：

```bash
chmod -R a+rX /home/projects/web/dragon-boat-guide
```

### 修改后页面仍是旧内容

静态资源设置了缓存。更新 `css/`、`js/`、`images/` 后，如果浏览器仍显示旧内容，可以：

- 强制刷新浏览器
- 临时清理浏览器缓存
- 给资源文件名增加版本号
- 调整 Nginx 静态资源缓存策略

`index.html` 已配置为不缓存，正常情况下入口页会优先读取最新版本。

## 更新部署流程

后续更新时执行：

```bash
rsync -av --delete \
  --exclude '.git' \
  --exclude '.DS_Store' \
  ./ /home/projects/web/dragon-boat-guide/

sudo nginx -t
sudo systemctl reload nginx
```

如果只更新静态文件且 Nginx 配置未变，通常不需要 reload；但执行 reload 是安全的。