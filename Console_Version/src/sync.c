#include "sync.h"
#include "logger.h"

#define COMP "SYNC"

void mutex_init(Mutex* m) {
    pthread_mutex_init(&m->mutex, NULL);
    LOG_I(COMP, "Mutex initialized.");
}

void mutex_lock(Mutex* m) {
    pthread_mutex_lock(&m->mutex);
    LOG_D(COMP, "Mutex locked.");
}

void mutex_unlock(Mutex* m) {
    pthread_mutex_unlock(&m->mutex);
    LOG_D(COMP, "Mutex unlocked.");
}

void mutex_destroy(Mutex* m) {
    pthread_mutex_destroy(&m->mutex);
    LOG_I(COMP, "Mutex destroyed.");
}

void sema_init(Semaphore* s, int value) {
    sem_init(&s->sem, 0, value);
    LOG_I(COMP, "Semaphore initialized with value %d.", value);
}

void sema_wait(Semaphore* s) {
    sem_wait(&s->sem);
    LOG_D(COMP, "Semaphore waited.");
}

void sema_post(Semaphore* s) {
    sem_post(&s->sem);
    LOG_D(COMP, "Semaphore posted.");
}

void sema_destroy(Semaphore* s) {
    sem_destroy(&s->sem);
    LOG_I(COMP, "Semaphore destroyed.");
}
