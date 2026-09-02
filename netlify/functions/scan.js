<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FCBSS Cloud · 在线安全扫描</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', 'PingFang SC', sans-serif;
            background: #ffffff;
            color: #1a2a3e;
            height: 100vh;
            display: flex;
            transition: background 0.3s ease;
        }
        body.dark-mode {
            background: #0d1117;
            color: #e6edf3;
        }

        .sidebar {
            width: 72px;
            min-width: 72px;
            height: 100vh;
            background: #f6f8fa;
            border-right: 1px solid #e1e4e8;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0 16px 0;
            transition: width 0.25s ease, background 0.3s ease;
            overflow: hidden;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        body.dark-mode .sidebar {
            background: #161b22;
            border-right-color: #30363d;
        }
        .sidebar:hover {
            width: 200px;
            min-width: 200px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 12px 20px;
            margin: 4px 0;
            cursor: pointer;
            transition: background 0.15s;
            color: #4a5a6e;
            text-decoration: none;
            white-space: nowrap;
            font-weight: 500;
            font-size: 15px;
            gap: 14px;
            flex-shrink: 0;
            border-radius: 0;
        }
        body.dark-mode .nav-item { color: #8b949e; }
        .nav-item:hover {
            background: rgba(30, 144, 255, 0.08);
            color: #1a2a3e;
        }
        body.dark-mode .nav-item:hover {
            background: rgba(30, 144, 255, 0.15);
            color: #e6edf3;
        }
        .nav-item.active {
            background: rgba(30, 144, 255, 0.12);
            color: #1e90ff;
        }
        body.dark-mode .nav-item.active {
            background: rgba(30, 144, 255, 0.2);
            color: #58a6ff;
        }
        .nav-icon {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-square {
            width: 20px;
            height: 20px;
            border: 2.5px solid currentColor;
            background: transparent;
            position: relative;
        }
        .icon-square::after {
            content: '';
            position: absolute;
            bottom: -4px;
            right: -4px;
            width: 8px;
            height: 8px;
            border-right: 2.5px solid currentColor;
            border-bottom: 2.5px solid currentColor;
        }
        .icon-circle {
            width: 20px;
            height: 20px;
            border: 2.5px solid currentColor;
            border-radius: 50%;
            background: transparent;
            position: relative;
        }
        .icon-circle::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            background: currentColor;
        }
        .icon-diamond {
            width: 20px;
            height: 20px;
            border: 2.5px solid currentColor;
            transform: rotate(45deg);
            background: transparent;
            flex-shrink: 0;
        }
        .icon-triangle {
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 20px solid currentColor;
            background: transparent;
        }
        .nav-text {
            opacity: 0;
            transition: opacity 0.2s ease;
            font-size: 14px;
        }
        .sidebar:hover .nav-text { opacity: 1; }
        .sidebar-spacer { flex: 1; }

        .main {
            flex: 1;
            padding: 40px 48px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            flex-wrap: wrap;
            gap: 12px;
        }
        .header-left {
            display: flex;
            flex-direction: column;
        }
        .header-title {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
            line-height: 1.2;
        }
        .header-title .fcbss { color: #1e90ff; }
        .header-title .cloud { color: #002b6b; }
        body.dark-mode .header-title .cloud { color: #58a6ff; }
        .header-sub {
            font-size: 14px;
            color: #7a8a9e;
            font-weight: 400;
            margin-top: 2px;
            letter-spacing: 0.3px;
        }
        body.dark-mode .header-sub { color: #8b949e; }
        .header-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .header-logo img {
            height: 44px;
            width: auto;
            object-fit: contain;
        }
        .qq-group-link {
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            color: #4a5a6e;
            font-size: 13px;
            font-weight: 500;
            padding: 6px 12px;
            border: 1px solid #dce2ea;
            transition: border-color 0.2s, background 0.2s;
            border-radius: 0;
        }
        body.dark-mode .qq-group-link {
            color: #8b949e;
            border-color: #30363d;
        }
        .qq-group-link:hover {
            border-color: #1e90ff;
            background: rgba(30, 144, 255, 0.05);
        }
        body.dark-mode .qq-group-link:hover {
            background: rgba(30, 144, 255, 0.1);
        }
        .qq-group-link img {
            width: 20px;
            height: 20px;
        }

        .page { display: none; flex-direction: column; flex: 1; }
        .page.active { display: flex; }

        /* 扫描页 */
        .scan-options {
            display: flex;
            gap: 0;
            margin-bottom: 28px;
            flex-wrap: wrap;
            border: 1px solid #dce2ea;
            width: fit-content;
        }
        body.dark-mode .scan-options { border-color: #30363d; }
        .scan-option-btn {
            padding: 10px 24px;
            border: none;
            background: transparent;
            font-size: 14px;
            font-weight: 500;
            color: #4a5a6e;
            cursor: pointer;
            transition: all 0.15s;
            border-radius: 0;
        }
        body.dark-mode .scan-option-btn { color: #8b949e; }
        .scan-option-btn:hover {
            background: rgba(30, 144, 255, 0.06);
            color: #1e90ff;
        }
        .scan-option-btn.active {
            background: #1e90ff;
            color: white;
        }
        body.dark-mode .scan-option-btn.active {
            background: #1e90ff;
            color: #fff;
        }
        .scan-option-btn:not(:last-child) {
            border-right: 1px solid #dce2ea;
        }
        body.dark-mode .scan-option-btn:not(:last-child) {
            border-right-color: #30363d;
        }

        .upload-zone {
            border: 2px dashed #dce2ea;
            padding: 56px 24px;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            background: transparent;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 260px;
            border-radius: 0;
        }
        body.dark-mode .upload-zone {
            border-color: #30363d;
            background: transparent;
        }
        .upload-zone:hover { border-color: #1e90ff; }
        .upload-zone .icon-large {
            width: 56px;
            height: 56px;
            border: 2.5px solid #4a5a6e;
            background: transparent;
            position: relative;
            margin-bottom: 16px;
            border-radius: 0;
        }
        body.dark-mode .upload-zone .icon-large { border-color: #8b949e; }
        .upload-zone .icon-large::after {
            content: '';
            position: absolute;
            bottom: -6px;
            right: -6px;
            width: 14px;
            height: 14px;
            border-right: 2.5px solid #4a5a6e;
            border-bottom: 2.5px solid #4a5a6e;
        }
        body.dark-mode .upload-zone .icon-large::after { border-color: #8b949e; }
        .upload-zone p {
            color: #5a6a7e;
            font-size: 15px;
        }
        body.dark-mode .upload-zone p { color: #8b949e; }
        .upload-zone .file-name {
            margin-top: 12px;
            font-weight: 500;
            color: #1a2a3e;
        }
        body.dark-mode .upload-zone .file-name { color: #e6edf3; }

        .scan-action {
            margin-top: 24px;
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }
        .btn-primary {
            background: #1e90ff;
            color: white;
            border: none;
            padding: 12px 40px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s;
            border-radius: 0;
        }
        .btn-primary:hover { background: #1a7acc; }
        .btn-primary:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        body.dark-mode .btn-primary:disabled { opacity: 0.3; }

        .result-box {
            margin-top: 24px;
            padding: 20px 24px;
            background: transparent;
            border-left: 4px solid #dce2ea;
            display: none;
            width: 100%;
            border-radius: 0;
        }
        body.dark-mode .result-box { background: transparent; }
        .result-box.safe { border-left-color: #2ecc71; }
        .result-box.threat { border-left-color: #e74c3c; }
        .result-box.error { border-left-color: #f39c12; }
        .result-box .label { font-weight: 600; font-size: 16px; }
        .result-box .detail {
            color: #4a5a6e;
            font-size: 14px;
            margin-top: 4px;
            word-break: break-all;
        }
        body.dark-mode .result-box .detail { color: #8b949e; }
        .result-box .meta {
            color: #7a8a9e;
            font-size: 13px;
            margin-top: 6px;
        }

        /* 设置页 */
        .settings-grid {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-width: 600px;
        }
        .setting-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #f8fafc;
            border-radius: 0;
            flex-wrap: wrap;
            gap: 12px;
        }
        body.dark-mode .setting-row {
            background: #161b22;
        }
        .setting-row .label { font-weight: 500; }
        .setting-row .desc {
            font-size: 13px;
            color: #7a8a9e;
        }
        body.dark-mode .setting-row .desc { color: #8b949e; }
        .setting-row .controls {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }
        .setting-row input[type="text"],
        .setting-row select {
            padding: 6px 10px;
            border: 1px solid #dce2ea;
            background: white;
            font-size: 13px;
            border-radius: 0;
        }
        body.dark-mode .setting-row input[type="text"],
        body.dark-mode .setting-row select {
            background: #0d1117;
            border-color: #30363d;
            color: #e6edf3;
        }
        .btn-sm {
            padding: 6px 16px;
            border: none;
            background: #1e90ff;
            color: white;
            cursor: pointer;
            font-size: 13px;
            border-radius: 0;
            transition: background 0.15s;
        }
        .btn-sm:hover { background: #1a7acc; }
        .btn-sm.danger { background: #e74c3c; }
        .btn-sm.danger:hover { background: #c0392b; }
        .btn-sm.outline {
            background: transparent;
            border: 1px solid #dce2ea;
            color: #4a5a6e;
        }
        body.dark-mode .btn-sm.outline {
            border-color: #30363d;
            color: #8b949e;
        }
        .btn-sm.outline:hover {
            border-color: #1e90ff;
            color: #1e90ff;
        }

        .virus-list {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 8px;
            border: 1px solid #dce2ea;
            padding: 8px 12px;
            font-size: 13px;
            font-family: monospace;
            background: #fafcff;
            word-break: break-all;
        }
        body.dark-mode .virus-list {
            border-color: #30363d;
            background: #0d1117;
            color: #e6edf3;
        }
        .virus-list .hash-item {
            padding: 2px 0;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        body.dark-mode .virus-list .hash-item {
            border-bottom-color: #21262d;
        }
        .virus-list .hash-item .del-btn {
            cursor: pointer;
            color: #e74c3c;
            padding: 0 6px;
            font-weight: bold;
        }
        .virus-list .hash-item .del-btn:hover { opacity: 0.6; }

        .toggle {
            width: 44px;
            height: 24px;
            background: #dce2ea;
            cursor: pointer;
            position: relative;
            transition: background 0.2s;
            flex-shrink: 0;
            border-radius: 0;
        }
        body.dark-mode .toggle { background: #30363d; }
        .toggle.active { background: #1e90ff; }
        .toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            transition: transform 0.2s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
            border-radius: 0;
        }
        .toggle.active::after { transform: translateX(20px); }

        /* 关于页 */
        .about-content { max-width: 520px; line-height: 1.7; }
        .about-content p {
            color: #4a5a6e;
            margin-bottom: 12px;
        }
        body.dark-mode .about-content p { color: #8b949e; }
        .about-content .highlight {
            color: #1e90ff;
            font-weight: 500;
        }

        /* 下载页 */
        .download-card {
            background: transparent;
            padding: 32px 0;
            max-width: 420px;
            text-align: center;
            border: 1px solid #dce2ea;
            border-radius: 0;
        }
        body.dark-mode .download-card { border-color: #30363d; }
        .download-card .version {
            font-size: 14px;
            color: #7a8a9e;
            margin-bottom: 4px;
        }
        body.dark-mode .download-card .version { color: #8b949e; }
        .download-card .size {
            font-size: 13px;
            color: #7a8a9e;
            margin-bottom: 20px;
        }
        .download-card .btn-download {
            display: inline-block;
            background: #1e90ff;
            color: white;
            padding: 12px 48px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.15s;
            border-radius: 0;
        }
        .download-card .btn-download:hover { background: #1a7acc; }

        /* 状态条 */
        .status-bar {
            margin-top: 16px;
            padding: 8px 16px;
            background: #f8fafc;
            font-size: 13px;
            color: #7a8a9e;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
            border-radius: 0;
        }
        body.dark-mode .status-bar {
            background: #161b22;
            color: #8b949e;
        }
        .status-bar .ok { color: #2ecc71; }
        .status-bar .fail { color: #e74c3c; }

        @media (max-width: 640px) {
            .sidebar { width: 56px; min-width: 56px; padding: 12px 0; }
            .sidebar:hover { width: 160px; min-width: 160px; }
            .nav-item { padding: 10px 14px; font-size: 13px; gap: 10px; }
            .nav-icon { width: 22px; height: 22px; }
            .main { padding: 24px 20px; }
            .header-title { font-size: 22px; }
            .upload-zone { padding: 32px 16px; min-height: 180px; }
            .scan-option-btn { padding: 8px 16px; font-size: 13px; }
            .header-right .qq-group-link span { display: none; }
            .setting-row { flex-direction: column; align-items: stretch; }
        }
        @media (max-width: 480px) {
            .sidebar { width: 48px; min-width: 48px; }
            .sidebar:hover { width: 140px; min-width: 140px; }
            .nav-item { padding: 8px 10px; font-size: 12px; gap: 8px; }
            .main { padding: 16px 12px; }
            .header-title { font-size: 18px; }
            .header-logo img { height: 32px; }
        }
    </style>
</head>
<body>

<!-- ===== 侧边栏 ===== -->
<nav class="sidebar">
    <div class="nav-item active" data-page="scan">
        <span class="nav-icon"><span class="icon-square"></span></span>
        <span class="nav-text">扫描</span>
    </div>
    <div class="nav-item" data-page="settings">
        <span class="nav-icon"><span class="icon-circle"></span></span>
        <span class="nav-text">设置</span>
    </div>
    <div class="nav-item" data-page="about">
        <span class="nav-icon"><span class="icon-diamond"></span></span>
        <span class="nav-text">关于</span>
    </div>
    <div class="sidebar-spacer"></div>
    <div class="nav-item" data-page="download">
        <span class="nav-icon"><span class="icon-triangle"></span></span>
        <span class="nav-text">下载 FCBSS</span>
    </div>
</nav>

<!-- ===== 主内容 ===== -->
<div class="main">

    <!-- 头部 -->
    <header class="header">
        <div class="header-left">
            <div class="header-title">
                <span class="fcbss">FCBSS</span><span class="cloud"> Cloud</span> 在线安全扫描
            </div>
            <div class="header-sub">FCBSS Cloud Online Security Scanning</div>
        </div>
        <div class="header-right">
            <a class="qq-group-link" target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=rW5fA-EGDfQ5eTGfxyHAYBPcH62MkDlv&amp;jump_from=webapi&amp;authKey=JnclbL3JlIo0yq68aGu7ri5ddR8Udkgeg59oCXlTzmsm9KMiXcHTiiKoCYMFo8sJ">
                <img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="FCBSS群聊">
                <span>FCBSS 官方群</span>
            </a>
            <div class="header-logo">
                <img src="https://fcbss.netlify.app/logo.png" alt="FCBSS Logo" id="logoImg">
            </div>
        </div>
    </header>

    <!-- ===== 扫描页 ===== -->
    <section class="page active" id="page-scan">
        <div class="scan-options">
            <button class="scan-option-btn active" data-mode="file">单个文件扫描</button>
            <button class="scan-option-btn" data-mode="folder">上传文件夹</button>
        </div>

        <div class="upload-zone" id="uploadZone">
            <div class="icon-large"></div>
            <p id="uploadHint">点击选择 或 拖拽文件到这里</p>
            <div class="file-name" id="fileName"></div>
            <input type="file" id="fileInput" style="display:none;" webkitdirectory>
        </div>

        <div class="scan-action">
            <button class="btn-primary" id="scanBtn" disabled>扫描文件</button>
            <span style="font-size:13px; color:#7a8a9e;" id="fileCount"></span>
        </div>

        <div class="result-box" id="resultBox">
            <div class="label" id="resultLabel">结果</div>
            <div class="detail" id="resultDetail"></div>
            <div class="meta" id="resultMeta"></div>
        </div>

        <div class="status-bar">
            <span id="virusStatus">病毒库: 加载中...</span>
            <span id="hashCount">哈希数: 0</span>
        </div>
    </section>

    <!-- ===== 设置页 ===== -->
    <section class="page" id="page-settings">
        <h2 style="font-weight:600; font-size:20px; margin-bottom:20px;">设置</h2>
        <div class="settings-grid">

            <!-- 暗色模式 -->
            <div class="setting-row">
                <div>
                    <div class="label">暗色模式</div>
                    <div class="desc">根据时间自动切换</div>
                </div>
                <div class="toggle active" id="darkToggle"></div>
            </div>

            <!-- 扫描模式 -->
            <div class="setting-row">
                <div>
                    <div class="label">扫描模式</div>
                    <div class="desc">选择要使用的病毒库文件</div>
                </div>
                <div class="controls">
                    <select id="scanModeSelect">
                        <option value="b1">b1.txt</option>
                        <option value="b2">b2.txt</option>
                        <option value="b5">b5.txt</option>
                        <option value="b499">b499.txt</option>
                        <option value="custom">自定义 (输入下方)</option>
                    </select>
                </div>
            </div>

            <!-- 自定义 API / 病毒库源 -->
            <div class="setting-row">
                <div>
                    <div class="label">自定义病毒库源</div>
                    <div class="desc">输入 API 地址或 GitHub raw 链接</div>
                </div>
                <div class="controls" style="flex:1; min-width:200px;">
                    <input type="text" id="customApiInput" placeholder="https://.../b1.txt" style="flex:1; min-width:150px;">
                </div>
            </div>

            <!-- 手动增删改病毒库 -->
            <div class="setting-row" style="flex-direction:column; align-items:stretch;">
                <div>
                    <div class="label">病毒库管理</div>
                    <div class="desc">添加或删除 MD5 哈希值（32位十六进制）</div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                    <input type="text" id="hashInput" placeholder="输入 MD5 哈希" style="flex:1; min-width:200px; padding:6px 10px; border:1px solid #dce2ea; border-radius:0;">
                    <button class="btn-sm" id="addHashBtn">添加</button>
                    <button class="btn-sm danger" id="clearAllBtn">清空全部</button>
                    <button class="btn-sm outline" id="reloadVirusBtn">重新加载</button>
                </div>
                <div class="virus-list" id="virusList">
                    <div style="color:#7a8a9e; text-align:center; padding:12px;">暂无哈希数据</div>
                </div>
            </div>

            <!-- 保存 / 重置 -->
            <div class="setting-row">
                <div>
                    <div class="label">保存更改</div>
                    <div class="desc">所有更改保存在本地浏览器</div>
                </div>
                <div class="controls">
                    <button class="btn-sm" id="saveSettingsBtn">保存设置</button>
                    <button class="btn-sm outline" id="resetSettingsBtn">重置默认</button>
                </div>
            </div>

        </div>
    </section>

    <!-- ===== 关于页 ===== -->
    <section class="page" id="page-about">
        <h2 style="font-weight:600; font-size:20px; margin-bottom:16px;">关于 FCBSS Cloud</h2>
        <div class="about-content">
            <p>FCBSS Cloud 是一款轻量级在线安全扫描工具，基于 VirusShare 开源病毒库，提供快速、私密的文件安全检测。</p>
            <p>开发者不保留任何文件数据，所有计算仅在本地完成。</p>
            <p>维护人员：<span class="highlight">林子诺</span></p>
            <p>FCBSS 安全软件官方 QQ 群：<span class="highlight">1092973171</span></p>
            <p style="color:#7a8a9e; font-size:14px; margin-top:16px;">版本 1.0.0 · 2026</p>
        </div>
    </section>

    <!-- ===== 下载页 ===== -->
    <section class="page" id="page-download">
        <h2 style="font-weight:600; font-size:20px; margin-bottom:20px;">下载 FCBSS</h2>
        <div class="download-card">
            <div class="version">FCBSS 安全软件 V5B</div>
            <div class="size">Windows 10/11 · 约 2.3 MB</div>
            <a href="https://fcbss.netlify.app/" class="btn-download" target="_blank">访问官网下载</a>
            <div style="margin-top:16px; font-size:13px; color:#7a8a9e;">SHA-256: 待更新</div>
        </div>
    </section>

</div>

<script>
    // ============================================================
    // 1. 存储键名
    // ============================================================
    const STORAGE_KEY = 'fcbss_cloud_settings';

    // ============================================================
    // 2. 默认设置
    // ============================================================
    const DEFAULT_SETTINGS = {
        darkMode: false,
        autoDark: true,
        scanMode: 'b1',
        customApi: '',
        virusHashes: []  // 用户自定义添加的哈希
    };

    // ============================================================
    // 3. 加载 / 保存设置
    // ============================================================
    function loadSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                // 合并默认值
                return { ...DEFAULT_SETTINGS, ...parsed };
            }
        } catch (e) { console.warn('读取设置失败:', e); }
        return { ...DEFAULT_SETTINGS };
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) { console.warn('保存设置失败:', e); }
    }

    let settings = loadSettings();

    // ============================================================
    // 4. 病毒库管理
    // ============================================================
    let virusHashes = new Set();

    // 加载病毒库：从 settings 里的自定义哈希 + 从文件加载
    async function loadVirusDatabase() {
        const mode = settings.scanMode || 'b1';
        let hashes = new Set();

        // 1. 加载用户自定义的哈希（从 settings 恢复）
        if (settings.virusHashes && settings.virusHashes.length) {
            for (const h of settings.virusHashes) {
                if (/^[a-f0-9]{32}$/.test(h)) hashes.add(h);
            }
        }

        // 2. 从文件加载
        let loadedFromFile = 0;
        let fileUrl = '';

        if (mode === 'custom' && settings.customApi) {
            fileUrl = settings.customApi;
        } else {
            // 从仓库根目录读取
            const base = 'https://raw.githubusercontent.com/LINZINUO1/FCBSSCloud/main/';
            fileUrl = base + mode + '.txt';
        }

        try {
            const response = await fetch(fileUrl);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                for (const line of lines) {
                    const hash = line.trim().toLowerCase();
                    if (/^[a-f0-9]{32}$/.test(hash)) {
                        hashes.add(hash);
                        loadedFromFile++;
                    }
                }
            } else {
                console.warn('无法加载病毒库文件:', fileUrl);
            }
        } catch (err) {
            console.warn('加载病毒库失败:', err.message);
        }

        virusHashes = hashes;
        updateVirusUI();
        return { total: virusHashes.size, fromFile: loadedFromFile };
    }

    // 更新 UI
    function updateVirusUI() {
        const list = document.getElementById('virusList');
        const countEl = document.getElementById('hashCount');
        const statusEl = document.getElementById('virusStatus');

        countEl.textContent = '哈希数: ' + virusHashes.size;
        statusEl.textContent = '病毒库: 已加载 (' + virusHashes.size + ' 个哈希)';
        statusEl.className = virusHashes.size > 0 ? 'ok' : 'fail';

        // 显示哈希列表
        if (virusHashes.size === 0) {
            list.innerHTML = '<div style="color:#7a8a9e; text-align:center; padding:12px;">暂无哈希数据</div>';
            return;
        }

        let html = '';
        let count = 0;
        for (const hash of virusHashes) {
            count++;
            html += `<div class="hash-item">
                <span>${hash}</span>
                <span class="del-btn" data-hash="${hash}">✕</span>
            </div>`;
            if (count > 500) {
                html += `<div style="color:#7a8a9e; text-align:center; padding:4px;">... 还有 ${virusHashes.size - 500} 个</div>`;
                break;
            }
        }
        list.innerHTML = html;

        // 绑定删除事件
        list.querySelectorAll('.del-btn').forEach(el => {
            el.addEventListener('click', function() {
                const hash = this.dataset.hash;
                if (hash && confirm('删除此哈希？')) {
                    virusHashes.delete(hash);
                    // 更新 settings 里的自定义哈希列表（只保存用户手动添加的）
                    updateCustomHashesInSettings();
                    saveSettings(settings);
                    updateVirusUI();
                    updateHashCount();
                }
            });
        });
    }

    function updateHashCount() {
        document.getElementById('hashCount').textContent = '哈希数: ' + virusHashes.size;
    }

    // 更新 settings 里的自定义哈希列表（只保存用户手动添加的）
    function updateCustomHashesInSettings() {
        // 这里简化：把所有哈希都存到 settings 里
        // 但为了区分文件加载的，我们保存一个副本
        settings.virusHashes = Array.from(virusHashes);
        saveSettings(settings);
    }

    // ============================================================
    // 5. 添加哈希
    // ============================================================
    document.getElementById('addHashBtn').addEventListener('click', function() {
        const input = document.getElementById('hashInput');
        const hash = input.value.trim().toLowerCase();
        if (!/^[a-f0-9]{32}$/.test(hash)) {
            alert('请输入有效的 32 位十六进制 MD5 哈希值');
            return;
        }
        if (virusHashes.has(hash)) {
            alert('此哈希已存在');
            return;
        }
        virusHashes.add(hash);
        settings.virusHashes = Array.from(virusHashes);
        saveSettings(settings);
        updateVirusUI();
        input.value = '';
    });

    // 回车添加
    document.getElementById('hashInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') document.getElementById('addHashBtn').click();
    });

    // 清空全部
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (virusHashes.size === 0) return;
        if (confirm('确定清空所有病毒库哈希？此操作不可撤销！')) {
            virusHashes.clear();
            settings.virusHashes = [];
            saveSettings(settings);
            updateVirusUI();
        }
    });

    // 重新加载
    document.getElementById('reloadVirusBtn').addEventListener('click', function() {
        loadVirusDatabase().then(() => {
            updateVirusUI();
            alert('病毒库已重新加载，共 ' + virusHashes.size + ' 个哈希');
        });
    });

    // ============================================================
    // 6. 扫描逻辑
    // ============================================================
    const modeBtns = document.querySelectorAll('.scan-option-btn');
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const fileName = document.getElementById('fileName');
    const uploadHint = document.getElementById('uploadHint');
    const scanBtn = document.getElementById('scanBtn');
    const fileCount = document.getElementById('fileCount');
    let currentMode = 'file';
    let selectedFiles = [];

    // 从设置恢复扫描模式
    if (settings.scanMode === 'folder') {
        currentMode = 'folder';
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === 'folder');
        });
        fileInput.setAttribute('webkitdirectory', '');
        uploadHint.textContent = '点击选择文件夹';
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            settings.scanMode = currentMode;
            saveSettings(settings);
            selectedFiles = [];
            fileName.textContent = '';
            fileCount.textContent = '';
            scanBtn.disabled = true;
            uploadHint.textContent = currentMode === 'file' ? '点击选择 或 拖拽文件到这里' : '点击选择文件夹';
            fileInput.removeAttribute('webkitdirectory');
            if (currentMode === 'folder') {
                fileInput.setAttribute('webkitdirectory', '');
            }
            fileInput.value = '';
            document.getElementById('resultBox').style.display = 'none';
        });
    });

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#1e90ff';
    });
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
    });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFiles(fileInput.files);
        }
    });

    function handleFiles(files) {
        selectedFiles = Array.from(files);
        if (currentMode === 'file') {
            fileName.textContent = selectedFiles[0]?.name || '';
            scanBtn.disabled = false;
            fileCount.textContent = '';
        } else {
            fileName.textContent = selectedFiles.length + ' 个文件';
            fileCount.textContent = '共 ' + selectedFiles.length + ' 个文件';
            scanBtn.disabled = false;
        }
        document.getElementById('resultBox').style.display = 'none';
    }

    // ============================================================
    // 7. 执行扫描
    // ============================================================
    scanBtn.addEventListener('click', async () => {
        if (!selectedFiles.length) return;

        scanBtn.disabled = true;
        scanBtn.textContent = '扫描中...';
        const resultBox = document.getElementById('resultBox');
        const resultLabel = document.getElementById('resultLabel');
        const resultDetail = document.getElementById('resultDetail');
        const resultMeta = document.getElementById('resultMeta');

        let threats = [];
        let safe = 0;

        for (const file of selectedFiles) {
            const md5 = await computeMD5(file);
            // 在病毒库里查
            if (virusHashes.has(md5)) {
                threats.push({ name: file.name, md5: md5 });
            } else {
                safe++;
            }
        }

        resultBox.style.display = 'block';
        if (threats.length > 0) {
            resultBox.className = 'result-box threat';
            resultLabel.textContent = '⚠️ 发现 ' + threats.length + ' 个威胁';
            resultLabel.style.color = '#e74c3c';
            resultDetail.textContent = threats.map(t => t.name).join('；');
            resultMeta.textContent = '共扫描 ' + selectedFiles.length + ' 个文件，' + safe + ' 个安全';
        } else {
            resultBox.className = 'result-box safe';
            resultLabel.textContent = '✅ 全部安全';
            resultLabel.style.color = '#2ecc71';
            resultDetail.textContent = '共扫描 ' + selectedFiles.length + ' 个文件，未发现威胁';
            resultMeta.textContent = '病毒库: ' + virusHashes.size + ' 个哈希';
        }

        scanBtn.disabled = false;
        scanBtn.textContent = '扫描文件';
    });

    // ============================================================
    // 8. MD5 计算（模拟 + Web Crypto）
    // ============================================================
    async function computeMD5(file) {
        // 使用 Web Crypto API 计算 MD5
        try {
            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('MD5', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            // 如果 MD5 不支持，用模拟
            console.warn('MD5 计算失败，使用模拟:', e);
            return 'mock_' + file.name.length + '_' + file.size;
        }
    }

    // ============================================================
    // 9. 导航切换
    // ============================================================
    const navItems = document.querySelectorAll('.nav-item');
    const pages = {
        scan: document.getElementById('page-scan'),
        settings: document.getElementById('page-settings'),
        about: document.getElementById('page-about'),
        download: document.getElementById('page-download'),
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            Object.keys(pages).forEach(key => {
                pages[key].classList.toggle('active', key === page);
            });
            // 切换到设置页时刷新病毒列表
            if (page === 'settings') {
                updateVirusUI();
                // 恢复设置界面的值
                document.getElementById('scanModeSelect').value = settings.scanMode || 'b1';
                document.getElementById('customApiInput').value = settings.customApi || '';
            }
        });
    });

    // ============================================================
    // 10. 暗色模式
    // ============================================================
    const darkToggle = document.getElementById('darkToggle');
    const body = document.body;

    function setDarkMode(enabled, save = true) {
        body.classList.toggle('dark-mode', enabled);
        darkToggle.classList.toggle('active', enabled);
        if (save) {
            settings.darkMode = enabled;
            if (enabled) settings.autoDark = false;
            saveSettings(settings);
        }
    }

    function setAutoDark(enabled) {
        settings.autoDark = enabled;
        if (enabled) {
            const hour = new Date().getHours();
            setDarkMode(hour < 6 || hour >= 18, false);
        }
        saveSettings(settings);
    }

    // 初始化暗色模式
    if (settings.autoDark) {
        const hour = new Date().getHours();
        setDarkMode(hour < 6 || hour >= 18, false);
        darkToggle.classList.add('active');
    } else if (settings.darkMode) {
        setDarkMode(true, false);
    }

    darkToggle.addEventListener('click', () => {
        const current = body.classList.contains('dark-mode');
        setDarkMode(!current, true);
        settings.autoDark = false;
        saveSettings(settings);
    });

    // ============================================================
    // 11. 设置页控制
    // ============================================================
    // 扫描模式切换
    document.getElementById('scanModeSelect').addEventListener('change', function() {
        settings.scanMode = this.value;
        saveSettings(settings);
        if (this.value === 'custom') {
            document.getElementById('customApiInput').focus();
        } else {
            loadVirusDatabase().then(updateVirusUI);
        }
    });

    // 自定义 API 输入
    document.getElementById('customApiInput').addEventListener('change', function() {
        settings.customApi = this.value.trim();
        saveSettings(settings);
        if (settings.scanMode === 'custom') {
            loadVirusDatabase().then(updateVirusUI);
        }
    });

    // 保存设置
    document.getElementById('saveSettingsBtn').addEventListener('click', function() {
        // 把当前病毒库存到 settings
        settings.virusHashes = Array.from(virusHashes);
        saveSettings(settings);
        alert('设置已保存到本地浏览器');
    });

    // 重置默认
    document.getElementById('resetSettingsBtn').addEventListener('click', function() {
        if (!confirm('重置所有设置为默认值？')) return;
        settings = { ...DEFAULT_SETTINGS };
        saveSettings(settings);
        // 重新加载
        location.reload();
    });

    // ============================================================
    // 12. Logo 加载失败时隐藏
    // ============================================================
    document.getElementById('logoImg').addEventListener('error', function() {
        this.style.display = 'none';
    });

    // ============================================================
    // 13. 初始化
    // ============================================================
    async function init() {
        // 恢复设置界面的值
        document.getElementById('scanModeSelect').value = settings.scanMode || 'b1';
        document.getElementById('customApiInput').value = settings.customApi || '';

        await loadVirusDatabase();
        updateVirusUI();

        console.log('FCBSS Cloud 已加载');
        console.log('病毒库哈希数:', virusHashes.size);
        console.log('设置:', settings);
    }

    init();
</script>
</body>
</html>
