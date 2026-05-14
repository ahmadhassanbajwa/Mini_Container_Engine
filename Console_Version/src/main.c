#include "logger.h"
#include "container.h"
#include "scheduler.h"
#include "sync.h"
#include "ipc.h"
#include "deadlock.h"
#include "memory.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <string.h>
#include <pthread.h>

// ANSI Colors for Professional GUI
#define C_RESET   "\033[0m"
#define C_BOLD    "\033[1m"
#define C_RED     "\033[31m"
#define C_GREEN   "\033[32m"
#define C_YELLOW  "\033[33m"
#define C_BLUE    "\033[34m"
#define C_CYAN    "\033[36m"
#define C_MAGENTA "\033[35m"

void clear_input_buffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void wait_for_keypress() {
    printf("\n" C_YELLOW "Press ENTER to return to menu..." C_RESET);
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void print_header(const char* title) {
    printf("\n" C_CYAN "========================================================\n");
    printf("   %s\n", title);
    printf("========================================================" C_RESET "\n");
}

// ---------------------------------------------------------
// 1. Process Management
// ---------------------------------------------------------
void interactive_process() {
    print_header("1. Process Management & Lifecycle");
    printf(C_BOLD "Spawning a new isolated container process...\n" C_RESET);
    
    pid_t pid = fork();
    if (pid == 0) {
        printf(C_GREEN "  [CHILD]  Process created successfully! PID: %d\n" C_RESET, getpid());
        printf(C_GREEN "  [CHILD]  Simulating workload (sleeping 2s)...\n" C_RESET);
        sleep(2);
        printf(C_GREEN "  [CHILD]  Workload complete. Exiting.\n" C_RESET);
        exit(0);
    } else if (pid > 0) {
        printf(C_BLUE "  [PARENT] Parent process (PID: %d) waiting for Child (PID: %d)...\n" C_RESET, getpid(), pid);
        int status;
        waitpid(pid, &status, 0);
        printf(C_BLUE "  [PARENT] Child exited with status %d.\n" C_RESET, WEXITSTATUS(status));
    } else {
        printf(C_RED "  [ERROR]  Fork failed!\n" C_RESET);
    }
    wait_for_keypress();
}

// ---------------------------------------------------------
// 2. CPU Scheduling
// ---------------------------------------------------------
void interactive_scheduling() {
    print_header("2. CPU Scheduling Simulator");
    int count = 3;
    printf(C_BOLD "Using 3 default containers for scheduling demo.\n" C_RESET);
    Container containers[3];
    container_create(&containers[0], "Cont-A", 2, 5);
    container_create(&containers[1], "Cont-B", 1, 3);
    container_create(&containers[2], "Cont-C", 3, 2);

    printf(C_YELLOW "\nSelect Algorithm:\n1. FCFS\n2. Priority\n3. Round Robin\nChoice: " C_RESET);
    int choice;
    if (scanf("%d", &choice) != 1) choice = 1;
    clear_input_buffer();

    SchedAlgo algo = SCHED_FCFS;
    int quantum = 2;
    const char* algo_name = "FCFS";
    if (choice == 2) { algo = SCHED_PRIORITY; algo_name = "Priority"; }
    else if (choice == 3) { algo = SCHED_RR; algo_name = "Round Robin"; }

    printf("\n" C_BOLD "Running %s Scheduling..." C_RESET "\n", algo_name);
    
    scheduler_run(containers, count, algo, quantum);
    
    printf("\n" C_CYAN "================ Scheduling Metrics ================\n" C_RESET);
    printf("| " C_BOLD "Container" C_RESET "       | " C_BOLD "Wait Time" C_RESET "  | " C_BOLD "Turnaround" C_RESET " |\n");
    printf(C_CYAN "----------------------------------------------------\n" C_RESET);
    
    float total_wait = 0, total_turn = 0;
    for (int i = 0; i < count; i++) {
        printf("| %-15s | %-10d | %-10d |\n", containers[i].name, containers[i].waiting_time, containers[i].turnaround_time);
        total_wait += containers[i].waiting_time;
        total_turn += containers[i].turnaround_time;
    }
    printf(C_CYAN "----------------------------------------------------\n" C_RESET);
    printf(C_BOLD "Average Waiting Time:    %.2f\n" C_RESET, total_wait / count);
    printf(C_BOLD "Average Turnaround Time: %.2f\n" C_RESET, total_turn / count);
    
    wait_for_keypress();
}

// ---------------------------------------------------------
// 3. Synchronization
// ---------------------------------------------------------
void* thread_func(void* arg) {
    Mutex* m = (Mutex*)arg;
    printf(C_GREEN "  [THREAD %ld] Attempting to acquire lock...\n" C_RESET, pthread_self());
    mutex_lock(m);
    printf(C_MAGENTA "  [THREAD %ld] " C_BOLD "LOCK ACQUIRED." C_RESET C_MAGENTA " Entering critical section (sleeping 1s).\n" C_RESET, pthread_self());
    sleep(1);
    printf(C_GREEN "  [THREAD %ld] Releasing lock.\n" C_RESET, pthread_self());
    mutex_unlock(m);
    return NULL;
}

void interactive_sync() {
    print_header("3. Concurrency & Synchronization");
    printf(C_BOLD "Spawning 3 threads that compete for a shared Mutex lock...\n" C_RESET);
    Mutex m;
    mutex_init(&m);

    pthread_t t1, t2, t3;
    pthread_create(&t1, NULL, thread_func, &m);
    pthread_create(&t2, NULL, thread_func, &m);
    pthread_create(&t3, NULL, thread_func, &m);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    pthread_join(t3, NULL);

    mutex_destroy(&m);
    printf(C_BLUE "\nAll threads completed safely without race conditions.\n" C_RESET);
    wait_for_keypress();
}

// ---------------------------------------------------------
// 4. Inter-Process Communication (IPC)
// ---------------------------------------------------------
void interactive_ipc() {
    print_header("4. Inter-Process Communication (IPC)");
    int fd[2];
    if (pipe(fd) == -1) {
        printf(C_RED "Pipe failed.\n" C_RESET);
        return;
    }

    printf(C_BOLD "Enter a message to send from Parent to Child via POSIX Pipe: " C_RESET);
    char msg[256];
    if (!fgets(msg, 256, stdin)) strcpy(msg, "Default Message\n");
    msg[strcspn(msg, "\n")] = 0;

    pid_t pid = fork();
    if (pid == 0) {
        close(fd[1]);
        char buffer[256];
        read(fd[0], buffer, sizeof(buffer));
        printf(C_GREEN "\n  [CHILD]  Received message through pipe: '%s'\n" C_RESET, buffer);
        close(fd[0]);
        exit(0);
    } else {
        close(fd[0]);
        printf(C_BLUE "  [PARENT] Sending message: '%s'\n" C_RESET, msg);
        write(fd[1], msg, strlen(msg) + 1);
        close(fd[1]);
        wait(NULL);
    }
    wait_for_keypress();
}

// ---------------------------------------------------------
// 5. Deadlock Handling
// ---------------------------------------------------------
void interactive_deadlock() {
    print_header("5. Deadlock Handling (Banker's Algorithm)");
    printf(C_BOLD "System initialized with 3 Containers and 3 Resource Types (A, B, C).\n" C_RESET);
    ResourceState state;
    deadlock_init(&state, 3, 3);
    
    state.available[0] = 3; state.available[1] = 3; state.available[2] = 2;
    state.max[0][0] = 7; state.max[0][1] = 5; state.max[0][2] = 3;
    state.need[0][0] = 7; state.need[0][1] = 5; state.need[0][2] = 3;

    printf(C_CYAN "Available Resources:  [A: 3, B: 3, C: 2]\n" C_RESET);
    printf(C_YELLOW "Container 0 requests: [A: 1, B: 0, C: 2]\n" C_RESET);
    
    printf("\nValidating Request using Banker's Algorithm...\n");
    
    bool safe = deadlock_request(&state, 0, (int[]){1, 0, 2});

    if (safe) {
        printf(C_GREEN "\n[RESULT] Request GRANTED. System remains in a SAFE state.\n" C_RESET);
    } else {
        printf(C_RED "\n[RESULT] Request DENIED. System would enter an UNSAFE state (potential deadlock).\n" C_RESET);
    }
    wait_for_keypress();
}

// ---------------------------------------------------------
// 6. Memory Management
// ---------------------------------------------------------
void interactive_memory() {
    print_header("6. Virtual Memory Management (Page Replacement)");
    printf(C_BOLD "Initializing 3 Physical Memory Frames...\n" C_RESET);
    
    printf(C_YELLOW "Select Algorithm:\n1. FIFO\n2. LRU\nChoice: " C_RESET);
    int choice;
    if (scanf("%d", &choice) != 1) choice = 2;
    clear_input_buffer();
    
    PageAlgo algo = (choice == 1) ? ALGO_FIFO : ALGO_LRU;
    MemoryManager mm;
    memory_init(&mm, 3, algo);

    int pages[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3};
    int num_pages = 10;
    
    printf(C_BOLD "\nPage Access Sequence: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3\n" C_RESET);
    printf(C_CYAN "------------------------------------------------------\n");
    printf("| Page | Frame 0 | Frame 1 | Frame 2 | Status      |\n");
    printf("------------------------------------------------------\n" C_RESET);

    for (int i = 0; i < num_pages; i++) {
        int old_faults = mm.page_faults;
        
        memory_access(&mm, pages[i]);
        
        bool fault = (mm.page_faults > old_faults);
        
        printf("|  " C_BOLD "%d" C_RESET "   |", pages[i]);
        for(int j=0; j<3; j++) {
            if (mm.frames[j] == -1) printf("    -    |");
            else printf("    %d    |", mm.frames[j]);
        }
        
        if (fault) printf(C_RED " FAULT       " C_RESET "|\n");
        else printf(C_GREEN " HIT         " C_RESET "|\n");
    }
    printf(C_CYAN "------------------------------------------------------\n" C_RESET);
    printf(C_BOLD "Total Page Faults: %d\n" C_RESET, mm.page_faults);
    
    wait_for_keypress();
}

// ---------------------------------------------------------
// 7. Isolation Mechanism
// ---------------------------------------------------------
void interactive_isolation() {
    print_header("7. OS Isolation Mechanism (chdir simulation)");
    printf(C_BOLD "Simulating how a container is restricted to its own workspace.\n" C_RESET);
    
    char cwd[256];
    getcwd(cwd, sizeof(cwd));
    printf(C_BLUE "Host System CWD: %s\n" C_RESET, cwd);
    
    printf("\nCreating Container 'Sandbox'...\n");
    mkdir("workspaces", 0777);
    mkdir("workspaces/Sandbox", 0777);
    
    pid_t pid = fork();
    if (pid == 0) {
        chdir("workspaces/Sandbox");
        char c_cwd[256];
        getcwd(c_cwd, sizeof(c_cwd));
        printf(C_GREEN "  [CONTAINER] Chdir successful. Container CWD:\n  %s\n" C_RESET, c_cwd);
        printf(C_GREEN "  [CONTAINER] The container is effectively isolated from the host.\n" C_RESET);
        exit(0);
    } else {
        wait(NULL);
        printf(C_BLUE "Host process regained control. Isolation demonstrated.\n" C_RESET);
    }
    wait_for_keypress();
}

// ---------------------------------------------------------
// Main Menu Application
// ---------------------------------------------------------
int main() {
    logger_init();
    logger_set_console_output(0); // Mute raw logs to preserve UI cleanliness

    int choice = 0;
    while(1) {
        // Clear screen using ANSI escape sequence for a true app-like feel
        printf("\033[H\033[J");
        
        printf(C_CYAN "╔════════════════════════════════════════════════════════════╗\n");
        printf("║      " C_BOLD "MINI CONTAINER ENGINE - SENIOR PROJECT" C_RESET C_CYAN "                ║\n");
        printf("╠════════════════════════════════════════════════════════════╣\n");
        printf("║ " C_BOLD "1." C_RESET C_CYAN " Process Management & Lifecycle                        ║\n");
        printf("║ " C_BOLD "2." C_RESET C_CYAN " CPU Scheduling Simulator                              ║\n");
        printf("║ " C_BOLD "3." C_RESET C_CYAN " Concurrency & Synchronization                         ║\n");
        printf("║ " C_BOLD "4." C_RESET C_CYAN " Inter-Process Communication (IPC)                     ║\n");
        printf("║ " C_BOLD "5." C_RESET C_CYAN " Deadlock Handling (Banker's Algorithm)                ║\n");
        printf("║ " C_BOLD "6." C_RESET C_CYAN " Virtual Memory Management                             ║\n");
        printf("║ " C_BOLD "7." C_RESET C_CYAN " OS Isolation Mechanism                                ║\n");
        printf("║ " C_BOLD "8." C_RESET C_RED " Exit Engine                                           " C_CYAN "║\n");
        printf("╚════════════════════════════════════════════════════════════╝\n" C_RESET);
        printf(C_BOLD "Select an OS Concept to Simulate (1-8): " C_RESET);
        
        if (scanf("%d", &choice) != 1) {
            clear_input_buffer();
            continue;
        }
        clear_input_buffer();
        
        switch(choice) {
            case 1: interactive_process(); break;
            case 2: interactive_scheduling(); break;
            case 3: interactive_sync(); break;
            case 4: interactive_ipc(); break;
            case 5: interactive_deadlock(); break;
            case 6: interactive_memory(); break;
            case 7: interactive_isolation(); break;
            case 8:
                printf(C_GREEN "\nShutting down engine gracefully... Goodbye!\n" C_RESET);
                logger_destroy();
                return 0;
            default:
                printf(C_RED "Invalid selection. Please enter a number between 1 and 8.\n" C_RESET);
                wait_for_keypress();
        }
    }
    return 0;
}
