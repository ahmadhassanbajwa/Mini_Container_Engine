#include "container.h"
#include "logger.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <string.h>

#define COMP "CONTAINER"

void container_create(Container* c, const char* name, int priority, int burst_time) {
    strncpy(c->name, name, 31);
    c->priority = priority;
    c->burst_time = burst_time;
    c->remaining_time = burst_time;
    c->arrival_time = 0; // Will be set by scheduler
    c->waiting_time = 0;
    c->turnaround_time = 0;
    c->state = C_READY;
    c->pid = -1;

    snprintf(c->workspace, 255, "workspaces/%s", name);
    mkdir("workspaces", 0777);
    mkdir(c->workspace, 0777);
    
    LOG_I(COMP, "Container '%s' initialized. Workspace: %s", name, c->workspace);
}

void container_start(Container* c) {
    pid_t pid = fork();

    if (pid == 0) {
        // Child process
        // Setup Isolation
        if (chdir(c->workspace) != 0) {
            perror("chdir failed");
            exit(1);
        }

        LOG_I(COMP, "Container '%s' (PID: %d) starting workload...", c->name, getpid());
        
        // Simulate workload
        // In a real scenario, we might exec a separate program
        // For simulation, we'll just sleep or run a loop
        // char* args[] = {"./workload", NULL};
        // execv(args[0], args);
        
        sleep(c->burst_time);
        
        LOG_I(COMP, "Container '%s' workload finished.", c->name);
        exit(0);
    } else if (pid > 0) {
        // Parent process
        c->pid = pid;
        c->state = C_RUNNING;
        LOG_I(COMP, "Launched container '%s' with PID %d", c->name, pid);
    } else {
        LOG_E(COMP, "Failed to fork for container '%s'", c->name);
    }
}

void container_stop(Container* c) {
    if (c->pid > 0) {
        kill(c->pid, SIGTERM);
        c->state = C_TERMINATED;
        LOG_W(COMP, "Stopped container '%s' (PID: %d)", c->name, c->pid);
    }
}

void container_wait(Container* c) {
    if (c->pid > 0) {
        int status;
        waitpid(c->pid, &status, 0);
        c->state = C_TERMINATED;
        LOG_I(COMP, "Container '%s' exited with status %d", c->name, WEXITSTATUS(status));
    }
}
