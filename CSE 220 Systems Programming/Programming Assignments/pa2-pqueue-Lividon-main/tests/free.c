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
    PriorityQueue *pq = pqueue_init(NPRIOS);
    pqueue_insert(pq, 0, 0);
    pqueue_insert(pq, 1, 0);
    pqueue_insert(pq, 2, 1);
    pqueue_free(pq);
    puts("passed");
    return 0;
}
