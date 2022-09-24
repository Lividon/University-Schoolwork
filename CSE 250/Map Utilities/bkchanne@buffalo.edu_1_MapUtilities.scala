/**
 * cse250.pa3.MapUtilities.scala
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
package cse250.pa3

import cse250.objects.{StreetGraph, TaxParcel}

import scala.:+
import scala.collection.mutable
import scala.collection.mutable.ArrayBuffer
import scala.xml.XML

object MapUtilities {
  def loadIntersectionIDs(filename: String): mutable.Set[String] =
    {
      var idList = scala.collection.mutable.Set[String]()
      var nodes = scala.xml.XML.loadFile(filename)
      var count = 0
      for(item <-(nodes \\ "@id"))
        {
          idList += item.toString()
          count += 1
        }
        println(count)

      idList
    }

  def loadMapInfo(filename: String): mutable.Map[String, mutable.Set[String]] =
    {
      //var idList = scala.collection.mutable.Set[String]()
      var nodeToStreetMapping: mutable.Map[String,mutable.Set[String]] = mutable.Map()
      var nodes = scala.xml.XML.loadFile(filename)
      var count1 = 0
      var count = 0
      for(item <- (nodes \\ "way"))
      {
        //We're now inside the "way" tag
        //First, ensure that our "way" tag contains a "<tag>" with k="tiger:name_base"
        //If it doesn't, it's not a street and we can ignore it.
        var keys = (item \\ "@k").map(_.text)
        var values = (item \\ "@v").map(_.text)
        if(keys.contains("tiger:name_base"))
          {
            //We are in a way tag that we care about.Find the name and then put that name with all IDS in the way tag.
            var idx = keys.indexOf("tiger:name_base")
            var name = values.apply(idx).toUpperCase()
            var ids = (item \\ "@ref").map(_.text)
            for(x<-ids)
              {
                if(nodeToStreetMapping.contains(x))
                  {
                    nodeToStreetMapping.apply(x).addOne(name)
                  }
                  else
                  {
                    var names = scala.collection.mutable.Set[String]()
                    names.addOne(name)
                    nodeToStreetMapping.addOne(x->names)
                  }
              }
          }
      }
      //println(nodeToStreetMapping)
      return nodeToStreetMapping
    }

  def buildIntersectionGraph(intersectionIDs: mutable.Set[String],
                             nodeToStreetMapping: mutable.Map[String, mutable.Set[String]]): StreetGraph =
    {
      var graph = new StreetGraph
      for(value<-nodeToStreetMapping)
        {
          if(intersectionIDs.contains(value._1) && value._2.size > 1)
            {
              for(street<-value._2)
              {
                //We must insert all verticies for insert edge to work
                graph.insertVertex(street)
              }
              var stuff = ArrayBuffer[String]()
              for(x<-value._2)
                {
                  stuff += x
                }
              for(i <- 1 to stuff.length-1)
                {
                  graph.insertEdge(stuff.apply(i),(stuff.apply(i-1)))
                  graph.insertEdge(stuff.apply(i-1),(stuff.apply(i)))
                }
            }
          /*if(intersectionIDs.contains(value._1) && value._2.size > 1)
            {
              for(street<-value._2)
                {
                  //We must insert all verticies for insert edge to work
                  graph.insertVertex(street)
                }
                for(i <- 1 to value._2.size-1)
                  {
                    for(j <- 1 to value._2.size-1)
                      {
                        if(j!=i)
                          {
                            graph.insertEdge(value._2)
                          }
                      }
                  }

            }*/
        }
      return graph
    }

  def computeFewestTurns(streetGraph: StreetGraph, start: TaxParcel, end: TaxParcel): Int =
    {
      //Use BFS
      var turns = BFS2(streetGraph, start.parcelInfo.apply("STREET"), end.parcelInfo.apply("STREET"))
      return turns
    }

def BFS2(graph: StreetGraph, Snode: String, end: String): Int =
  {
      var visited: ArrayBuffer[String] = ArrayBuffer(Snode)
      var toExplore: mutable.Queue[String] = new mutable.Queue[String]()
      var startVertex = graph.vertices.apply(Snode)
      toExplore.enqueue(Snode)
      var distance = 0
      if(Snode == end)
        {
          return distance
        }
      while(!toExplore.isEmpty) {
        distance = distance + 1
        var exploring = toExplore.dequeue()
        for(node<-graph.vertices.apply(exploring).edges)
          {
            if(!visited.contains(node))
              {
                toExplore.enqueue(node.name)
                visited.addOne(node.name)
              }
              if(node.name == end)
                {
                  return distance
                }
          }
    }
    -1
  }
  def computeFewestTurnsList(streetGraph: StreetGraph, start: TaxParcel, end: TaxParcel): Seq[String] = ???
}
