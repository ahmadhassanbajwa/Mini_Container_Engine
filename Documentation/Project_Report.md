# Final Project Report: MiniEngine OS Dashboard (Senior Capstone)

## Project Members
- **24F-0027** Abu Bakar
- **24F-0023** Ahmad Hassan
- **24F-0052** Faizan Asghar

---

## 1. Executive Summary
The **MiniEngine OS Dashboard** is an advanced, full-stack Operating System simulation platform. Transitioning from a console-based architecture to a **Professional Window-Based System (GUI)**, this project demonstrates senior-level proficiency in systems programming, full-stack development, and high-end UI/UX design.

The system provides a high-fidelity "Mission Control" center to manage 7 fundamental OS pillars: Process Management, CPU Scheduling, Concurrency, IPC, Deadlock Handling, Memory Management, and Sandbox Isolation.

## 2. Theoretical Framework & Architecture
This project follows a **Hybrid Systems Architecture**:
- **Core Engine (C)**: Low-level logic handling kernel abstractions using POSIX APIs.
- **Web Dashboard (Next.js)**: A premium "Mission Control" interface built with React, Tailwind CSS, Framer Motion, and the **Plus Jakarta Sans** modern typography.
- **Interconnect**: The GUI provides functional, interactive control over the engine modules, transitioning from "pre-set demos" to a user-driven "real-time simulation."

## 3. The 7 Functional Control Modules

### 3.1 Live Process Monitor (Process Matrix)
A visual command center for process lifecycle management.
- **Functionality**: Users can "Spawn" new containers and "Kill" existing ones.
- **New Gen Control**: Every process features a **functional Pause/Resume** toggle that instantly synchronizes state across the kernel.
- **Visuals**: Displays a real-time table of PIDs, Status (Running/Paused), and simulated CPU/Memory overhead with glowing status indicators.

### 3.2 CPU Scheduler (Mission Cluster)
A high-fidelity animation tool for scheduling algorithms.
- **Functionality**: Select between FCFS and Round Robin.
- **Shared State**: Containers added in the Process Matrix automatically reflect in the scheduler's "Ready Queue."
- **Visuals**: A **live-animated Gantt Chart** that fills up in real-time with vibrant color-coding for each unique process.

### 3.3 Synchronization Lab (Concurrency Bridge)
A visual "playground" for concurrency control.
- **Functionality**: Spawns concurrent threads that compete for a visual Mutex.
- **Visuals**: Animated Lock/Unlock icons and a waiting queue that processes threads as resources become available, featuring pulse animations.

### 3.4 IPC Messenger Bridge
Demonstrates secure data exchange between isolated environments.
- **Functionality**: Two-way message passing using simulated POSIX Pipes.
- **Visuals**: A terminal-inspired chat interface where the "Parent" sends data and the "Child" acknowledges receipt via the IPC bridge.

### 3.5 Deadlock Safety Controller
A functional implementation of Dijkstra's Banker's Algorithm.
- **Functionality**: Analyzes resource allocation matrices to determine system safety.
- **Visuals**: Visual feedback (Green Safe-Check / Red Alert) indicating if a specific resource request leads to a "Safe State."

### 3.6 Memory Heatmap & Page Log
A visual representation of Demand Paging and Frame Management.
- **Functionality**: Users can manually "Access Pages" to trigger simulation logic and witness the FIFO/LRU replacement policies in action.
- **Visuals**: A grid of RAM frames that animate on access, tracking "Page Hits" (Emerald Glow) vs "Page Faults" (Rose Glow).

### 3.7 Sandbox Explorer (OS Isolation)
Demonstrates filesystem security through directory scoping and chroot-like isolation.
- **Functionality**: Isolated workspace browsing for different containers.
- **Visuals**: A professional file explorer UI that shows how each container is restricted to its own restricted workspace directory.

## 4. Visual Design & Aesthetic Excellence
The dashboard achieves "Senior Project" quality through:
- **Mission Control UI**: A hero landing page featuring live "Kernel Heartbeats," animated stat cards, and system integrity graphs.
- **New Gen Typography**: Integration of **Plus Jakarta Sans** for a modern, clean, and professional feel.
- **Vibrant Color Combinations**: A diverse palette of Emerald Green, Vivid Amber, Rose Pink, and Indigo Cyan used to differentiate kernel modules.
- **Advanced Animations**: Staggered list entries, floating hero elements, and background grid animations that create a "living" interface.

## 5. Conclusion
The **MiniEngine OS Dashboard** represents the culmination of complex systems theory and modern software engineering. By bridging low-level C logic with a high-end web interface, it provides a powerful, intuitive tool for visualizing and interacting with the core components of an operating system.
