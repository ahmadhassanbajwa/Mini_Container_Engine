#ifndef DEADLOCK_H
#define DEADLOCK_H

#include <stdbool.h>

#define MAX_CONTAINERS 10
#define MAX_RESOURCES 3

typedef struct {
    int available[MAX_RESOURCES];
    int max[MAX_CONTAINERS][MAX_RESOURCES];
    int allocation[MAX_CONTAINERS][MAX_RESOURCES];
    int need[MAX_CONTAINERS][MAX_RESOURCES];
    int n_containers;
    int n_resources;
} ResourceState;

void deadlock_init(ResourceState* state, int containers, int resources);
bool deadlock_is_safe(ResourceState* state);
bool deadlock_request(ResourceState* state, int container_id, int request[]);

#endif
