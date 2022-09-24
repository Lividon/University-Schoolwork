#include <stdlib.h>
#include <stdbool.h>
#include "priority_queue.h"


/*
 * Validate the given PriorityQueue for structural correctness.
 *
 * In order for this function to return true, the queue passed in must
 * meet the specification in the project handout precisely.  Every node
 * in the linked list and every pointer in the tails table must be
 * correct.
 *
 * pqueue: queue to validate
 *
 * Returns true if the queue is valid, false otherwise.
 */
bool pqueue_validate(PriorityQueue *pqueue) {
    int prios = pqueue ->nprios;
    if(pqueue->head == NULL)
        {
            for(int i = 0; i < prios; i ++)
                {
                    if(pqueue->tails[i] != NULL)
                        {
                            return false;
                        }
                }
            return true;
        }
    if(pqueue->head != NULL)
        {
            if(pqueue->head->prev != NULL)
                {
                    return -1;
                }
            if(pqueue->head->priority >= prios || pqueue->head->priority < 0)
                {
                    return false;
                }
            PQNode *Node = pqueue->head;
            while(Node->next != NULL)
                {
                    if(Node->priority >= prios || Node->priority < 0)
                        {
                            return false;
                        }
                    PQNode *previ = Node;
                    Node = Node->next;
                    if(Node->prev != previ)
                        {
                            return false;
                        }
                    if(Node->prev->next != Node)
                        {
                             return false;
                        }
                    if(Node->priority < Node->prev->priority)
                        {
                            return false;
                        }
                }
            bool check = true;
            for(int i = prios-1; i> -1; i --)
                {
                    if(check && pqueue->tails[i] != NULL)
                        {
                            if(pqueue->tails[i]->next != NULL)
                                {
                                    return false;
                                }
                            check = false;
                        }
                    if(pqueue->tails[i] != NULL)
                        {
                            if(pqueue->tails[i]->priority != i)
                                {
                                    return false;
                                }
                        }
                }
            return true;
        }
    return true;
}
