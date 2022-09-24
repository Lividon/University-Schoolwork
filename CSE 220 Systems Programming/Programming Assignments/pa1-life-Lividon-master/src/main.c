#include <stdio.h>
#include <stdbool.h>

#include "life.h"

/* Be sure to read life.h and the other given source files to understand
 * what they provide and how they fit together.  You don't have to
 * understand all of the code, but you should understand how to call
 * parse_life() and clearterm().
 */

/* This is where your program will start.  You should make sure that it
 * is capable of accepting either one or two arguments; the first
 * argument (which is required) is a starting state in one of the Life
 * formats supported by parse_life(), and the second (which is optional)
 * is a number of generations to run before printing output and stopping.
 *
 * The autograder will always call your program with two arguments.  The
 * one-argument format (as described in the handout) is for your own
 * benefit!
 */
int main(int argc, char *argv[])
{
    if(argc < 1 || argc > 2)
        {
            printf("%s", "Incorrect number of inputs");
        }
    else
        {
            char *pointer = argv[1];
            char *grids[2][GRIDY+2][GRIDX+2];
        }
    return 0;
}
char *genBorder(char* matrix)
{
    for(int y = 0; y < 26; y++)
        {
            matrix[0][y] = DEAD;
        }
}
