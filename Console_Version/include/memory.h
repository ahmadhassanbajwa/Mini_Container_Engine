#ifndef MEMORY_H
#define MEMORY_H

#define MAX_FRAMES 4
#define MAX_PAGES 10

typedef enum {
    ALGO_FIFO,
    ALGO_LRU
} PageAlgo;

typedef struct {
    int frames[MAX_FRAMES];
    int n_frames;
    int page_faults;
    PageAlgo algo;
    int lru_time[MAX_FRAMES]; // For LRU
    int timer;
} MemoryManager;

void memory_init(MemoryManager* mm, int frames, PageAlgo algo);
void memory_access(MemoryManager* mm, int page_number);
void memory_report(MemoryManager* mm);

#endif
