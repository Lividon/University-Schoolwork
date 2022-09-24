/**
 * cse250.pa2.CircularQueueTests.scala
 *
 * Copyright 2020 Andrew Hughes (ahughes6@buffalo.edu)
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-nc-sa/4.0/.
 *
 * Submission author
 * UBIT:bkchanne
 * Person#:50267161
 *
 * Collaborators (include UBIT name of each, comma separated):
 * UBIT:
 */
package cse250.pa2

import org.scalatest.{BeforeAndAfter, FlatSpec}
import org.scalatest.Assertions._

class CircularQueueTests extends FlatSpec with BeforeAndAfter {
  behavior of "CircularQueue"

  it should "follow the example provided in the handout, and for calling reserve" in {
    val queue = new CircularQueue[Int](4); //capacity: 4

    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    queue.dequeue(); // returns 0
    queue.dequeue(); // returns 1
    queue.enqueue(4);
    queue.enqueue(5);
    //println(queue.apply(0))
    assert(queue.front == 2); // returns 2
    var prevcap = queue._capacity
    //for(e <- queue._dataArray) println(e);
    queue.enqueue(6); // triggers reserve.
    assert(queue._capacity == 2*prevcap)
    assert(queue._numStored == 5)
    assert(queue._capacity == 8)
    assert(queue.front == 2)
    queue.enqueue(7)
    assert(queue.front == 2);//make sure nothing funny happened to the front
    assert(queue.apply(queue._upperBound-1) == 7) //make sure the last number inserted is 7
    println(queue._numStored + "is the num stored")
  }
  //Tests for not calling reserve.
  behavior of "CircularQueue.apply"
    it should "Do be like a normal apply method" in {
        val queue = new CircularQueue[Int](4);
        assertThrows[IllegalArgumentException]{queue.apply(0)}
        queue.enqueue(0)
        assert(queue.apply(0) == 0)
        queue.enqueue(1)
        assert(queue.apply(1) == 1)
      }
    it should "not be the first index of the array, but the first index of the queue" in
    {
      val queue = new CircularQueue[Int](4);
      queue.enqueue(0)
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)
      queue.dequeue()
      queue.dequeue()
      assert(queue.apply(0) == 2)
    }
  behavior of "CircularQueue.length"
  it should "calculate the length properly as the size increases and decreases" in {
    val queue = new CircularQueue[Int](4)
    assert(queue.length == 0)
    queue.enqueue(0)
    assert(queue.length == 1)
    queue.enqueue(1);
    queue.enqueue(2);
    assert(queue.length == 3)
    queue.dequeue()
    assert(queue.length == 2)
  }
  behavior of "CircularQueue.iterator"
  it should "Iterate" in {
    val queue = new CircularQueue[Int](4)
    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    queue.dequeue(); // returns 0
    queue.dequeue(); // returns 1
    queue.enqueue(4);
    queue.enqueue(5);
    queue.enqueue(6); // triggers reserve.
    queue.enqueue(7)
    var iter = queue.iterator
    for(i <- 2 to 7)
      {
        assert(i == iter.next)
      }
    assert(iter.hasNext == false)
  }
  behavior of "CircularQueue.enqueue"
  it should "Queue items at the end of the queue" in{
    val queue = new CircularQueue[Int](4)
    queue.enqueue(0)
    queue.enqueue(1)
    assert(queue.apply(queue._numStored-1) == 1) //length-1 will give us the end
    // of the queue, and this is for before any reserve or dequeue calls
  }
  it should "Queue items in the correct spot, not just at the end, before any reserve calls" in {
    val queue = new CircularQueue[Int](4)
    queue.enqueue(0)
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    assert(queue._lowerBound == 0)
    assert(queue._upperBound == 4) //One more than the index we inserted to
    queue.dequeue()
    queue.dequeue()
    //We already tested dequeue functionality
    //2 should be returned by front, with the lower bound being 2 as well.
    //queue.enqueue(4)
    //queue.enqueue(5)
    //println(queue._numofDeques)
    queue.enqueue(4)
    //println(queue._numofDeques)
    queue.enqueue(5)
    assert(queue._lowerBound == 2) //One more than the index we inserted to
    //println(queue._numofDeques)
    assert(queue.front == 2) //
    assert(queue.apply(0) == 2) //2 is now at the beginning of the queue
    assert(queue.apply(1) == 3) //3 is right after
    assert(queue._dataArray.apply(0) == 4)//To make sure that the newest element is stored in the correct spot of the ARRAY, not the queue
    assert(queue._dataArray.apply(1) == 5)//To check the next index
  }
  it should "Enqueue properly after dequeuing, without hitting capacity" in
    {
      val queue = new CircularQueue[Int](10)
      queue.enqueue(0)
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)
      queue.dequeue()
      queue.dequeue()

      queue.enqueue(4)

      queue.enqueue(5)
      var iter = queue.iterator
      queue.enqueue(6)

    }
  behavior of "CircularQueue.front"
  it should "Return the item at index 0 before any removals/reserves" in {
    val queue = new CircularQueue[Int](4)
    queue.enqueue(0)
    queue.enqueue(1)
    assert(queue.front == 0)
  }
  it should "Return an error" in
  {
    val queue = new CircularQueue[Int](4)
    assertThrows[IllegalArgumentException]{queue.front}
  }
  behavior of "CircularQueue.dequeue"
  it should "Remove items at the front of the queue, before any reserve/extra removals" in{
    val queue = new CircularQueue[Int](4)
    queue.enqueue(0)
    queue.enqueue(1)
    assert(queue.length == 2)
    var num = queue.dequeue()
    assert(num == 0)
    assert(queue.length == 1)//Shows that the length went down
    var num2 = queue.dequeue() //Shows that it isn't just removing the first element
    assert(num2 == 1)
    assert(queue.length == 0)//Shows that the length went down
  }
  it should "Throw an error" in
  {
    val queue = new CircularQueue[Int](4)
    assertThrows[IllegalArgumentException]{queue.dequeue()}
  }
  it should "Throw another error" in
    {
      val queue = new CircularQueue[Int](4)
      queue.enqueue(0)
      queue.enqueue(1)
      queue.dequeue()
      queue.dequeue()
      assertThrows[IllegalArgumentException]{queue.dequeue()}
    }
  behavior of "Multiple queue functions"
  it should "enqueue, dequeue and reserve properly, while keeping it's structure correct" in
  {
    val queue = new CircularQueue[Int](4)
    queue.enqueue(0)
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    queue.enqueue(4)
    assert(queue.length == 5)
    queue.dequeue()//0
    queue.dequeue()//1
    queue.enqueue(6)
    queue.enqueue(7)
    queue.enqueue(8)
    assert(queue.apply(queue._upperBound-1) == 8)
    assert(queue.front == 2)
    assert(queue.dequeue == 2)
    assert(queue.dequeue == 3)
    assert(queue.dequeue == 4)
    assert(queue.dequeue == 5)
    assert(queue.dequeue == 6)
    assert(queue.dequeue == 7)
    assert(queue.dequeue == 8)
  }
}
