#!/usr/bin/env bash
# =====================================================================
# Note81x :: Local DeepSeek LLM Backend Launcher
# =====================================================================
# This script downloads the DeepSeek-Coder-V2 GGUF model and starts
# llama-server listening on http://127.0.0.1:8080/v1/chat/completions
# =====================================================================

MODEL_NAME="DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf"
MODEL_URL="https://huggingface.co/bartowski/DeepSeek-Coder-V2-Lite-Instruct-GGUF/resolve/main/DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf"
HOST="127.0.0.1"
PORT="8080"
CONTEXT_SIZE="40960"

echo -e "\033[1;32m[+] Initializing Note81x Local LLM Telemetry Server...\033[0m"

# 1. Check for llama-server executable
LLAMA_BIN=""
if command -v llama-server &> /dev/null; then
    LLAMA_BIN="llama-server"
elif [ -f "./llama.cpp/build/bin/llama-server" ]; then
    LLAMA_BIN="./llama.cpp/build/bin/llama-server"
elif [ -f "../llama.cpp/build/bin/llama-server" ]; then
    LLAMA_BIN="../llama.cpp/build/bin/llama-server"
fi

if [ -z "$LLAMA_BIN" ]; then
    echo -e "\033[1;31m[!] Error: 'llama-server' binary not found.\033[0m"
    echo -e "\033[1;33m[*] Build llama.cpp manually:\033[0m"
    echo "    git clone https://github.com/ggerganov/llama.cpp"
    echo "    cd llama.cpp && cmake -B build && cmake --build build --config Release -j\$(nproc)"
    exit 1
fi

# 2. Check or download model file
if [ ! -f "$MODEL_NAME" ]; then
    echo -e "\033[1;33m[+] Model '$MODEL_NAME' not detected locally.\033[0m"
    echo -e "\033[1;34m[+] Downloading DeepSeek-Coder-V2 GGUF (Q4_K_M) from HuggingFace...\033[0m"
    wget -c "$MODEL_URL" -O "$MODEL_NAME"
    if [ $? -ne 0 ]; then
        echo -e "\033[1;31m[!] Download failed. Please download manually from:\033[0m $MODEL_URL"
        exit 1
    fi
fi

# 3. Launch llama-server
echo -e "\033[1;32m[+] Launching llama-server on http://${HOST}:${PORT}/v1/chat/completions...\033[0m"
"$LLAMA_BIN" \
  -m "$MODEL_NAME" \
  --host "$HOST" \
  --port "$PORT" \
  -c "$CONTEXT_SIZE" \
  --alias "$MODEL_NAME" \
  --cors "*"
