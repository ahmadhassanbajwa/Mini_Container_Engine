#!/bin/bash

LOG_FILE="logs/main.log"

if [ ! -f "$LOG_FILE" ]; then
    echo "Log file not found. Run the engine first."
    exit 1
fi

echo "Monitoring logs (Ctrl+C to stop)..."
tail -f "$LOG_FILE"
