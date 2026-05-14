#ifndef IPC_H
#define IPC_H

#include <stddef.h>

// Shared Memory
void* ipc_shm_create(int key, size_t size);
void ipc_shm_write(void* shm, const char* data);
void ipc_shm_read(void* shm, char* buffer);
void ipc_shm_destroy(int key);

// Pipes
void ipc_pipe_example();

#endif
