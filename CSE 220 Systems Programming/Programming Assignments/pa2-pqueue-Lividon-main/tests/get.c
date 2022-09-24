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
    if(pqueue_get(pq) != NULL)
        {
            puts("failed1");
            return -1;
        }
    pqueue_insert(pq, 0, 0);
    /*if(pq->tails[0]->value != 0 || pq->head->value != 0)
        {
            return -1;
            }*/
    PQNode *node = pqueue_get(pq);
    if(node->value != 0)
        {
            return -1;
            puts("failed2");
        }
    if(pq->head != NULL || pq->tails[0] != NULL)
        {
            puts("failed3");
            return -1;
        }
    if(pqueue_get(pq) != NULL)
        {
            puts("failed4");
            return -1;
        }
    pqueue_insert(pq,0,0);
    pqueue_insert(pq,1,1);
    pqueue_insert(pq, 1, 3);
    PQNode* OtherNode = pqueue_get(pq);
    OtherNode = OtherNode;
    if(pq->head->priority != 1)
        {
            puts("failed5");
            return -1;
        }
    if(pq->tails[1]->prev != NULL)
        {
            puts("failed6");
            return -1;
        }
    puts("passed");
    return 0;
}
