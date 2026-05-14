#include "scheduler.h"
#include "logger.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define COMP "SCHEDULER"

void print_gantt_chart(Container* containers, int count, const char* title) {
    LOG_I(COMP, "=== Gantt Chart: %s ===", title);
    printf("\n   ");
    for (int i = 0; i < count; i++) {
        printf("|  %s  ", containers[i].name);
    }
    printf("|\n   ");
    
    int time = 0;
    printf("%d", time);
    for (int i = 0; i < count; i++) {
        time += containers[i].burst_time;
        printf("      %d", time);
    }
    printf("\n\n");
}

void scheduler_fcfs(Container* containers, int count) {
    int current_time = 0;
    for (int i = 0; i < count; i++) {
        containers[i].arrival_time = 0; // Simplified
        containers[i].waiting_time = current_time;
        current_time += containers[i].burst_time;
        containers[i].turnaround_time = current_time;
        
        LOG_I(COMP, "FCFS: Container '%s' scheduled at time %d", containers[i].name, containers[i].waiting_time);
    }
    print_gantt_chart(containers, count, "First-Come-First-Serve");
}

void scheduler_priority(Container* containers, int count) {
    // Sort by priority (lower number = higher priority)
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - i - 1; j++) {
            if (containers[j].priority > containers[j+1].priority) {
                Container temp = containers[j];
                containers[j] = containers[j+1];
                containers[j+1] = temp;
            }
        }
    }

    int current_time = 0;
    for (int i = 0; i < count; i++) {
        containers[i].waiting_time = current_time;
        current_time += containers[i].burst_time;
        containers[i].turnaround_time = current_time;
        LOG_I(COMP, "Priority: Container '%s' (P:%d) scheduled at time %d", containers[i].name, containers[i].priority, containers[i].waiting_time);
    }
    print_gantt_chart(containers, count, "Priority Scheduling");
}

void scheduler_rr(Container* containers, int count, int quantum) {
    LOG_I(COMP, "Starting Round Robin with quantum %d", quantum);
    int current_time = 0;
    int completed = 0;
    int* rem_bt = malloc(count * sizeof(int));
    
    for (int i = 0; i < count; i++) rem_bt[i] = containers[i].burst_time;

    printf("\n   Gantt Chart (RR): ");
    while (completed < count) {
        for (int i = 0; i < count; i++) {
            if (rem_bt[i] > 0) {
                printf("| %s ", containers[i].name);
                if (rem_bt[i] > quantum) {
                    current_time += quantum;
                    rem_bt[i] -= quantum;
                } else {
                    current_time += rem_bt[i];
                    containers[i].waiting_time = current_time - containers[i].burst_time;
                    containers[i].turnaround_time = current_time;
                    rem_bt[i] = 0;
                    completed++;
                }
            }
        }
    }
    printf("|\n   Time: 0 ... %d\n\n", current_time);
    free(rem_bt);
}

void scheduler_run(Container* containers, int count, SchedAlgo algo, int quantum) {
    switch (algo) {
        case SCHED_FCFS:     scheduler_fcfs(containers, count); break;
        case SCHED_PRIORITY: scheduler_priority(containers, count); break;
        case SCHED_RR:       scheduler_rr(containers, count, quantum); break;
    }
    scheduler_generate_report(containers, count);
}

void scheduler_generate_report(Container* containers, int count) {
    float total_wait = 0, total_turn = 0;
    LOG_I(COMP, "=== Scheduling Metrics ===");
    LOG_I(COMP, "%-15s | %-10s | %-10s", "Container", "Wait Time", "Turnaround");
    LOG_I(COMP, "--------------------------------------------");
    for (int i = 0; i < count; i++) {
        LOG_I(COMP, "%-15s | %-10d | %-10d", containers[i].name, containers[i].waiting_time, containers[i].turnaround_time);
        total_wait += containers[i].waiting_time;
        total_turn += containers[i].turnaround_time;
    }
    LOG_I(COMP, "Average Waiting Time: %.2f", total_wait / count);
    LOG_I(COMP, "Average Turnaround Time: %.2f", total_turn / count);
}
