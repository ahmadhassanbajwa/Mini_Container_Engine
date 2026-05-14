#include "memory.h"
#include "logger.h"
#include <stdio.h>

#define COMP "MEMORY"

void memory_init(MemoryManager* mm, int frames, PageAlgo algo) {
    mm->n_frames = frames;
    mm->page_faults = 0;
    mm->algo = algo;
    mm->timer = 0;
    for (int i = 0; i < frames; i++) {
        mm->frames[i] = -1;
        mm->lru_time[i] = 0;
    }
    LOG_I(COMP, "Memory Manager initialized with %d frames using %s algorithm.", frames, (algo == ALGO_FIFO ? "FIFO" : "LRU"));
}

void memory_access(MemoryManager* mm, int page_number) {
    mm->timer++;
    // Check if page already in frames
    for (int i = 0; i < mm->n_frames; i++) {
        if (mm->frames[i] == page_number) {
            LOG_I(COMP, "Page %d hit in frame %d.", page_number, i);
            if (mm->algo == ALGO_LRU) mm->lru_time[i] = mm->timer;
            return;
        }
    }

    // Page fault
    mm->page_faults++;
    LOG_W(COMP, "Page fault for page %d!", page_number);

    // Find empty frame
    for (int i = 0; i < mm->n_frames; i++) {
        if (mm->frames[i] == -1) {
            mm->frames[i] = page_number;
            if (mm->algo == ALGO_LRU) mm->lru_time[i] = mm->timer;
            LOG_I(COMP, "Page %d placed in empty frame %d.", page_number, i);
            return;
        }
    }

    // Replace page
    int replace_idx = 0;
    if (mm->algo == ALGO_FIFO) {
        // Simple FIFO: replace based on circular logic or just pick the oldest (first empty search)
        // For simplicity in this simulation, we'll use a pointer that cycles
        static int fifo_ptr = 0;
        replace_idx = fifo_ptr;
        fifo_ptr = (fifo_ptr + 1) % mm->n_frames;
    } else {
        // LRU
        int min_time = mm->lru_time[0];
        for (int i = 1; i < mm->n_frames; i++) {
            if (mm->lru_time[i] < min_time) {
                min_time = mm->lru_time[i];
                replace_idx = i;
            }
        }
    }

    LOG_I(COMP, "Replacing page %d in frame %d with page %d.", mm->frames[replace_idx], replace_idx, page_number);
    mm->frames[replace_idx] = page_number;
    mm->lru_time[replace_idx] = mm->timer;
}

void memory_report(MemoryManager* mm) {
    LOG_I(COMP, "=== Memory Report ===");
    LOG_I(COMP, "Total Page Faults: %d", mm->page_faults);
}
