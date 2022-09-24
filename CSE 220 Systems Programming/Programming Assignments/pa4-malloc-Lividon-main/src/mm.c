#include <string.h>
#include <stdio.h>
#include <stdbool.h>
#include <unistd.h>

/* The standard allocator interface from stdlib.h.  These are the
 * functions you must implement, more information on each function is
 * found below. They are declared here in case you want to use one
 * function in the implementation of another. */
void *malloc(size_t size);
void free(void *ptr);
void *calloc(size_t nmemb, size_t size);
void *realloc(void *ptr, size_t size);

/* When requesting memory from the OS using sbrk(), request it in
 * increments of CHUNK_SIZE. */
#define CHUNK_SIZE (1<<12)

/*
 * This function, defined in bulk.c, allocates a contiguous memory
 * region of at least size bytes.  It MAY NOT BE USED as the allocator
 * for pool-allocated regions.  Memory allocated using bulk_alloc()
 * must be freed by bulk_free().
 *
 * This function will return NULL on failure.
 */
extern void *bulk_alloc(size_t size);

/*
 * This function is also defined in bulk.c, and it frees an allocation
 * created with bulk_alloc().  Note that the pointer passed to this
 * function MUST have been returned by bulk_alloc(), and the size MUST
 * be the same as the size passed to bulk_alloc() when that memory was
 * allocated.  Any other usage is likely to fail, and may crash your
 * program.
 */
extern void bulk_free(void *ptr, size_t size);


static void *table[13]  = {NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL};

struct head
{
    size_t size;
    struct head *next;
};
static inline __attribute__((unused)) int block_index(size_t x) {
    if (x <= 8) {
        return 5;
    } else {
        return 32 - __builtin_clz((unsigned int)x + 7);
    }
}


void *malloc(size_t size) {

    int Ssize = block_index(size);
    struct head *block;
    struct head *next;
    if(Ssize < 5)
        {
            //Not our problem
            return NULL;
        }
     if(size > CHUNK_SIZE-8 || /*this one just in case*/Ssize > 12)
        {
            block = bulk_alloc(size + 8);
            block->size = size;
            return (void*)block + 8;
        }
     int bytes = 1 << Ssize;//Get the number of bytes to actually allocate
    if(table[Ssize] == NULL)
        {
            block = sbrk(CHUNK_SIZE);
            //Divive it into CHUNK_SIZE/bytes size, just so it works for everything
            for(int i = 0; i < CHUNK_SIZE/bytes; i ++)
                {
                    block->size = bytes-8;
                    block->next = table[Ssize];
                    table[Ssize] = block;
                    block = (void*)block + bytes;
                }
        }
    next = table[Ssize];
    table[Ssize] = next->next;//Yeah probably should have changed this but to late now
    return (void*)next+8;
}


void *calloc(size_t nmemb, size_t size) {
    if(nmemb <= 0)
        {
            return NULL;
        }
    void *ptr = bulk_alloc(nmemb * size);
    memset(ptr, 0, nmemb * size);
    return ptr;
}


void *realloc(void *ptr, size_t size) {
    if(ptr == NULL || size <= 0)
        {
            return NULL;
        }
    //header is 8 bytes behind pointer so
    struct head *header = ptr - 8;
    int Ssize = header->size;
    int size2 = size;//turn it into an int just so there's no like type error
    if(Ssize>= size2)
        {
            return ptr;
        }
    if(Ssize > CHUNK_SIZE-8)
        {
            int num = Ssize;
            if(size2 < Ssize)
                {
                    num = size;
                }
            void *pointer  = malloc(size);
            memcpy(pointer, ptr, num);
            free(ptr);
            return (void*)pointer;
        }
    else
        {
            void *pointer = malloc(size);
            memcpy(pointer, ptr, Ssize);
            free(ptr);
            return (void*)pointer;
        }
    return NULL;
}

/*
 * You should implement a free() that can successfully free a region of
 * memory allocated by any of the above allocation routines, whether it
 * is a pool- or bulk-allocated region.
 *
 * The given implementation does nothing.
 */
void free(void *ptr) {
    if(ptr == NULL)
    {
        return;
    }
    struct head *block = ptr-8;
    int size = block->size;
    if(size > 12 || size < 5)
        {
            //uh how did this happen
            return;
        }
    if(size > CHUNK_SIZE - 8)
        {
            //It's not our problem
            bulk_free((void*)block, size+8);
            return;
        }
    block->next = table[block_index(size)];
    table[block_index(size)] = block;
    return;
}
/*
bool validate_heap(void *ptr){
    return true;
}
struct block{
    size_t size;
    struct block *next;
    void* data;
    };
    I gave up on this*/
