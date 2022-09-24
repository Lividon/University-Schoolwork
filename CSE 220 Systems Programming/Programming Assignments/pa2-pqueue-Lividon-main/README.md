Priority Queue
===

You should have received a detailed handout for this project.  Be sure
to read it, as well as all of the given code, before you begin working.

Repository Layout
---

The files `src/priority_queue.c` and `src/priority_queue.h` will contain
your implementation.  They currently have only empty functions and usage
comments equivalent to the API description in the project handout.

The files in `tests` implement a unit-style tests for your code.  The
test in `null.c` is trivial, and the test in `insert_empty.c` tests only
a single case of `pqueue_insert()`.  The test in `insert_priorities.c`
ensures that nodes are inserted in priority order, but does not do any
structural verification.  You should implement additional tests in this
directory.

As usual, this README and the project Makefile are in the top-level
directory.  For this project you will have to modify the Makefile (so
that `make test` is maximally useful and your tests are submitted to
Autograder), and therefore it is extensively commented for your
understanding.

Testing
---

You are required to write a specific queue validator function in
`src/validate.c` as well as other testing programs in `tests/`.
_strongly encouraged_ to write other testing functions in test Any
`.c` file in `tests/` will be built into an executable and run with
`make test` if it is correctly added to the `MYTESTS` variable in the
Makefile.  See the comments in the Makefile for instructions on how to
accomplish this.

Each of the tests that you write should have a `main()` function and
return a non-zero exit status if it detects any problems with the API
functions that it is testing.  (See the handout for more information.)
Tests should not _implement_ the API functions, they should assume
that they are _provided with_ an implementation of the API and call
those functions.  Consult your testing lab handout, lab slides, and
implementation for additional advice and techniques.

Tests that are not added to `MYTESTS` _will not be submitted to
Autograder_ and thus will not be eligible for credit in part one of
this project.

Submission
---

Per usual, `make submission` will create the file `pqueue.tar` to be
submitted to Autograder.
