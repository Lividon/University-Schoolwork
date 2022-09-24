#include <stdio.h>

/* This is the function prototype for the decode() function that is
 * defined in rldecode.c.  It appears here so that functions in this file
 * know how to call decode() correctly.  The prototype for this
 * function must match the prototype of decode() in rldecode.c
 * exactly. */
int decode(char *str);

/* This program tests the robustness of your decode() function with a
 * complicated run-length encoded ASCII art message.  It does not print
 * an error message if it's been decoded incorrectly, but instead should
 * appear wrong when printed to your terminal if it is incorrect.  You
 * can implement an actual test here if you desire.
 *
 * Notice that decode() is called in-place and does not set a variable,
 * despite it returning an integer.  This is completely fine as printing
 * occurs in decode() and we aren't using the value it returns here. */
int main(int argc, char *argv[]) {

    decode("1 7@3 6@3 8@1\n8@2 7@3 8@1\n1!2@7 1!2@7 2@1!1\n1!1@1!7 1!1@1!7 1!1@1!1\n1!1@1!7 2!2@2!4 1@3!1:1!1\n3!8 2!1@3!3 5!1:1\n1:2!12 1!1:1!2 2!1:1\n1:1!1:11 1!1:1!3 1:1!1:1\n1 3:1 3:2 4:1 2:4 2:1 4:1\n1 2:1 2:1 1:2 2:1 1:1 1:4 1:1 2:1 2:3\n1 6@4 6@4 8@1\n8@2 8@2 10@1\n5 3@7 3@2 2@1!3 4@1\n4 1@1!1@7 1@1!1@3 1!1@1!2 1@1!1@1!1@1\n3 2!1@7 2!1@4 1@1!1@1 1@1!1 1!1@1!1\n2 2!1:7 2!1:5 1!1@3!2 3!1\n1 1!1:1!7 1!1:1!6 2!1:1!3 3!1\n1:1!1:7 1:1!1:7 1:1!1:4 1!1:1!1\n2:1 5:2 2:1 5:2 7:1 2:1\n2:1 1:1 3:2 2:1 1:1 3:3 1:1 1:1 1:2 1:1\n");

    return 0;
}
