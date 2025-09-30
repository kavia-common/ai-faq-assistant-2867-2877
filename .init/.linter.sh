#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-faq-assistant-2867-2877/faq_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

