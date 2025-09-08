# ChatGoogleGenerativeAIEx Simple Usage [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/hideya/langchain-google-genai-ex-usage/blob/main/LICENSE)

This repository includes [a simple usage example](/src/index.ts)
of [`ChatGoogleGenerativeAIEx`](https://github.com/hideya/langchain-google-genai-ex).

The following shows the usage:

```bash
npm inistall

cp .env.example .env
code .env  # configure environment variables as needed

npm start
```

**Testing with additional MCP servers**

[This test file](./src/many-mcps.ts) contains example configurations of 8 MCP servers.  
Update the configurations as needed, then run the file by:

```bash
npm run many-mcps
```
