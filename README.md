# PDF工具盒

纯浏览器端的 PDF 工具箱：PDF 合并、PDF 拆分、图片转 PDF、PDF 转图片。所有处理均在本地浏览器中完成，**文件不会上传到任何服务器**，可离线使用。

## 功能

| 功能 | 说明 |
| --- | --- |
| PDF 合并 | 按列表顺序将多个 PDF 合并为一份，支持拖拽调整顺序 |
| PDF 拆分 | 上传单个 PDF，勾选需要的页面，合并导出或逐页独立导出（ZIP） |
| 图片转 PDF | 将多张 PNG / JPG 图片按顺序转换为一个 PDF，支持拖拽调整顺序 |
| PDF 转图片 | 将选中页面导出为 PNG 图片（ZIP 打包） |

## 技术栈

- Vue 3 + Vite + Pinia + Vue Router
- pdf-lib：PDF 合并 / 拆分 / 生成
- pdfjs-dist：PDF 渲染与图片导出
- JSZip：多文件打包
- vue-draggable-plus：卡片拖拽排序
- Tailwind CSS

## 本地开发

环境要求：Node.js ≥ 22.18（或 ≥ 24.12）

```sh
pnpm install
pnpm dev
```

启动后访问 http://localhost:5173

## 构建

```sh
pnpm build        # 产物输出到 dist/
pnpm preview      # 本地预览构建产物
```
