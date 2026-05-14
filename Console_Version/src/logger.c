#include "logger.h"
#include <stdarg.h>
#include <time.h>
#include <sys/stat.h>
#include <string.h>
#include <pthread.h>

static pthread_mutex_t log_mutex = PTHREAD_MUTEX_INITIALIZER;
static FILE* main_log_file = NULL;
static int console_output_enabled = 1;

void logger_init() {
    mkdir("logs", 0777);
    main_log_file = fopen("logs/main.log", "a");
    if (!main_log_file) {
        perror("Failed to open main log file");
    }
}

void logger_set_console_output(int enabled) {
    console_output_enabled = enabled;
}

void log_msg(LogLevel level, const char* component, const char* format, ...) {
    pthread_mutex_lock(&log_mutex);

    time_t now;
    time(&now);
    char* date = ctime(&now);
    date[strlen(date) - 1] = '\0'; // Remove newline

    const char* level_str;
    const char* color_str;
    switch (level) {
        case LOG_INFO:    level_str = "INFO";    color_str = "\033[0;32m"; break;
        case LOG_WARNING: level_str = "WARNING"; color_str = "\033[0;33m"; break;
        case LOG_ERROR:   level_str = "ERROR";   color_str = "\033[0;31m"; break;
        case LOG_DEBUG:   level_str = "DEBUG";   color_str = "\033[0;34m"; break;
        default:          level_str = "UNKNOWN"; color_str = "\033[0m";    break;
    }

    va_list args;
    
    if (console_output_enabled) {
        // Print to console with color
        printf("[%s] %s[%s]\033[0m [%s] ", date, color_str, level_str, component);
        va_start(args, format);
        vprintf(format, args);
        va_end(args);
        printf("\n");
    }

    // Print to file
    if (main_log_file) {
        fprintf(main_log_file, "[%s] [%s] [%s] ", date, level_str, component);
        va_start(args, format);
        vfprintf(main_log_file, format, args);
        va_end(args);
        fprintf(main_log_file, "\n");
        fflush(main_log_file);
    }

    pthread_mutex_unlock(&log_mutex);
}

void logger_destroy() {
    if (main_log_file) {
        fclose(main_log_file);
    }
}
