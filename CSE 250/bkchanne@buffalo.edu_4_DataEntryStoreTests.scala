/**
 * cse250.pa1.DataEntryStoreTests.scala
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
package cse250.pa1

import cse250.objects.TaxParcel
import org.scalatest.{BeforeAndAfter, FlatSpec}


class DataEntryStoreTests extends FlatSpec with BeforeAndAfter {
  var _dataStore: DataEntryStore[TaxParcel] = _
  val _testCapacity = 10
  before {
    // This code will execute before each test.
    _dataStore = new DataEntryStore[TaxParcel](_testCapacity)
  }

  behavior of "DataEntryStore.dataArray"
  it should "should be initialized to all empty nodes" in {
    for(entry <- _dataStore.dataArray)
      assert(entry == _dataStore.emptyNode)
  }



  behavior of "DataEntryStore.head and DataEntryStore.tail"
  it should "always be initialized to -1" in {
    assert(_dataStore.headIndex == -1)
    assert(_dataStore.tailIndex == -1)
  }



  behavior of "DataEntryStore.length"
  it should "always be initialized to 0" in {
    assert(_dataStore.length == 0)
  }
  it should "Return 1 when 1 item is added" in {
    val parcel = new TaxParcel
    parcel.parcelInfo.addOne(TaxParcel.HEADERS(0) -> 1.toString)
    _dataStore.insert(parcel)
    assert(_dataStore.length == 1)
  }



  behavior of "DataEntryStore.insert"
  it should "..." in {
    val entries = 10
    for (i <- 0 until entries) {
      val parcel = new TaxParcel
      parcel.parcelInfo.addOne(TaxParcel.HEADERS(0) -> i.toString)
      _dataStore.insert(parcel)
      assert(_dataStore.length == i+1)
    }
  }



  behavior of "DataEntryStore.remove"
  it should "..." in {
    val entries = 10
    for (i <- 0 until entries) {
      val parcel = new TaxParcel
      parcel.parcelInfo.addOne(TaxParcel.HEADERS(0) -> i.toString)
      _dataStore.insert(parcel)
      assert(_dataStore.length == 1)
      _dataStore.remove(parcel)
      assert(_dataStore.length == 0)
    }
  }



  behavior of "DataEntryStore.apply"
  it should "return the item we just added" in {
    val parcel = new TaxParcel
    parcel.parcelInfo.addOne(TaxParcel.HEADERS(0) -> 1.toString)
    _dataStore.insert(parcel)
    assert(_dataStore.apply(0).equals(parcel))
  }


  
  it should "change the first and only item" in {
    val parcel = new TaxParcel
    parcel.parcelInfo.addOne(TaxParcel.HEADERS(0) -> 1.toString)
    val parcel2 = new TaxParcel
    parcel2.parcelInfo.addOne(TaxParcel.HEADERS(0) -> 2.toString)
    _dataStore.insert(parcel)
    _dataStore.update(0,parcel2)
    assert(_dataStore.apply(0) == parcel2)
  }


  behavior of "DataEntryStore.iterator"
  it should "not be usable after reaching the end" in {
    val parcel = new TaxParcel
    parcel.parcelInfo.addOne(TaxParcel.HEADERS(0) -> 1.toString)
    _dataStore.insert(parcel)
    var it = _dataStore.iterator
    while(it.hasNext == true)
      {
        assert(it.hasNext == true)
        var num = it.next()
      }
    assert(it.hasNext == false)
  }
}
