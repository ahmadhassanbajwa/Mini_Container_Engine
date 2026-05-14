#ifndef SYNC_H
#define SYNC_H

#include <pthread.h>
#include <semaphore.h>

typedef struct {
    pthread_mutex_t mutex;
} Mutex;

typedef struct {
    sem_t sem;
} Semaphore;

void mutex_init(Mutex* m);
void mutex_lock(Mutex* m);
void mutex_unlock(Mutex* m);
void mutex_destroy(Mutex* m);

void sema_init(Semaphore* s, int value);
void sema_wait(Semaphore* s);
void sema_post(Semaphore* s);
void sema_destroy(Semaphore* s);

void demo_mutex(void);
void demo_semaphore(void);
void run_sync_demo(void);

#endif