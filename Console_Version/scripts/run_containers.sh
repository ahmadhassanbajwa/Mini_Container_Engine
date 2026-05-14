#!/bin/bash

# Compile the project
echo "Compiling Mini Container Engine..."
make clean
make

if [ $? -eq 0 ]; then
    echo "Compilation successful. Running engine..."
    mkdir -p logs
    mkdir -p workspaces
    ./bin/engine
else
    echo "Compilation failed."
    exit 1
fi
