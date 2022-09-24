#include <stdlib.h>
#include <stdbool.h>
#include "priority_queue.h"

/*
 * Create a new PriorityQueue structure and return it.
 *
 * The newly-created structure should have a NULL head, and every tail
 * pointer in its tails table should be NULL.
 *
 * nprios: The maximum number of priorities to support
 */
PriorityQueue *pqueue_init(int nprios) {
    PriorityQueue *q = (PriorityQueue*)malloc(sizeof(PriorityQueue));
    PQNode **tails = (PQNode**) malloc(nprios *sizeof(PQNode));
    q->nprios = nprios;
    q->tails = tails;
    return q;
}

/*
 * Free all structures associated with this priority queue, including their
 * queue structure itself.  Any access to pqueue after this function returns
 * should be considered invalid.
 *
 * pqueue: the queue to free
 */
void pqueue_free(PriorityQueue *pqueue) {
    PQNode* node = pqueue->head;
    free(pqueue->tails);
    while(node->next != NULL)
        {
            PQNode *delete = node;
            node = node->next;
            free(delete);
        }
    free(pqueue);
}

/*
 * Insert a new node into a queue by priority and value.
 *
 * pqueue: the queue into which the new node should be inserted
 * value: the opaque value being inserted into the queue
 * priority: the priority at which this value is to be inserted
 */
void pqueue_insert(PriorityQueue *pqueue, int value, int priority) {
    PQNode* node = (PQNode*) malloc(sizeof(PQNode));
    node->value = value;
    node->priority = priority;
    if(pqueue->head == NULL)
        {
            node->next = NULL;
            node->prev = NULL;
            pqueue->tails[node->priority] = node;
            pqueue->head = node;
            return;
        }
    else
        {
            //This means that there is SOMETHING else inside of the queue, it is unknown whether it's at a higher or lower priority.
            if(pqueue->tails[node->priority] == NULL)
                {
                    pqueue->tails[node->priority] = node;
                    int prio = priority;
                    while(pqueue->tails[prio] == NULL && prio > -1)
                        {
                            prio-= 1;
                        }
                    if(pqueue->head->priority > node->priority)
                        {
                            //Replace that head
                            node->next = pqueue->head;
                            node->prev = NULL;
                            pqueue->head->prev = node;
                            pqueue->head = node;
                            pqueue->tails[priority] = node;
                            return;
                        }
                    else
                        {
                            //Don't have to replace the head, but check if head->next exists.
                            if(pqueue->tails[prio] != NULL)
                                {
                                    node->next = pqueue->tails[prio]->next;
                                    if(pqueue->tails[prio]->next != NULL)
                                        {
                                            pqueue->tails[prio]->next->prev = node;
                                        }
                                    node->prev = pqueue->tails[prio];
                                    pqueue->tails[prio]->next = node;
                                    pqueue->tails[priority] = node;
                                    return;
                                }
                        }
                }
            else
                {
                    //tails[priority] is not null, makes for rather easy cleanup.
                    if(pqueue->tails[priority]->next != NULL)
                        {
                            node->next = pqueue->tails[priority]->next;
                            node->prev = pqueue->tails[priority];
                            pqueue->tails[priority]->next->prev = node;
                            pqueue->tails[priority]->next = node;
                            pqueue->tails[priority] = node;
                            return;
                        }
                    else
                        {
                            node->next = pqueue->tails[priority]->next;
                            node->prev = pqueue->tails[priority];
                            pqueue->tails[priority]->next = node;
                            pqueue->tails[priority] = node;
                            return;
                        }
                }
        }
}

/*
 * Return the head queue node without removing it.
 */
PQNode *pqueue_peek(PriorityQueue *pqueue) {
    return pqueue->head;
}

/*
 * Remove and return the head queue node.
 */
PQNode *pqueue_get(PriorityQueue *pqueue) {
    if(pqueue->head == NULL)
        {
            return NULL;
        }
    if(pqueue->head->next == NULL)
        {
            pqueue->tails[pqueue->head->priority] = NULL;
            PQNode * node = pqueue->head;
            pqueue->head->prev = NULL;
            return node;
        }
    if(pqueue->tails[pqueue->head->priority] == pqueue->head)
        {
            //This means it's the only thing at priority, whatever the priority head is at.
            PQNode* node = pqueue->head;
            pqueue->head = pqueue->head->next;
            pqueue->tails[node->priority] = NULL;
            return node;
        }
    else
        {
            PQNode* node = pqueue->head;
            pqueue->head = pqueue->head->next;
            pqueue->head->prev = NULL;
            return node;
        }
    //Should not get here
    return NULL;
}
