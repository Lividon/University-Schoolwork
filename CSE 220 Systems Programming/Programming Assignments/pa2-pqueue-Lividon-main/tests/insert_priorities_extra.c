#include <stdio.h>
#include <stdbool.h>

#include "../src/priority_queue.h"

#define NPRIOS 3
/*This test is an addon to the insert_priorities test.
This test verifies the structural integrity of the priority queue (heads, tails, NPrios, and the members of the queue are correct.)
This test also checks to see if the PQ works when inserting priorities arbitrarily*/
//tl;dr: testing insert mostly and structure.
int main(int argc, char *argv[])
{
     PriorityQueue *pq = pqueue_init(NPRIOS);
    //Gotten from insert_priorities.c; just using it here as well just to make sure that my test also tests that the init function doesn't fail.
    if(pq == NULL)
        {
            return -1;
        }
    //Before anything else, check that basically everything is null
    if(pq->head != NULL)
        {
            return -1;
        }
    for(int i = 0; i < NPRIOS; i++)
        {
            if(pq->tails[i] != NULL)
                {
                    return -1;
                }
        }
    //In fact, we will insert it backwards!
    pqueue_insert(pq, 2, 2);
    //Test that head point to this node, since it is the only node in the list
    if(pq->head->value != 2 || pq->head->priority != 2)
        {
            return -1;
        }
    //This is a test to check that tails[2] has the values we inserted
    if(pq->tails[2]->value != 2 || pq->tails[2]->value != 2)
        {
            return -1;
        }
    //our current head and tails[2] are the same, so this should be the same as well.
    if(pq-> tails[2] != pq->head)
        {
            return -1;
        }
    //Check that tails is empty everywhere else, AND that next and prev of head as of now are null. Since at this point we know head == tails, just do test on head
    if(pq->head-> next != NULL || pq->head->prev != NULL)
        {
            return -1;
        }
    if(pq->tails[1] != NULL || pq->tails[0] != NULL)
        {
            return -1;
        }
    //Now lets insert something at priority 0; leaving tails[1] at null.
    pqueue_insert(pq, 0, 0);
    //Check that pq->head points to this new value. Check that tails[0] also points to this. Check taht head = tails[0] check all the next and prev pointers. Check that tails[2] != head anymore.
    if(pq->head->value != 0 || pq->head->priority != 0 || pq->head != pq->tails[0])
        {
            return -1;
        }
    if(pq->head->prev != NULL || pq->head->next != pq->tails[2])
    {
        return -1;
    }
    if(pq->head == pq->tails[2])
        {
            //This means the head didn't update, if it wasn't caught by earlier tests somehow
            return -1;
        }
    if(pq->tails[2]->prev != pq->head || pq->tails[2]->next != NULL)
        {
            return -1;
        }
    if(pq->tails[1]!= NULL)
        {
            //Make sure that nothing funny happened with tails[1]
            return -1;
        }
    puts("passed");
    //Lets try inserting AN0THER value at prio 2, see what happens there.
    pqueue_insert(pq, 3, 2);
    //Check that tails[2] was not changed, that the next of tails[2] was updated, prev and next of the new node is correct, and that nothing else has changed.
    if(pq->head->next->value != 2 || pq->head->next->priority != 2)
        {
            return -1;
        }
    //Make sure that head didn't get changed somehow
    if(pq->head->value != 0 || pq->head->priority != 0)
        {
            return -1;
        }
        if(pq->tails[2]->next != NULL)
        {
            return -1;
        }
        if(pq->tails[2]->priority!= 2)
            {
                return -1;
            }
        if(pq->tails[2]->prev->priority != 2)
            {
                return -1;
            }
        if(pq->tails[2]->value != 3)
            {
                return -1;
            }
        if(pq->tails[2]->prev->next != pq->tails[2])
            {
                return -1;
            }
        if(pq->tails[1] != NULL)
            {
                return -1;
            }
        puts("passed");
        return 0;
}
