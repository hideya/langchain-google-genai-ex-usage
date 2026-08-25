# ChatGoogleGenerativeAIEx Simple Usage [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/hideya/langchain-google-genai-ex-usage/blob/main/LICENSE)

This repository includes [a simple usage example](/src/index.ts)
of [`ChatGoogleGenerativeAIEx`](https://github.com/hideya/langchain-google-genai-ex).

This example targets `@h1deya/langchain-google-genai-ex` v0.2.1 or later.

The example uses the current LangChain.js agent and MCP client pattern:
`MultiServerMCPClient` loads tools from an MCP server, `createAgent()` binds those
tools to `ChatGoogleGenerativeAIEx`, and messages are passed as plain role/content
objects.

The following shows the usage:

```bash
npm install

cp .env.example .env
code .env  # configure environment variables as needed

npm start
```

The sample uses `mcp-server-fetch==2025.4.7` through `uvx`, so make sure `uv` is
available in your environment before running it. It also pins the Python MCP SDK
to `mcp<2` because older `mcp-server-fetch` releases fail to start with the MCP
SDK 2.x exception class rename.

## License

[MIT](./LICENSE)
