#include <stdio.h>
#include <stdbool.h>

#include "../src/priority_queue.h"

#define NPRIOS 3

/*
 * Test that nodes are inserted in correct priority order.  This test
 * DOES NOT VALIDATE the queue structure!  It tests ONLY that nodes are
 * inserted in the correct priority order, with priority 0 at the head,
 * increasing to priority NPRIOS - 1.
 */
int main(int argc, char *argv[]) {
    PriorityQueue *pqueue = pqueue_init(NPRIOS);
    PQNode *cur;

    if (pqueue == NULL) {
        puts("failed");
        return 1;
    }

    /* Insert one node at each priority supported by the queue. */
    for (int i = 0; i < NPRIOS; i++) {
        pqueue_insert(pqueue, i + 13, i);
    }

    /* Check that there is one node of each priority and that they are
     * in priority order. */
    cur = pqueue->head;
    for (int i = 0; i < NPRIOS && cur != NULL; i++, cur = cur->next) {
        if (cur->priority != i) {
            puts("failed");
            return 1;
        }
    }

    puts("passed");
    return 0;
}
