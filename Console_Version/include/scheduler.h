#ifndef SCHEDULER_H
#define SCHEDULER_H

#include "container.h"

typedef enum {
    SCHED_FCFS,
    SCHED_RR,
    SCHED_PRIORITY
} SchedAlgo;

void scheduler_run(Container* containers, int count, SchedAlgo algo, int quantum);
void scheduler_generate_report(Container* containers, int count);

#endif
