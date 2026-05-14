#ifndef LOGGER_H
#define LOGGER_H

#include <stdio.h>
#include <time.h>
#include <string.h>

// Log levels
typedef enum {
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR,
    LOG_DEBUG
} LogLevel;

void logger_init();
void logger_set_console_output(int enabled);
void log_msg(LogLevel level, const char* component, const char* format, ...);
void logger_destroy();

// Convenience macros
#define LOG_I(mod, ...) log_msg(LOG_INFO, mod, __VA_ARGS__)
#define LOG_W(mod, ...) log_msg(LOG_WARNING, mod, __VA_ARGS__)
#define LOG_E(mod, ...) log_msg(LOG_ERROR, mod, __VA_ARGS__)
#define LOG_D(mod, ...) log_msg(LOG_DEBUG, mod, __VA_ARGS__)

#endif