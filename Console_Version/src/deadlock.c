#include "deadlock.h"
#include "logger.h"
#include <string.h>

#define COMP "DEADLOCK"

void deadlock_init(ResourceState* state, int containers, int resources) {
    state->n_containers = containers;
    state->n_resources = resources;
    memset(state->allocation, 0, sizeof(state->allocation));
    LOG_I(COMP, "Banker's Algorithm initialized for %d containers and %d resources.", containers, resources);
}

bool deadlock_is_safe(ResourceState* state) {
    int work[MAX_RESOURCES];
    bool finish[MAX_CONTAINERS] = {false};
    
    memcpy(work, state->available, sizeof(work));

    int count = 0;
    while (count < state->n_containers) {
        bool found = false;
        for (int i = 0; i < state->n_containers; i++) {
            if (!finish[i]) {
                int j;
                for (j = 0; j < state->n_resources; j++) {
                    if (state->need[i][j] > work[j]) break;
                }
                
                if (j == state->n_resources) {
                    for (int k = 0; k < state->n_resources; k++)
                        work[k] += state->allocation[i][k];
                    finish[i] = true;
                    found = true;
                    count++;
                }
            }
        }
        if (!found) break;
    }

    return count == state->n_containers;
}

bool deadlock_request(ResourceState* state, int container_id, int request[]) {
    // Step 1: Check if request <= need
    for (int i = 0; i < state->n_resources; i++) {
        if (request[i] > state->need[container_id][i]) {
            LOG_E(COMP, "Container %d requested more than its max need!", container_id);
            return false;
        }
    }

    // Step 2: Check if request <= available
    for (int i = 0; i < state->n_resources; i++) {
        if (request[i] > state->available[i]) {
            LOG_W(COMP, "Container %d must wait, resources not available.", container_id);
            return false;
        }
    }

    // Step 3: Pretend to allocate
    for (int i = 0; i < state->n_resources; i++) {
        state->available[i] -= request[i];
        state->allocation[container_id][i] += request[i];
        state->need[container_id][i] -= request[i];
    }

    if (deadlock_is_safe(state)) {
        LOG_I(COMP, "Request from container %d granted (Safe State).", container_id);
        return true;
    } else {
        // Rollback
        for (int i = 0; i < state->n_resources; i++) {
            state->available[i] += request[i];
            state->allocation[container_id][i] -= request[i];
            state->need[container_id][i] += request[i];
        }
        LOG_W(COMP, "Request from container %d denied (Would lead to Unsafe State).", container_id);
        return false;
    }
}
