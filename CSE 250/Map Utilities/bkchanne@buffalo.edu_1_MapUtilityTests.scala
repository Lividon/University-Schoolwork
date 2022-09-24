/**
 * cse250.pa3.tests.MapUtilityTests.scala
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
package cse250.pa3.tests

import cse250.objects.{StreetGraph, TaxParcel}
import cse250.pa3.MapUtilities.{buildIntersectionGraph, computeFewestTurns}
import org.scalatest.{BeforeAndAfter, FlatSpec}

import scala.collection.mutable

class MapUtilityTests extends FlatSpec with BeforeAndAfter {

  // Your tests for problem 1(a) should be contained under this header.
  behavior of "MapUtilityTests 1(a)"
  it should "return the correct graph based on the given inputs" in {
    var intersectionIDs: mutable.Set[String] = mutable.Set("111226479")
    var nodeToStreetMapping: mutable.Map[String, mutable.Set[String]] = mutable.Map("111226479" -> mutable.Set("QUINN", "WALTER"))
    var graph = buildIntersectionGraph(intersectionIDs, nodeToStreetMapping)
    assert(graph.vertices.apply("QUINN").name == "QUINN")
    assert(graph.vertices.size == 2)
    assert(graph.edges.size == 2)
    assert(graph.vertices.apply("QUINN").edges.size == 1)
  }
  it should "Work properly with two turns" in{
    var intersectionIDs: mutable.Set[String] = mutable.Set("111226479","111338405")
    var nodeToStreetMapping: mutable.Map[String, mutable.Set[String]] = mutable.Map("111226479" -> mutable.Set("QUINN", "WALTER"), "111338405"->mutable.Set("MAURICE","QUINN"))
    var graph = buildIntersectionGraph(intersectionIDs, nodeToStreetMapping)
    assert(graph.vertices.apply("QUINN").name == "QUINN")
    assert(graph.vertices.size == 3)
    assert(graph.edges.size == 4)
    println(graph.edges)
    assert(graph.vertices.apply("QUINN").edges.size == 2)
  }

  // Your tests for problem 1(b) should be contained under this header.
  behavior of "MapUtilityTests 1(b)"
  it should "Return 1 because it's only 1 turn and 1 edge" in
    {
      var graph = new StreetGraph()
      var tax1 = new TaxParcel
      var tax2 = new TaxParcel
      //var graph = new StreetGraph()
      tax1.parcelInfo.addOne("STREET"->"WALTER")
      tax2.parcelInfo.addOne("STREET"->"QUINN")
      graph.insertVertex("WALTER")
      graph.insertVertex("QUINN")
      graph.insertEdge("QUINN","WALTER")
      graph.insertEdge("WALTER","QUINN")
      var value = computeFewestTurns(graph,tax1,tax2)
      assert(value == 1)
    }
  it should "Return 2 turns" in {
    var graph = new StreetGraph()
    var tax1 = new TaxParcel
    var tax2 = new TaxParcel
    //var graph = new StreetGraph()
    tax1.parcelInfo.addOne("STREET"->"WALTER")
    tax2.parcelInfo.addOne("STREET"->"MAURICE")
    graph.insertVertex("WALTER")
    graph.insertVertex("QUINN")
    graph.insertVertex("MAURICE")
    graph.insertEdge("QUINN","WALTER")
    graph.insertEdge("WALTER","QUINN")

    graph.insertEdge("MAURICE","QUINN")
    graph.insertEdge("QUINN","MAURICE")
    var value = computeFewestTurns(graph,tax1,tax2)
    assert(value == 2)
  }
  it should "Return the correct result with 3 turns" in {
    var graph = new StreetGraph()
    var tax1 = new TaxParcel
    var tax2 = new TaxParcel
    //var graph = new StreetGraph()
    tax1.parcelInfo.addOne("STREET"->"WALTER")
    tax2.parcelInfo.addOne("STREET"->"DEST")
    graph.insertVertex("WALTER")
    graph.insertVertex("QUINN")
    graph.insertVertex("MAURICE")
    graph.insertVertex("DEST")
    graph.insertEdge("QUINN","WALTER")
    graph.insertEdge("WALTER","QUINN")

    graph.insertEdge("MAURICE","QUINN")
    graph.insertEdge("QUINN","MAURICE")

    graph.insertEdge("MAURICE","DEST")
    graph.insertEdge("DEST","MAURICE")
    var value = computeFewestTurns(graph,tax1,tax2)
    assert(value == 3)
  }
  it should "Return the correct result with 3 turns, even when you can go further beyond" in {
    var graph = new StreetGraph()
    var tax1 = new TaxParcel
    var tax2 = new TaxParcel
    //var graph = new StreetGraph()
    tax1.parcelInfo.addOne("STREET"->"WALTER")
    tax2.parcelInfo.addOne("STREET"->"DEST")
    graph.insertVertex("WALTER")
    graph.insertVertex("QUINN")
    graph.insertVertex("MAURICE")
    graph.insertVertex("DEST")
    graph.insertVertex("PLACE4")
    graph.insertVertex("PLACE3")
    graph.insertVertex("PLACE2")
    graph.insertVertex("PLACE1")
    graph.insertEdge("QUINN","WALTER")
    graph.insertEdge("WALTER","QUINN")

    graph.insertEdge("MAURICE","QUINN")
    graph.insertEdge("QUINN","MAURICE")

    graph.insertEdge("PLACE1","DEST")
    graph.insertEdge("DEST","PLACE1")

    graph.insertEdge("PLACE2","DEST")
    graph.insertEdge("DEST","PLACE2")

    graph.insertEdge("PLACE3","DEST")
    graph.insertEdge("DEST","PLACE3")

    graph.insertEdge("PLACE3","PLACE4")
    graph.insertEdge("PLACE4","PLACE3")

    graph.insertEdge("MAURICE","DEST")
    graph.insertEdge("DEST","MAURICE")
    var value = computeFewestTurns(graph,tax1,tax2)
    assert(value == 3)
  }
  it should "Return the correct result with 3 turns the shortest path, When there is at least 1 longer path to take." in {
    var graph = new StreetGraph()
    var tax1 = new TaxParcel
    var tax2 = new TaxParcel
    //var graph = new StreetGraph()
    tax1.parcelInfo.addOne("STREET"->"WALTER")
    tax2.parcelInfo.addOne("STREET"->"DEST")
    graph.insertVertex("WALTER")
    graph.insertVertex("QUINN")
    graph.insertVertex("MAURICE")
    graph.insertVertex("DEST")
    graph.insertVertex("PLACE2")
    graph.insertVertex("PLACE1")
    graph.insertEdge("QUINN","WALTER")
    graph.insertEdge("WALTER","QUINN")

    graph.insertEdge("MAURICE","QUINN")
    graph.insertEdge("QUINN","MAURICE")

    graph.insertEdge("PLACE1","DEST")
    graph.insertEdge("DEST","PLACE1")

    graph.insertEdge("PLACE2","PLACE1")
    graph.insertEdge("PLACE1","PLACE2")

    graph.insertEdge("PLACE2","DEST")
    graph.insertEdge("DEST","PLACE2")

    graph.insertEdge("MAURICE","DEST")
    graph.insertEdge("DEST","MAURICE")
    var value = computeFewestTurns(graph,tax1,tax2)
    assert(value == 3)
  }
  it should "return -1 since they are not connected" in {
    var graph = new StreetGraph()
    var tax1 = new TaxParcel
    var tax2 = new TaxParcel
    //var graph = new StreetGraph()
    tax1.parcelInfo.addOne("STREET"->"WALTER")
    tax2.parcelInfo.addOne("STREET"->"STREET1")
    graph.insertVertex("WALTER")
    graph.insertVertex("QUINN")
    graph.insertVertex("STREET1")
    graph.insertEdge("QUINN","WALTER")
    graph.insertEdge("WALTER","QUINN")
    var value = computeFewestTurns(graph,tax1,tax2)
    assert(value == -1)
  }
  it should "Return the correct number even when there is a loop, but an exit" in {
    var graph = new StreetGraph()
    var tax1 = new TaxParcel
    var tax2 = new TaxParcel
    //var graph = new StreetGraph()
    tax1.parcelInfo.addOne("STREET"->"WALTER")
    tax2.parcelInfo.addOne("STREET"->"DEST")
    graph.insertVertex("WALTER")
    graph.insertVertex("QUINN")
    graph.insertVertex("MAURICE")
    graph.insertVertex("PLACE1")
    graph.insertVertex("DEST")
    graph.insertEdge("QUINN","WALTER")
    graph.insertEdge("WALTER","QUINN")

    graph.insertEdge("MAURICE","QUINN")
    graph.insertEdge("QUINN","MAURICE")

    graph.insertEdge("MAURICE","PLACE1")
    graph.insertEdge("PLACE1","MAURICE")

    graph.insertEdge("PLACE1","WALTER")
    graph.insertEdge("WALTER","PLACE1")

    graph.insertEdge("MAURICE","DEST")
    graph.insertEdge("DEST","MAURICE")
    var value = computeFewestTurns(graph,tax1,tax2)
    assert(value == 3)
  }
}

