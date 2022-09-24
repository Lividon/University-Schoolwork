#include <stdbool.h>
#include <stdio.h>

/* This is the function prototype for the isnumber() function that is
 * defined in rldecode.c.  It appears here so that functions in this file
 * know how to call isnumber() correctly.  The prototype for this
 * function must match the prototype of isnumber() in rldecode.c
 * exactly. */
bool isnumber(char c);

/* This program runs a series of tests against isnumber().  It uses
 * fprintf(stderr, ...) because this construction ensures that the
 * messages that it prints are sent to the terminal immediately.  This
 * is important because it helps make sure that any errors printed by a
 * test are visible to the user even if a later test crashes.  We will
 * discuss fprintf(stderr, ...) in greater detail at a future time. */
int main(int argc, char *argv[]) {

    /* First, test checking a correct, positive integer character.
     * This test checks a negative (using !) because isnumber() should
     * return true for a correct integer.  If it returns false
     * (the negative of which is true), that means the test detected a bug. */
    if (!isnumber('5')) {
        fprintf(stderr, "error: '5' returned false as integer.\n");
    }

    /* Try checking a correct integer at the lower bound */
    if (!isnumber('0')) {
        fprintf(stderr, "error: '0' returned false as integer.\n");
    }

    /* Now try checking a character that is not an number.  This should
     * return false if isnumber() works correctly, so it is not
     * negated with !. */
    if (isnumber('$')) {
        fprintf(stderr, "error: '$' returned true as number.\n");
    }

    return 0;
}
