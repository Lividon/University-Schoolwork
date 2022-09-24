/**
 * cse250.pa2.CircularQueue.scala
 *
 * Copyright 2021 Andrew Hughes (ahughes6@buffalo.edu)
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

import cse250.types.mutable.QueueADT
import scala.reflect.ClassTag

class CircularQueue[A: ClassTag] (var _capacity: Int) extends QueueADT[A] with collection.Seq[A] {
  // Updates the toString to mention our class name instead of Seq.
  override protected[this] def className = "CircularQueue"
  // Member variables
  var _dataArray: Array[A] = new Array[A](_capacity)
  var _numStored: Int = 0
  var _lowerBound: Int = -1 //Gets updated on dequeues
  var _upperBound: Int = -1 //Gets updated on enqueues
  var _numofDeques: Int = 0 //Keeps track of the number dequeues
  var lengthTracker: Int = 0
  //This is used to calculate the proper index for apply and enqueue

  //This is used to calculate the proper index for apply and enqueue
  //NOTE TO SELF: CHECK IF CAPACITY = NUM STORED WHEN LOWERBOUND = UPPER BOUND
  //IF SO DO SOME SHIT OTHERWISE
  //FIGURE IT OUT LATER I'M HUNGRY NOW
  /** Gets element at position idx within the sequence. */
  override def apply(idx: Int): A =
    {
      require(0 <= idx && idx < _numStored)
      var finalIndex = (_lowerBound + idx) % _capacity
      //By adding the lower bound, which is start of the queue (The next thing to get dequeued) to
      // the idx, by modding it with capacity, this allows us to circle around if we enqueued and dequeued, thus
      //giving us the correct index
      //println(finalIndex)
      _dataArray(finalIndex)
    }

  /** Gets the number of elements stored within the sequence. */
  override def length: Int =
    {
      lengthTracker //I use an int to track the length instead of just using numStored, as a safety measure in case numStored
      //Gets messed up.
    }
  /** Returns an Iterator that can be used only once. */
  override def iterator: Iterator[A] = new Iterator[A]
  {
    var currentPos = _lowerBound
    var atStart = true //This variable is a safety measure, just in case lowerbound equals upperbound
    var iterations = 0 //We use this to know when to stop, this is another safety net for when upper and lower bounds are the same
    //println(((currentPos != _upperBound) && init))
    override def hasNext: Boolean = {(atStart) || (iterations != _numStored)}
    //at
    override def next(): A = {
      //println(_upperBound + "is the upper bound")
      if(currentPos == _upperBound && (!atStart))
      {
        //There is no value at upperbound, but if we reach there, and the number of iterations doesn't equal num stored
        //We go back to the front of the queue, i.e index 0 of data array
        currentPos = 0
      }
      atStart = false
      val retval = _dataArray.apply(currentPos) //get current value
      currentPos += 1
      iterations += 1
      //up iteration number to know when to stop
      retval
    }
  }

  /**
   * Reserves twice the capacity as the original Array.
   */
  private def reserve(): Unit =
    {
      var _tempArray: Array[A] = new Array(2 * _capacity)
      //Allocate a new array of 2 * capacity
      var iter = this.iterator
      var count = 0
      println()
      while(iter.hasNext) {
        {
          //Use the iterator to re order the _dataArray so that it looks like the numbers were inserted in order (as if no dequeues happened)
          //This makes it much easier to do further enqueues and dequeues, but adds a bit more runtime than just copy pasting
          var value = iter.next()
         _tempArray(count) = value
         count += 1
        }
        _upperBound = _numStored
        _lowerBound = 0
      }
      //copy the elements in the same way that they were previously stored
      _capacity = 2 * _capacity
      _dataArray = _tempArray
      //Change capacity and set data array to the array with twice the capacity.
    }

  /**
   * Enqueues the provided element.
   * @param elem element to be enqueued.
   */
  override def enqueue(elem: A): Unit =
    {
      lengthTracker += 1
      if(_numStored == 0)
      {
        //If the queue is empty, and we insert, we must change the
        //lower and upper bounds to 0 so that they update properly or they are 1 behind.
        _lowerBound = 0
        _upperBound = 0
      }
      if(_numStored == _capacity)
        {
          reserve()
        }
      else if(_lowerBound == _upperBound && _numStored != _capacity)
        {
          //Change the upper bound to be at the end of where we stored stuff, i.e track # of enqueues before a dequeue.
          //Turns out this was not needed.
        }
      _dataArray(_numStored-_lowerBound) = elem
      //By subtracting lowerBound from numStored, this allows me to know where I must insert to.
      _upperBound = _numStored-_lowerBound + 1
      _numStored += 1
      if(_numofDeques > 0)
        {
          //_numofDequeues is what helps us insert when there have been previous dequeues
          //When we enqueue and have had previous dequeues, we get rid of previous enqueues basically, so numofdequeues
          //Helps us keep track of how many times we dequeued so we know when to stop and skip over
          _numofDeques -= 1
        }
        println(_numStored + " Is the number stored after the enqueue just called")
    }

  /**
   * Returns the front of the queue.
   */
  override def front: A =
    {
      require(_numStored > 0)
      _dataArray.apply(_lowerBound) //Lower bound is just the front of the array
    }

  /**
   * Dequeues the appropriate element, if one exists.
   */
  override def dequeue(): A =
    {
      require(_numStored > 0)
      lengthTracker -= 1 //when an item gets dequed length goes down
      _numStored -= 1 //We decrement numStored so we know how many items are still in the queue
      _numofDeques += 1 //Adds to numofDequeues, a number that helps us enqueue when there were previous dequeues
      _lowerBound += 1 //Lower bound goes up because the number being dequeued no longer is in the queu
      var result = _dataArray.apply(_lowerBound-1) //return the number we dequeued
      if(_numStored == 0)
        {
          _lowerBound = -1
          _upperBound = -1
        }
        result
      //This works after dequeuing in succession
    }
}