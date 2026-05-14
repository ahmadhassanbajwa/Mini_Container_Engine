#include "ipc.h"
#include "logger.h"
#include <sys/ipc.h>
#include <sys/shm.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#define COMP "IPC"

void* ipc_shm_create(int key, size_t size) {
    int shmid = shmget(key, size, 0666 | IPC_CREAT);
    if (shmid < 0) {
        LOG_E(COMP, "shmget failed");
        return NULL;
    }
    void* shm = shmat(shmid, NULL, 0);
    LOG_I(COMP, "Shared memory created at key %d", key);
    return shm;
}

void ipc_shm_write(void* shm, const char* data) {
    if (shm) {
        strcpy((char*)shm, data);
        LOG_I(COMP, "Data written to shared memory: %s", data);
    }
}

void ipc_shm_read(void* shm, char* buffer) {
    if (shm) {
        strcpy(buffer, (char*)shm);
        LOG_I(COMP, "Data read from shared memory: %s", buffer);
    }
}

void ipc_shm_destroy(int key) {
    int shmid = shmget(key, 0, 0666);
    if (shmid >= 0) {
        shmctl(shmid, IPC_RMID, NULL);
        LOG_I(COMP, "Shared memory at key %d destroyed", key);
    }
}

void ipc_pipe_example() {
    int fd[2];
    pipe(fd);
    
    if (fork() == 0) {
        // Child: write to pipe
        close(fd[0]);
        const char* msg = "Hello from child via pipe";
        write(fd[1], msg, strlen(msg) + 1);
        close(fd[1]);
        exit(0);
    } else {
        // Parent: read from pipe
        close(fd[1]);
        char buffer[128];
        read(fd[0], buffer, sizeof(buffer));
        LOG_I(COMP, "Parent read from pipe: %s", buffer);
        close(fd[0]);
    }
}
