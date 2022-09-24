CC := gcc
CFLAGS := -O -Wall -Werror -std=c99 -D_DEFAULT_SOURCE

all: rldecode

TESTS := test-isnumber test-decode test-hard

test: $(TESTS)
	./test-isnumber
	./test-decode
	./test-hard
rldecode: rldecode.o
	$(CC) -o rldecode $^

%.o: %.c
	$(CC) -c $< $(CFLAGS)

rldecode-nomain.o: rldecode.c
	$(CC) -c $< -o rldecode-nomain.o $(CFLAGS) -Dmain='__attribute__((unused)) nomain'

test-%: tests/test-%.c rldecode-nomain.o
	$(CC) -o $@ $^ $(CFLAGS)

clean:
	rm -f rldecode *.o *~ rldecode.tar $(TESTS)

submission: rldecode.tar

rldecode.tar: rldecode.c
	tar cf rldecode.tar $^

.PHONY: all clean submission
