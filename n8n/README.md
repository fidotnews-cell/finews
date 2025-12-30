# n8n 本地工作流指南

## 1. 启动 n8n
由于 Docker Desktop 可能被暂停，请先手动确保 Docker Desktop 正在运行。
然后运行以下命令启动 n8n：

```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

## 2. 访问 n8n
打开浏览器访问：http://localhost:5678

## 3. 导入工作流
1.  在 n8n 界面左上角点击 **Workflows** -> **Import from File**。
2.  选择文件：`/Users/tombook/finews/n8n/coindesk_workflow.json`。

## 4. 配置 Sanity 凭证 (Credentials)
1.  在 n8n 中打开 **Sanity** 节点。
2.  在 **Credential for Sanity API** 下拉菜单中选择 **Create New**。
3.  填写以下信息：
    *   **Project ID**: `y9yii7ro`
    *   **Dataset**: `production`
    *   **API Token**: 需要在 [Sanity Manage](https://www.sanity.io/manage) -> API -> Tokens 中生成一个 **Editor** 权限的 Token。
4.  保存凭证。

## 5. 运行测试
点击 **Execute Workflow** 按钮。
如果成功，您应该能在 Sanity Studio 中看到新导入的文章。
