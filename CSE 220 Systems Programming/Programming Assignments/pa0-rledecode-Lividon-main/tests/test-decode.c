#include <stdio.h>

/* This is the function prototype for the decode() function that is
 * defined in rldecode.c.  It appears here so that functions in this file
 * know how to call decode() correctly.  The prototype for this
 * function must match the prototype of decode() in rldecode.c
 * exactly. */
int decode(char *str);

/* This program runs a series of tests on the decode() function that
 * you have defined.  If it detects any errors, it will print a message.
 * If it does not detect any errors, it will complete with no output.
 * It uses fprintf(stderr, ...) because this construction ensures that
 * the messages that it prints are sent to the terminal immediately.
 * This is important because it helps make sure that any errors printed
 * by a test are visible to the user even if a later test crashes.  We
 * will discuss fprintf(stderr, ...) in greater detail at a future
 * time. */
int main(int argc, char *argv[]) {

    /* We only have to check valid inputs because the behavior of
     * decode() is explicitly undefined for invalid inputs.  We check
     * a simple single run-length string, a short two character string,
     * and a longer string with larger mixed run-lengths. */
    if (decode("3a") != 3) {
        fprintf(stderr, "error: \"3a\" did not return the correct integer value.\n");
    }

    if (decode("3a6b") != 9) {
        fprintf(stderr, "error: \"3a6b\" did not return the correct integer value.\n");
    }

    if (decode("123*1z10q") != 134) {
        fprintf(stderr, "error: \"123*1z10q\" did not return the correct integer value\n");
    }

    return 0;
}
