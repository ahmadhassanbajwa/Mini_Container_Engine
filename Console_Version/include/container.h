#ifndef CONTAINER_H
#define CONTAINER_H

#include <sys/types.h>

typedef enum {
    C_READY,
    C_RUNNING,
    C_PAUSED,
    C_TERMINATED
} ContainerState;

typedef struct {
    char name[32];
    pid_t pid;
    int priority;
    int burst_time;
    int remaining_time;
    int arrival_time;
    int waiting_time;
    int turnaround_time;
    ContainerState state;
    char workspace[256];
} Container;

void container_create(Container* c, const char* name, int priority, int burst_time);
void container_start(Container* c);
void container_stop(Container* c);
void container_wait(Container* c);

#endif
